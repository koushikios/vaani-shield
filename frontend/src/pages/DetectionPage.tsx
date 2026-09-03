import { useRef, useState } from "react";
import {
  analyzeAudio,
  DetectionResponse,
} from "../lib/api";

export default function DetectionPage() {
  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [result, setResult] =
    useState<DetectionResponse | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [isRecording, setIsRecording] =
    useState(false);

  const [recordingTime, setRecordingTime] =
    useState(0);

  const mediaRecorderRef =
    useRef<MediaRecorder | null>(null);

  const audioChunksRef =
    useRef<Blob[]>([]);

  const timerRef =
    useRef<number | null>(null);

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0] ?? null;

    setSelectedFile(file);
    setResult(null);
    setError(null);
  }

  async function startRecording() {
    try {
      setError(null);
      setResult(null);

      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

      const recorder =
        new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(
            event.data
          );
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(
          audioChunksRef.current,
          {
            type: "audio/webm",
          }
        );

        const audioFile = new File(
          [audioBlob],
          `recorded_voice_${Date.now()}.webm`,
          {
            type: "audio/webm",
          }
        );

        setSelectedFile(audioFile);

        stream.getTracks().forEach(
          (track) => track.stop()
        );
      };

      recorder.start();

      setRecordingTime(0);
      setIsRecording(true);

      timerRef.current =
        window.setInterval(() => {
          setRecordingTime(
            (previous) => previous + 1
          );
        }, 1000);
    } catch {
      setError(
        "Microphone access was denied or is unavailable."
      );
    }
  }

  function stopRecording() {
    const recorder =
      mediaRecorderRef.current;

    if (
      recorder &&
      recorder.state !== "inactive"
    ) {
      recorder.stop();
    }

    if (timerRef.current !== null) {
      window.clearInterval(
        timerRef.current
      );

      timerRef.current = null;
    }

    setIsRecording(false);
  }

  function removeAudio() {
    if (isRecording) {
      stopRecording();
    }

    setSelectedFile(null);
    setResult(null);
    setError(null);
    setRecordingTime(0);
  }

  async function handleAnalyze() {
    if (!selectedFile) {
      setError(
        "Please upload or record an audio file first."
      );
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data =
        await analyzeAudio(selectedFile);

      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Analysis failed"
      );
    } finally {
      setLoading(false);
    }
  }

  function formatTime(seconds: number) {
    const minutes =
      Math.floor(seconds / 60);

    const remainingSeconds =
      seconds % 60;

    return `${minutes}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }

  const confidence =
    result
      ? result.confidence * 100
      : 0;

  const fakeProbability =
    result?.fake_probability !== undefined &&
    result?.fake_probability !== null
      ? result.fake_probability * 100
      : result &&
        result.prediction === "synthetic"
        ? confidence
        : 100 - confidence;

  const bonafideScore =
    result?.bonafide_score !== undefined &&
    result?.bonafide_score !== null
      ? result.bonafide_score * 100
      : result &&
        result.prediction === "genuine"
        ? confidence
        : 100 - confidence;

  function downloadReport() {
    if (!result) return;

    const reportDate =
      new Date().toLocaleString();

    const verdict =
      result.prediction === "genuine"
        ? "GENUINE"
        : "SYNTHETIC";

    const reportContent = `
VAANI SHIELD
VOICE AUTHENTICITY ANALYSIS REPORT

--------------------------------------------------

ANALYSIS SUMMARY

Verdict: ${verdict}
Detection Confidence: ${confidence.toFixed(1)}%
Fake Probability: ${fakeProbability.toFixed(1)}%
Bonafide Score: ${bonafideScore.toFixed(1)}%

--------------------------------------------------

FILE INFORMATION

Filename: ${result.filename}
Analysis Date: ${reportDate}

Processing Time: ${
      result.processing_time_ms ?? "N/A"
    } ms

--------------------------------------------------

ABOUT THE RESULT

Vaani Shield uses an AI-based speech deepfake detection
pipeline to analyze whether an audio recording appears
to be genuine human speech or potentially AI-generated.

This result should be used as decision-support information
and should not be treated as absolute forensic proof.

--------------------------------------------------

Generated by Vaani Shield
Voice Authenticity Detection System
`;

    const blob = new Blob(
      [reportContent],
      {
        type: "text/plain",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `vaani_shield_report_${result.session_id}.txt`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  return (
    <div
      className="container"
      style={{
        paddingTop: "48px",
        paddingBottom: "64px",
      }}
    >
      <h1 className="page-title">
        Detection Console
      </h1>

      <p className="page-subtitle">
        Upload or record a voice clip to analyze
        whether it is genuine or AI-generated.
      </p>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>
          🎙 Voice Analysis
        </h2>

        <div
          style={{
            marginBottom: "28px",
          }}
        >
          <p>
            <strong>
              Upload an audio file
            </strong>
          </p>

          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
          />
        </div>

        <div
          style={{
            borderTop:
              "1px solid var(--color-border)",
            paddingTop: "24px",
          }}
        >
          <p>
            <strong>
              Or record your voice
            </strong>
          </p>

          {!isRecording ? (
            <button
              className="btn-primary"
              onClick={startRecording}
            >
              🎙 Start Recording
            </button>
          ) : (
            <div>
              <p
                style={{
                  color:
                    "var(--color-synthetic)",
                  fontWeight: "bold",
                }}
              >
                🔴 Recording...{" "}
                {formatTime(recordingTime)}
              </p>

              <button
                className="btn-secondary"
                onClick={stopRecording}
              >
                ⏹ Stop Recording
              </button>
            </div>
          )}
        </div>

        {selectedFile && !isRecording && (
          <div
            style={{
              marginTop: "28px",
              paddingTop: "24px",
              borderTop:
                "1px solid var(--color-border)",
            }}
          >
            <p>
              <strong>
                Selected audio:
              </strong>{" "}
              {selectedFile.name}
            </p>

            <audio
              controls
              src={URL.createObjectURL(
                selectedFile
              )}
              style={{
                width: "100%",
                marginBottom: "20px",
              }}
            />

            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <button
                className="btn-primary"
                onClick={handleAnalyze}
                disabled={loading}
              >
                {loading
                  ? "⏳ Analyzing..."
                  : "Analyze Voice"}
              </button>

              <button
                className="btn-secondary"
                onClick={removeAudio}
              >
                Remove Audio
              </button>
            </div>
          </div>
        )}

        {error && (
          <div
            className="card"
            style={{
              marginTop: "24px",
              borderColor:
                "var(--color-synthetic)",
            }}
          >
            <p
              style={{
                margin: 0,
                color:
                  "var(--color-synthetic)",
              }}
            >
              {error}
            </p>
          </div>
        )}
      </div>

      {result && (
        <div
          className="card"
          style={{
            marginTop: "28px",
          }}
        >
          <div
            style={{
              textAlign: "center",
              paddingBottom: "28px",
              borderBottom:
                "1px solid var(--color-border)",
            }}
          >
            <p
              style={{
                marginTop: 0,
                color:
                  "var(--color-text-secondary)",
                letterSpacing: "1px",
                fontSize: "13px",
              }}
            >
              ANALYSIS RESULT
            </p>

            <div
              style={{
                fontSize: "48px",
                marginBottom: "12px",
              }}
            >
              {result.prediction === "genuine"
                ? "✓"
                : "⚠"}
            </div>

            <h1
              style={{
                margin: 0,
                textTransform: "uppercase",
                color:
                  result.prediction === "genuine"
                    ? "var(--color-genuine)"
                    : "var(--color-synthetic)",
              }}
            >
              {result.prediction}
            </h1>

            <p
              style={{
                color:
                  "var(--color-text-secondary)",
                marginBottom: 0,
              }}
            >
              {result.prediction === "genuine"
                ? "Voice appears to be authentic."
                : "Voice shows characteristics of AI-generated or manipulated audio."}
            </p>
          </div>

          <div
            style={{
              marginTop: "28px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                marginBottom: "10px",
              }}
            >
              <strong>
                Detection Confidence
              </strong>

              <strong>
                {confidence.toFixed(1)}%
              </strong>
            </div>

            <div
              style={{
                width: "100%",
                height: "12px",
                background:
                  "var(--color-surface-alt)",
                borderRadius: "20px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${confidence}%`,
                  height: "100%",
                  borderRadius: "20px",
                  background:
                    result.prediction === "genuine"
                      ? "var(--color-genuine)"
                      : "var(--color-synthetic)",
                  transition:
                    "width 0.8s ease",
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "18px",
              marginTop: "28px",
            }}
          >
            <div className="card">
              <p
                style={{
                  marginTop: 0,
                  color:
                    "var(--color-text-secondary)",
                }}
              >
                Detection Confidence
              </p>

              <strong
                style={{
                  fontSize: "28px",
                }}
              >
                {confidence.toFixed(1)}%
              </strong>
            </div>

            <div className="card">
              <p
                style={{
                  marginTop: 0,
                  color:
                    "var(--color-text-secondary)",
                }}
              >
                Fake Probability
              </p>

              <strong
                style={{
                  fontSize: "28px",
                  color:
                    "var(--color-synthetic)",
                }}
              >
                {fakeProbability.toFixed(1)}%
              </strong>
            </div>

            <div className="card">
              <p
                style={{
                  marginTop: 0,
                  color:
                    "var(--color-text-secondary)",
                }}
              >
                Bonafide Score
              </p>

              <strong
                style={{
                  fontSize: "28px",
                  color:
                    "var(--color-genuine)",
                }}
              >
                {bonafideScore.toFixed(1)}%
              </strong>
            </div>
          </div>

          <div
            style={{
              marginTop: "28px",
              paddingTop: "20px",
              borderTop:
                "1px solid var(--color-border)",
              display: "flex",
              justifyContent:
                "space-between",
              gap: "16px",
              flexWrap: "wrap",
              color:
                "var(--color-text-secondary)",
            }}
          >
            <span>
              📁 {result.filename}
            </span>

            {result.processing_time_ms !==
              undefined &&
              result.processing_time_ms !==
                null && (
                <span>
                  ⚡ Analysis completed in{" "}
                  {result.processing_time_ms} ms
                </span>
              )}
          </div>

          <div
            style={{
              marginTop: "24px",
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <button
              className="btn-primary"
              onClick={downloadReport}
            >
              📄 Download Analysis Report
            </button>

            <button
              className="btn-secondary"
              onClick={removeAudio}
            >
              🔄 Analyze Another Voice
            </button>
          </div>
        </div>
      )}
    </div>
  );
}