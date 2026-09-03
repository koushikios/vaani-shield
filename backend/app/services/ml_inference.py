from __future__ import annotations

from typing import Any

import numpy as np


def predict_audio(features: dict[str, Any]) -> dict[str, Any]:
    """
    Prototype inference service using real audio features.

    This is not yet a trained deepfake detection model.
    It provides a feature-based prediction pipeline that can later
    be replaced with a trained ML model.
    """

    duration = float(features["duration"])
    rms_std = float(features["rms_std"])
    zcr_mean = float(features["zcr_mean"])
    spectral_centroid = float(
        features["spectral_centroid_mean"]
    )
    spectral_bandwidth = float(
        features["spectral_bandwidth_mean"]
    )

    mfcc_values = np.array(
        features["mfcc_mean"],
        dtype=float,
    )

    mfcc_variation = float(np.std(mfcc_values))

    duration_score = min(duration / 10.0, 1.0)

    energy_variation_score = min(
        rms_std * 20.0,
        1.0,
    )

    zcr_score = min(
        zcr_mean * 10.0,
        1.0,
    )

    centroid_score = min(
        spectral_centroid / 4000.0,
        1.0,
    )

    bandwidth_score = min(
        spectral_bandwidth / 4000.0,
        1.0,
    )

    mfcc_score = min(
        mfcc_variation / 50.0,
        1.0,
    )

    synthetic_score = (
        0.20 * (1.0 - energy_variation_score)
        + 0.15 * (1.0 - zcr_score)
        + 0.20 * centroid_score
        + 0.15 * bandwidth_score
        + 0.20 * (1.0 - mfcc_score)
        + 0.10 * (1.0 - duration_score)
    )

    synthetic_probability = float(
        np.clip(synthetic_score, 0.0, 1.0)
    )

    genuine_probability = 1.0 - synthetic_probability

    if synthetic_probability >= 0.5:
        prediction = "synthetic"
        confidence = synthetic_probability
    else:
        prediction = "genuine"
        confidence = genuine_probability

    return {
        "prediction": prediction,
        "confidence": round(confidence, 4),
        "genuine_probability": round(
            genuine_probability,
            4,
        ),
        "synthetic_probability": round(
            synthetic_probability,
            4,
        ),
    }