import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div
      className="container"
      style={{
        paddingTop: "72px",
        paddingBottom: "72px",
      }}
    >
      {/* Hero Section */}

      <section
        style={{
          textAlign: "center",
          maxWidth: "850px",
          margin: "0 auto",
        }}
      >
        <span
          className="badge badge-genuine"
          style={{
            marginBottom: "20px",
          }}
        >
          🛡️ SIH 2026 Prototype
        </span>

        <h1
          style={{
            fontSize: "56px",
            lineHeight: 1.1,
            marginTop: "12px",
            marginBottom: "20px",
          }}
        >
          Is the voice really
          <br />
          <span
            style={{
              color: "var(--color-accent)",
            }}
          >
            human?
          </span>
        </h1>

        <p
          style={{
            fontSize: "19px",
            color: "var(--color-text-secondary)",
            maxWidth: "700px",
            margin: "0 auto 32px",
          }}
        >
          Vaani Shield uses AI-powered deepfake detection
          to analyze voice recordings and identify whether
          speech appears genuine or potentially
          AI-generated or cloned.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "14px",
            flexWrap: "wrap",
          }}
        >
          <Link
            to="/detect"
            className="btn"
            style={{
              padding: "14px 24px",
              fontSize: "16px",
            }}
          >
            🎙 Try Voice Detection
          </Link>

          <Link
            to="/about"
            className="btn btn-secondary"
            style={{
              padding: "14px 24px",
              fontSize: "16px",
            }}
          >
            🔍 How It Works
          </Link>
        </div>
      </section>

      {/* Hero Stats */}

      <section
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "18px",
          marginTop: "64px",
        }}
      >
        <div
          className="card"
          style={{
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "32px",
              marginBottom: "8px",
            }}
          >
            🎙
          </div>

          <strong
            style={{
              fontSize: "24px",
            }}
          >
            Voice Analysis
          </strong>

          <p
            style={{
              color:
                "var(--color-text-secondary)",
              marginBottom: 0,
            }}
          >
            Upload or record voice clips directly
            from your browser.
          </p>
        </div>

        <div
          className="card"
          style={{
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "32px",
              marginBottom: "8px",
            }}
          >
            🤖
          </div>

          <strong
            style={{
              fontSize: "24px",
            }}
          >
            AI Detection
          </strong>

          <p
            style={{
              color:
                "var(--color-text-secondary)",
              marginBottom: 0,
            }}
          >
            Analyze speech using an AI-powered
            deepfake detection pipeline.
          </p>
        </div>

        <div
          className="card"
          style={{
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "32px",
              marginBottom: "8px",
            }}
          >
            ⚡
          </div>

          <strong
            style={{
              fontSize: "24px",
            }}
          >
            Fast Results
          </strong>

          <p
            style={{
              color:
                "var(--color-text-secondary)",
              marginBottom: 0,
            }}
          >
            Receive authenticity results and
            confidence scores within seconds.
          </p>
        </div>
      </section>

      {/* How It Works */}

      <section
        style={{
          marginTop: "80px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "40px",
          }}
        >
          <p
            style={{
              color:
                "var(--color-accent)",
              fontWeight: 700,
              letterSpacing: "1px",
            }}
          >
            DETECTION PIPELINE
          </p>

          <h2
            style={{
              fontSize: "36px",
              marginTop: 0,
            }}
          >
            From voice recording to verdict
          </h2>

          <p
            style={{
              color:
                "var(--color-text-secondary)",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            A simple pipeline designed to analyze
            voice authenticity.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "18px",
          }}
        >
          <div className="card">
            <p
              style={{
                color:
                  "var(--color-accent)",
                fontWeight: 700,
              }}
            >
              STEP 01
            </p>

            <div
              style={{
                fontSize: "30px",
              }}
            >
              🎙️
            </div>

            <h3>Voice Input</h3>

            <p
              style={{
                color:
                  "var(--color-text-secondary)",
              }}
            >
              Upload an audio file or record your
              voice directly through the browser.
            </p>
          </div>

          <div className="card">
            <p
              style={{
                color:
                  "var(--color-accent)",
                fontWeight: 700,
              }}
            >
              STEP 02
            </p>

            <div
              style={{
                fontSize: "30px",
              }}
            >
              ⚙️
            </div>

            <h3>Audio Processing</h3>

            <p
              style={{
                color:
                  "var(--color-text-secondary)",
              }}
            >
              The audio is prepared and processed
              for the deepfake detection model.
            </p>
          </div>

          <div className="card">
            <p
              style={{
                color:
                  "var(--color-accent)",
                fontWeight: 700,
              }}
            >
              STEP 03
            </p>

            <div
              style={{
                fontSize: "30px",
              }}
            >
              🤖
            </div>

            <h3>AI Detection</h3>

            <p
              style={{
                color:
                  "var(--color-text-secondary)",
              }}
            >
              The AI model analyzes acoustic
              patterns to detect synthetic speech.
            </p>
          </div>

          <div className="card">
            <p
              style={{
                color:
                  "var(--color-accent)",
                fontWeight: 700,
              }}
            >
              STEP 04
            </p>

            <div
              style={{
                fontSize: "30px",
              }}
            >
              📊
            </div>

            <h3>Authenticity Result</h3>

            <p
              style={{
                color:
                  "var(--color-text-secondary)",
              }}
            >
              Receive a verdict with confidence,
              probability and processing details.
            </p>
          </div>
        </div>
      </section>

      {/* Technology Section */}

      <section
        style={{
          marginTop: "80px",
        }}
      >
        <div
          className="card"
          style={{
            textAlign: "center",
            padding: "40px",
          }}
        >
          <p
            style={{
              color:
                "var(--color-accent)",
              fontWeight: 700,
              letterSpacing: "1px",
            }}
          >
            TECHNOLOGY STACK
          </p>

          <h2
            style={{
              fontSize: "32px",
              marginTop: "8px",
            }}
          >
            Built for intelligent voice analysis
          </h2>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "14px",
              flexWrap: "wrap",
              marginTop: "28px",
            }}
          >
            <span className="badge badge-genuine">
              React + Vite
            </span>

            <span className="badge badge-genuine">
              FastAPI
            </span>

            <span className="badge badge-genuine">
              Deepfake AI Model
            </span>

            <span className="badge badge-genuine">
              Audio Processing
            </span>

            <span className="badge badge-genuine">
              SQLite History
            </span>
          </div>
        </div>
      </section>

      {/* CTA */}

      <section
        style={{
          marginTop: "72px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "36px",
          }}
        >
          Ready to analyze a voice?
        </h2>

        <p
          style={{
            color:
              "var(--color-text-secondary)",
            fontSize: "17px",
            marginBottom: "28px",
          }}
        >
          Upload an audio clip or record your voice
          and let Vaani Shield analyze it.
        </p>

        <Link
          to="/detect"
          className="btn"
          style={{
            padding: "14px 28px",
            fontSize: "16px",
          }}
        >
          🎙 Start Detection
        </Link>
      </section>
    </div>
  );
}