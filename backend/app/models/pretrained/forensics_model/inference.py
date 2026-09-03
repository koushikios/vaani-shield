"""
Speech deepfake detection.

Run:
python inference.py <audio.wav>

Audio is converted to mono / 16 kHz
and trimmed or padded to 5 seconds.
"""

import os
import sys

import librosa
import torch

from model import DeepfakeDetector


CHECKPOINT = "checkpoint_epoch_5.pt"
REPO_ID = "eliya/forensics_0.3B_base_deepfake_classifier"


def load_audio(
    path,
    sr=16000,
    seconds=5.0,
):
    """
    Load audio using librosa.

    This avoids TorchCodec / FFmpeg compatibility
    issues on macOS.
    """

    audio, _ = librosa.load(
        path,
        sr=sr,
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
        seconds * sr
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


def load_state_dict(
    pt_path,
):
    """
    Prefer the safe .safetensors checkpoint.
    """

    from safetensors.torch import (
        load_file,
    )

    st_path = (
        pt_path.rsplit(
            ".",
            1,
        )[0]
        + ".safetensors"
    )

    if os.path.exists(
        st_path
    ):
        return load_file(
            st_path
        )

    checkpoint = torch.load(
        pt_path,
        map_location="cpu",
        weights_only=False,
    )

    if (
        isinstance(
            checkpoint,
            dict,
        )
        and "model_state_dict"
        in checkpoint
    ):
        return checkpoint[
            "model_state_dict"
        ]

    return checkpoint


@torch.no_grad()
def main():

    if len(sys.argv) < 2:

        sys.exit(
            "Usage: python inference.py <audio.wav>"
        )

    audio_path = sys.argv[1]

    device = "cuda" if (
        torch.cuda.is_available()
    ) else "cpu"

    print(
        "Loading deepfake detection model..."
    )

    model = DeepfakeDetector()

    model = model.to(
        device
    )

    model.eval()

    state_dict = load_state_dict(
        CHECKPOINT
    )

    model.load_state_dict(
        state_dict,
        strict=False,
    )

    print(
        "Loading audio..."
    )

    wav = load_audio(
        audio_path
    )

    wav = wav.unsqueeze(
        0
    ).to(
        device
    )

    print(
        "Analyzing audio..."
    )

    output = model(
        wav
    )

    bonafide = torch.sigmoid(
        output
    ).item()

    fake = (
        1.0 - bonafide
    )

    verdict = (
        "FAKE"
        if fake >= 0.5
        else "REAL"
    )

    print()
    print(
        f"fake_probability: {fake:.4f}"
    )

    print(
        f"bonafide_score:   {bonafide:.4f}"
    )

    print(
        f"verdict: {verdict}"
    )


if __name__ == "__main__":
    main()