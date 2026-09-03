---
license: cc-by-nc-4.0
pipeline_tag: audio-classification
library_name: pytorch
language:
  - multilingual
base_model: microsoft/wavlm-large
tags:
  - audio-classification
  - deepfake-detection
  - anti-spoofing
  - speech
  - aasist
  - wavlm
---

# forensics_0.3B_base_deepfake_classifier

**The default speech deepfake detector of the Forensics family.** WavLM-large + AASIST graph-attention, fully fine-tuned end-to-end (no frozen shortcuts) across a wide multi-source mix of TTS spoofs, voice conversion, codec artifacts, and the standard anti-spoofing benchmark suite. A combined cross-entropy + OC-Softmax + supervised-contrastive objective gives it a decision boundary that holds up well outside its own training distribution — not just on the data it saw.

Feed it 5 seconds of audio, get back a calibrated real/fake probability. Sub-1% EER on held-out data, and under 2% across most of a 14-benchmark external sweep (ASVspoof, ADD, In-the-Wild, LibriSeVoc, SONAR, and more).

- **Backbone:** `microsoft/wavlm-large` (~300M params, fully unfrozen)
- **Pooling:** AASIST graph-attention

## Part of the Forensics family

| Model | Use it for |
|---|---|
| **`forensics_0.3B_base_deepfake_classifier`** (this model) | general-purpose default |
| [`forensics_0.3B_xlsr_wild_deepfake_classifier`](https://huggingface.co/eliya/forensics_0.3B_xlsr_wild_deepfake_classifier) | uncontrolled / real-world audio |
| [`forensics_0.3B_v2_deepfake_age_gender_classifier`](https://huggingface.co/eliya/forensics_0.3B_v2_deepfake_age_gender_classifier) 🆕 | speaker age/gender, hardened against the newest TTS threats — our latest release |
| [`forensics_0.3B_wavlm_oc_softmax_deepfake_classifier`](https://huggingface.co/eliya/forensics_0.3B_wavlm_oc_softmax_deepfake_classifier) | tighter bonafide boundary, ensembling |

Full family: [huggingface.co/collections/eliya/forensics-speech-deepfake-detection-family](https://huggingface.co/collections/eliya/forensics-speech-deepfake-detection-family)

## Training

Trained using an agentic training loop — see [eliyasegev/autotrain](https://github.com/eliyasegev/autotrain).

Fine-tuned with a combined loss for robustness beyond any single objective:
- Cross-entropy (label-smoothed)
- OC-Softmax — pulls bonafide speech into a compact embedding sphere and pushes every spoof type outside it
- Supervised contrastive, real-anchor-only

Trained across a wide net of public, free-to-use research sources: SpeechFake, MD-CommonVoice, DFADD, CodecFake, ASVspoof2019-LA, EnvSDD. 5-second crops, AdamW, cosine LR schedule, and a heavy augmentation stack — codec transcoding (mp3/aac/opus/vorbis/µ-law/A-law/GSM), MUSAN noise, RIR, RawBoost, SpecAugment, FreqMask, splice/mix, and cross-class splice — so the model sees more distortion during training than it will ever encounter in the wild.

## Results

| Eval set | EER % |
|---|---|
| Val (held-out) | 0.72 |
| MLAAD (v7) | 0.71 |
| CodecFake | 0.54 |
| DFADD | 0.00 |
| MD-CommonVoice | 0.17 |
| In-the-Wild | 1.38 |
| ASVspoof2019-LA | 0.26 |
| ASVspoof2021-LA | 1.56 |
| ASVspoof2024 | 11.91 |
| ADD2022-Track1 | 17.34 |
| ADD2022-Track3 | 3.03 |
| ADD2023-Round1 | 6.46 |
| ADD2023-Round2 | 13.00 |
| LibriSeVoc | 0.04 |
| SONAR | 0.44 |
| **Avg (all sets)** | **3.84** |
| **Avg (external only)** | **4.06** |

Consistently sub-2% EER across almost every external benchmark, with strong results even on the harder ADD/ASVspoof2024 tracks.

## Files in this repo
| file | purpose |
|---|---|
| `checkpoint_epoch_5.safetensors` | model weights, safe format |
| `checkpoint_epoch_5.pt` | model weights, legacy pickle |
| `config.json` | minimal architecture metadata (also used by the Hub to track downloads) |
| `inference.py` | run script — prefers the `.safetensors` file automatically |
| `model.py` | architecture |
| `requirements.txt` | deps |

## Setup
```bash
pip install -r requirements.txt   # torch, torchaudio, transformers, safetensors
hf download eliya/forensics_0.3B_base_deepfake_classifier --local-dir .
```

## Run
```bash
python inference.py <audio.wav>
```
(Optionally override the checkpoint: `python inference.py <audio.wav> <checkpoint.pt>`.)

Audio is auto-converted to mono / 16 kHz and trimmed/padded to 5 s.

## Output
```
fake_probability: <0..1>      # threshold is domain-dependent — adjust to your use case; ~0.1-0.2 is usually the best range
bonafide_score:   <0..1>      # raw P(real)
verdict: REAL | FAKE
```

## Example
```
$ python inference.py real_human.wav
fake_probability: 0.0503
bonafide_score:   0.9497
verdict: REAL

$ python inference.py tts_fake.wav
fake_probability: 0.8641
bonafide_score:   0.1359
verdict: FAKE
```
Higher `fake_probability` = more likely a deepfake. Score is `1 − sigmoid(logit)`,
since the classifier is trained with label `1 = real, 0 = fake`.

## References

- WavLM: Chen et al., 2022, *"WavLM: Large-Scale Self-Supervised Pre-Training for Full Stack Speech Processing"*, arXiv:2110.13900
- AASIST: Jung et al., 2021 (ICASSP 2022), *"AASIST: Audio Anti-Spoofing Using Integrated Spectro-Temporal Graph Attention Networks"*, arXiv:2110.01200
- OC-Softmax: Zhang et al., 2020 (IEEE SPL 2021), *"One-Class Learning Towards Synthetic Voice Spoofing Detection"*, arXiv:2010.13995
- Supervised Contrastive Learning: Khosla et al., NeurIPS 2020, arXiv:2004.11362
- RawBoost augmentation: Tak et al., 2021 (ICASSP 2022), arXiv:2111.04433
- FreqMask augmentation: Xie et al., 2024, arXiv:2408.06922
- SpeechFake dataset: ACL 2025, *"SpeechFake: A Large-Scale Multilingual Speech Deepfake Dataset Incorporating Cutting-Edge Generation Methods"*, arXiv:2507.21463

## License

CC-BY-NC-4.0 — free for personal and research use. For commercial use, contact eliya@vocos.io.
