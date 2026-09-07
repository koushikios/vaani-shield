import sys
from pathlib import Path

import librosa
import torch
from safetensors.torch import load_file


BACKEND_DIR = Path(__file__).resolve().parents[2]

MODEL_DIR = (
    BACKEND_DIR
    / "app"
    / "models"
    / "pretrained"
    / "forensics_model"
)

CHECKPOINT_PATH = (
    MODEL_DIR
    / "checkpoint_epoch_5.safetensors"
)


# Allow Python to import model.py
# from the downloaded model folder.
if str(MODEL_DIR) not in sys.path:
    sys.path.insert(
        0,
        str(MODEL_DIR),
    )


from model import DeepfakeDetector


class DeepfakeDetectionService:

    def __init__(self):

        self.device = (
            "cuda"
            if torch.cuda.is_available()
            else "cpu"
        )

        print(
            "Loading pretrained deepfake detection model..."
        )

        self.model = (
            DeepfakeDetector()
            .to(self.device)
            .eval()
        )

        state_dict = load_file(
            str(CHECKPOINT_PATH)
        )

        self.model.load_state_dict(
            state_dict,
            strict=False,
        )

        print(
            "Deepfake detection model loaded successfully."
        )


    def load_audio(
        self,
        audio_path: str,
        sample_rate: int = 16000,
        seconds: float = 5.0,
    ):

        audio, _ = librosa.load(
            audio_path,
            sr=sample_rate,
            mono=True,
        )

        wav = torch.tensor(
            audio,
            dtype=torch.float32,
        )

        wav = wav / (
            wav.abs().max() + 1e-8
        )

        target_length = int(
            sample_rate * seconds
        )

        current_length = wav.shape[0]

        if current_length < target_length:

            repeats = (
                target_length
                + current_length
                - 1
            ) // current_length

            wav = wav.repeat(
                repeats
            )[:target_length]

        elif current_length > target_length:

            start = (
                current_length
                - target_length
            ) // 2

            wav = wav[
                start:
                start + target_length
            ]

        return wav


    @torch.no_grad()
    def analyze(
        self,
        audio_path: str,
    ):

        wav = self.load_audio(
            audio_path
        )

        wav = (
            wav
            .unsqueeze(0)
            .to(self.device)
        )

        output = self.model(
            wav
        )

        bonafide_score = (
            torch.sigmoid(
                output
            )
            .item()
        )

        fake_probability = (
            1.0
            - bonafide_score
        )

        prediction = (
            "synthetic"
            if fake_probability >= 0.5
            else "genuine"
        )

        confidence = (
            fake_probability
            if prediction == "synthetic"
            else bonafide_score
        )

        return {
            "prediction": prediction,
            "confidence": confidence,
            "fake_probability": fake_probability,
            "bonafide_score": bonafide_score,
        }


detector_service = None


def get_detector_service():
    global detector_service

    if detector_service is None:
        detector_service = DeepfakeDetectionService()

    return detector_service