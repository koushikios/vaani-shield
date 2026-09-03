import torch
import librosa
from transformers import AutoFeatureExtractor, AutoModelForAudioClassification


MODEL_NAME = "eliya/forensics_0.3B_base_deepfake_classifier"


def load_audio(audio_path: str):
    audio, sample_rate = librosa.load(
        audio_path,
        sr=16000,
        mono=True,
    )

    return audio, sample_rate


print("Loading model...")
print("The first run may take time because the model will download.")


feature_extractor = AutoFeatureExtractor.from_pretrained(
    MODEL_NAME
)

model = AutoModelForAudioClassification.from_pretrained(
    MODEL_NAME
)

model.eval()

print("Model loaded successfully!")
print()
print("Model labels:")

for label_id, label_name in model.config.id2label.items():
    print(f"{label_id}: {label_name}")


def analyze_audio(audio_path: str):
    print()
    print("=" * 60)
    print(f"Analyzing: {audio_path}")

    audio, sample_rate = load_audio(audio_path)

    inputs = feature_extractor(
        audio,
        sampling_rate=sample_rate,
        return_tensors="pt",
        padding=True,
    )

    with torch.no_grad():
        outputs = model(**inputs)

    probabilities = torch.softmax(
        outputs.logits,
        dim=-1,
    )[0]

    print()

    for index, probability in enumerate(probabilities):
        label = model.config.id2label[index]

        print(
            f"{label}: "
            f"{float(probability) * 100:.2f}%"
        )


analyze_audio(
    "/Users/koushikl/Downloads/vaani_test_human_like.wav"
)

analyze_audio(
    "/Users/koushikl/Downloads/vaani_test_synthetic_like.wav"
)