from __future__ import annotations

import os
import tempfile

import librosa
import numpy as np


def process_audio_file(
    audio_bytes: bytes,
    filename: str,
) -> dict:
    """
    Reads an uploaded audio file and extracts numerical
    characteristics from the actual audio signal.
    """

    suffix = os.path.splitext(filename)[1] or ".wav"

    temp_path = None

    try:
        with tempfile.NamedTemporaryFile(
            suffix=suffix,
            delete=False,
        ) as temp_file:
            temp_file.write(audio_bytes)
            temp_path = temp_file.name

        # Load and convert audio to mono at a standard sample rate.
        audio, sample_rate = librosa.load(
            temp_path,
            sr=16000,
            mono=True,
        )

        if len(audio) == 0:
            raise ValueError("The uploaded audio file is empty.")

        duration = float(
            librosa.get_duration(
                y=audio,
                sr=sample_rate,
            )
        )

        # Root Mean Square energy.
        rms = librosa.feature.rms(y=audio)[0]

        # Zero Crossing Rate.
        zcr = librosa.feature.zero_crossing_rate(
            audio
        )[0]

        # Spectral centroid.
        spectral_centroid = librosa.feature.spectral_centroid(
            y=audio,
            sr=sample_rate,
        )[0]

        # Spectral bandwidth.
        spectral_bandwidth = librosa.feature.spectral_bandwidth(
            y=audio,
            sr=sample_rate,
        )[0]

        # Spectral rolloff.
        spectral_rolloff = librosa.feature.spectral_rolloff(
            y=audio,
            sr=sample_rate,
        )[0]

        # MFCC features.
        mfcc = librosa.feature.mfcc(
            y=audio,
            sr=sample_rate,
            n_mfcc=13,
        )

        return {
            "duration": round(duration, 3),
            "sample_rate": int(sample_rate),
            "num_samples": int(len(audio)),

            "rms_mean": float(np.mean(rms)),
            "rms_std": float(np.std(rms)),

            "zcr_mean": float(np.mean(zcr)),

            "spectral_centroid_mean": float(
                np.mean(spectral_centroid)
            ),

            "spectral_bandwidth_mean": float(
                np.mean(spectral_bandwidth)
            ),

            "spectral_rolloff_mean": float(
                np.mean(spectral_rolloff)
            ),

            "mfcc_mean": [
                float(value)
                for value in np.mean(
                    mfcc,
                    axis=1,
                )
            ],
        }

    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)