from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4
import subprocess
import time

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.db import get_db
from app.models.db_models import AnalysisSession
from app.services.deepfake_detector import get_detector_service


router = APIRouter()


UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


def convert_to_wav(
    input_path: Path,
    output_path: Path,
) -> None:
    command = [
        "ffmpeg",
        "-y",
        "-i",
        str(input_path),
        "-ac",
        "1",
        "-ar",
        "16000",
        str(output_path),
    ]

    subprocess.run(
        command,
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.PIPE,
    )


@router.post("/api/detect")
async def detect_audio(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    filename = file.filename or "unknown_audio"

    audio_bytes = await file.read()

    if not audio_bytes:
        raise HTTPException(
            status_code=400,
            detail="The uploaded audio file is empty.",
        )

    session_id = str(uuid4())

    file_extension = Path(filename).suffix.lower()

    if not file_extension:
        file_extension = ".wav"

    input_file_path = (
        UPLOAD_DIR
        / f"{session_id}{file_extension}"
    )

    converted_wav_path = (
        UPLOAD_DIR
        / f"{session_id}.wav"
    )

    analysis_file_path = input_file_path

    start_time = time.perf_counter()

    try:
        input_file_path.write_bytes(
            audio_bytes
        )

        # WAV files go directly to the model.
        # Other audio formats are converted first.
        if file_extension != ".wav":

            convert_to_wav(
                input_file_path,
                converted_wav_path,
            )

            analysis_file_path = (
                converted_wav_path
            )
detector_service = get_detector_service()

result = detector_service.analyze(
    str(analysis_file_path)

        )

        processing_time_ms = int(
            (
                time.perf_counter()
                - start_time
            )
            * 1000
        )

        # Convert model prediction into
        # the database/frontend format.
        prediction = result["prediction"]

        confidence = result["confidence"]

        # Save the analysis permanently.
        analysis_session = AnalysisSession(
            session_id=session_id,
            filename=filename,
            prediction=prediction,
            confidence=confidence,
            processing_time_ms=processing_time_ms,
            explanation_summary=(
                "Audio analyzed using the "
                "deepfake detection model."
            ),
        )

        db.add(
            analysis_session
        )

        db.commit()

        db.refresh(
            analysis_session
        )

        return {
            "session_id": session_id,
            "filename": filename,
            "prediction": prediction,
            "confidence": confidence,
            "fake_probability": result[
                "fake_probability"
            ],
            "bonafide_score": result[
                "bonafide_score"
            ],
            "processing_time_ms": processing_time_ms,
            "created_at": datetime.now(
                timezone.utc
            ).isoformat(),
        }

    except subprocess.CalledProcessError as exc:

        error_output = (
            exc.stderr.decode(
                "utf-8",
                errors="ignore",
            )
            if exc.stderr
            else "Unknown FFmpeg error"
        )

        raise HTTPException(
            status_code=400,
            detail=(
                "Unable to convert the uploaded "
                f"audio file: {error_output}"
            ),
        ) from exc

    except Exception as exc:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to analyze audio: "
                f"{str(exc)}"
            ),
        ) from exc

    finally:

        if input_file_path.exists():
            input_file_path.unlink()

        if converted_wav_path.exists():
            converted_wav_path.unlink()