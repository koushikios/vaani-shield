export default function AboutPage() {
  const steps = [
    {
      number: "01",
      icon: "🎙️",
      title: "Voice Input",
      description:
        "The user can upload an existing audio file or record a voice directly through the browser using the microphone.",
    },
    {
      number: "02",
      icon: "⚙️",
      title: "Audio Processing",
      description:
        "The backend prepares the audio for analysis by converting it into a suitable format, processing it as mono audio, and preparing it for the detection pipeline.",
    },
    {
      number: "03",
      icon: "🤖",
      title: "AI Deepfake Detection",
      description:
        "The processed voice is analyzed using a deepfake detection model based on a WavLM-large backbone and AASIST graph-attention architecture.",
    },
    {
      number: "04",
      icon: "📊",
      title: "Authenticity Result",
      description:
        "The system calculates a prediction and confidence score, helping identify whether the voice is likely genuine or synthetic.",
    },
    {
      number: "05",
      icon: "🗂️",
      title: "Analysis History",
      description:
        "Each completed analysis can be stored in the database, allowing users to review previous voice authenticity results.",
    },
  ];

  return (
    <div
      className="container"
      style={{
        paddingTop: "56px",
        paddingBottom: "80px",
      }}
    >
      {/* HERO */}

      <section
        style={{
          maxWidth: "760px",
          marginBottom: "64px",
        }}
      >
        <span
          className="badge badge-genuine"
          style={{
            marginBottom: "18px",
          }}
        >
          🔍 Transparent Detection Pipeline
        </span>

        <h1
          className="page-title"
          style={{
            fontSize: "clamp(36px, 5vw, 52px)",
            lineHeight: 1.1,
            marginBottom: "20px",
          }}
        >
          How Vaani Shield Works
        </h1>

        <p
          className="page-subtitle"
          style={{
            fontSize: "18px",
            marginBottom: 0,
            maxWidth: "700px",
          }}
        >
          Vaani Shield combines browser-based voice capture,
          backend audio processing, and AI-powered deepfake detection
          to help analyze the authenticity of speech.
        </p>
      </section>

      {/* PIPELINE */}

      <section>
        <h2
          style={{
            fontSize: "28px",
            marginBottom: "12px",
          }}
        >
          Detection Pipeline
        </h2>

        <p
          style={{
            color: "var(--color-text-secondary)",
            marginBottom: "32px",
          }}
        >
          From a voice recording to an authenticity result.
        </p>

        <div
          style={{
            display: "grid",
            gap: "16px",
          }}
        >
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="card"
              style={{
                display: "flex",
                gap: "22px",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  minWidth: "58px",
                  height: "58px",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "26px",
                  background: "var(--color-surface-alt)",
                }}
              >
                {step.icon}
              </div>

              <div style={{ flex: 1 }}>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "var(--color-text-secondary)",
                    letterSpacing: "0.08em",
                  }}
                >
                  STEP {step.number}
                </span>

                <h3
                  style={{
                    marginTop: "5px",
                    marginBottom: "8px",
                  }}
                >
                  {step.title}
                </h3>

                <p
                  style={{
                    color: "var(--color-text-secondary)",
                    margin: 0,
                  }}
                >
                  {step.description}
                </p>

                {index < steps.length - 1 && (
                  <div
                    style={{
                      marginTop: "18px",
                      fontSize: "20px",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    ↓
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ARCHITECTURE */}

      <section
        style={{
          marginTop: "72px",
        }}
      >
        <h2
          style={{
            fontSize: "28px",
            marginBottom: "12px",
          }}
        >
          System Architecture
        </h2>

        <p
          style={{
            color: "var(--color-text-secondary)",
            marginBottom: "28px",
          }}
        >
          The main components currently working together in Vaani Shield.
        </p>

        <div
          className="card"
          style={{
            padding: "32px",
            overflowX: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              minWidth: "720px",
              textAlign: "center",
            }}
          >
            <ArchitectureBox
              icon="🌐"
              title="Frontend"
              text="React + Vite"
            />

            <Arrow />

            <ArchitectureBox
              icon="⚡"
              title="Backend"
              text="FastAPI"
            />

            <Arrow />

            <ArchitectureBox
              icon="🎵"
              title="Audio"
              text="Preprocessing"
            />

            <Arrow />

            <ArchitectureBox
              icon="🤖"
              title="AI Model"
              text="Deepfake Detection"
            />

            <Arrow />

            <ArchitectureBox
              icon="📊"
              title="Result"
              text="Verdict + Scores"
            />

            <Arrow />

            <ArchitectureBox
              icon="🗄️"
              title="History"
              text="SQLite Database"
            />
          </div>
        </div>
      </section>

      {/* RESULTS */}

      <section
        style={{
          marginTop: "72px",
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(230px, 1fr))",
          gap: "18px",
        }}
      >
        <div className="card">
          <div style={{ fontSize: "30px" }}>✓</div>

          <h3>Genuine or Synthetic</h3>

          <p
            style={{
              color: "var(--color-text-secondary)",
              marginBottom: 0,
            }}
          >
            Receive a simple authenticity verdict after the voice has
            been analyzed.
          </p>
        </div>

        <div className="card">
          <div style={{ fontSize: "30px" }}>📈</div>

          <h3>Confidence Scores</h3>

          <p
            style={{
              color: "var(--color-text-secondary)",
              marginBottom: 0,
            }}
          >
            View confidence and probability values generated by the
            deepfake detection model.
          </p>
        </div>

        <div className="card">
          <div style={{ fontSize: "30px" }}>⏱️</div>

          <h3>Processing Information</h3>

          <p
            style={{
              color: "var(--color-text-secondary)",
              marginBottom: 0,
            }}
          >
            See how quickly the analysis was completed and review
            previous sessions from the history page.
          </p>
        </div>
      </section>

      {/* IMPORTANT NOTE */}

      <section
        className="card"
        style={{
          marginTop: "72px",
          borderColor: "var(--color-border)",
        }}
      >
        <h2
          style={{
            marginTop: 0,
          }}
        >
          🛡️ Responsible Use
        </h2>

        <p
          style={{
            color: "var(--color-text-secondary)",
            marginBottom: 0,
          }}
        >
          Vaani Shield provides an AI-based authenticity assessment.
          Detection results should be treated as decision-support
          information rather than absolute proof of whether a voice is
          human or AI-generated.
        </p>
      </section>
    </div>
  );
}

function ArchitectureBox({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div
      style={{
        minWidth: "105px",
      }}
    >
      <div
        style={{
          fontSize: "28px",
          marginBottom: "8px",
        }}
      >
        {icon}
      </div>

      <strong
        style={{
          display: "block",
          fontSize: "14px",
        }}
      >
        {title}
      </strong>

      <span
        style={{
          display: "block",
          marginTop: "4px",
          fontSize: "12px",
          color: "var(--color-text-secondary)",
        }}
      >
        {text}
      </span>
    </div>
  );
}

function Arrow() {
  return (
    <div
      style={{
        fontSize: "22px",
        color: "var(--color-text-secondary)",
      }}
    >
      →
    </div>
  );
}