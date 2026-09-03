import { useEffect, useState } from "react";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import {
  fetchHistory,
  deleteHistoryItem,
  HistoryItem,
} from "../lib/api";

export default function HistoryPage() {
  const [items, setItems] =
    useState<HistoryItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [filter, setFilter] =
    useState<
      "all" | "genuine" | "synthetic"
    >("all");

  async function loadHistory(
    showRefreshState = false
  ) {
    if (showRefreshState) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError(null);

    try {
      const data =
        await fetchHistory();

      const sortedItems =
        [...data.items].sort(
          (a, b) =>
            new Date(
              b.created_at
            ).getTime() -
            new Date(
              a.created_at
            ).getTime()
        );

      setItems(sortedItems);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load history"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  async function handleDelete(
    sessionId: string
  ) {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this analysis?"
      );

    if (!confirmed) return;

    try {
      await deleteHistoryItem(
        sessionId
      );

      setItems(
        (previousItems) =>
          previousItems.filter(
            (item) =>
              item.session_id !==
              sessionId
          )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete history item"
      );
    }
  }

  async function handleClearAll() {
    if (items.length === 0) return;

    const confirmed =
      window.confirm(
        "Are you sure you want to delete ALL analysis history? This cannot be undone."
      );

    if (!confirmed) return;

    try {
      await Promise.all(
        items.map((item) =>
          deleteHistoryItem(
            item.session_id
          )
        )
      );

      setItems([]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to clear history"
      );
    }
  }

  function downloadCSV() {
    if (items.length === 0) {
      setError(
        "No history available to download."
      );
      return;
    }

    const headers = [
      "Time",
      "Filename",
      "Verdict",
      "Confidence (%)",
      "Processing Time (ms)",
    ];

    const rows = items.map(
      (item) => [
        new Date(
          item.created_at
        ).toLocaleString(),

        item.filename ??
          "Unknown audio",

        item.prediction,

        (
          item.confidence *
          100
        ).toFixed(1),

        item.processing_time_ms ??
          "",
      ]
    );

    const escapeCSVValue = (
      value: string | number
    ) => {
      const stringValue =
        String(value);

      return `"${stringValue.replace(
        /"/g,
        '""'
      )}"`;
    };

    const csvContent = [
      headers
        .map(escapeCSVValue)
        .join(","),

      ...rows.map((row) =>
        row
          .map(escapeCSVValue)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob(
      [csvContent],
      {
        type:
          "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `vaani_shield_history_${Date.now()}.csv`;

    document.body.appendChild(
      link
    );

    link.click();

    document.body.removeChild(
      link
    );

    URL.revokeObjectURL(url);
  }

  const totalAnalyses =
    items.length;

  const genuineCount =
    items.filter(
      (item) =>
        item.prediction ===
        "genuine"
    ).length;

  const syntheticCount =
    items.filter(
      (item) =>
        item.prediction ===
        "synthetic"
    ).length;

  const averageConfidence =
    items.length > 0
      ? items.reduce(
          (sum, item) =>
            sum +
            item.confidence,
          0
        ) / items.length
      : 0;

  const pieChartData = [
    {
      name: "Genuine",
      value: genuineCount,
    },
    {
      name: "Synthetic",
      value: syntheticCount,
    },
  ];

  const PIE_COLORS = [
    "#22c55e",
    "#ef4444",
  ];

  const confidenceChartData =
    [...items]
      .reverse()
      .slice(-10)
      .map(
        (item, index) => ({
          name: `#${index + 1}`,
          confidence: Number(
            (
              item.confidence *
              100
            ).toFixed(1)
          ),
        })
      );

  const filteredItems =
    items.filter((item) => {
      const matchesSearch =
        (
          item.filename ??
          ""
        )
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          );

      const matchesFilter =
        filter === "all" ||
        item.prediction ===
          filter;

      return (
        matchesSearch &&
        matchesFilter
      );
    });

  return (
    <div
      className="container"
      style={{
        paddingTop: "48px",
        paddingBottom: "64px",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 className="page-title">
            Detection History
          </h1>

          <p className="page-subtitle">
            View your previous voice
            authenticity analyses.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <button
            className="btn-secondary"
            onClick={() =>
              loadHistory(true)
            }
            disabled={refreshing}
          >
            {refreshing
              ? "Refreshing..."
              : "↻ Refresh"}
          </button>

          {items.length > 0 && (
            <>
              <button
                className="btn-primary"
                onClick={downloadCSV}
                style={{
                  cursor: "pointer",
                }}
              >
                📥 Download CSV
              </button>

              <button
                className="btn-secondary"
                onClick={
                  handleClearAll
                }
                style={{
                  color:
                    "var(--color-synthetic)",
                  cursor: "pointer",
                }}
              >
                🗑 Clear All
              </button>
            </>
          )}
        </div>
      </div>

      {/* SUMMARY CARDS */}

      {!loading &&
        !error && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "18px",
              marginTop: "32px",
              marginBottom:
                "24px",
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
                Total Analyses
              </p>

              <strong
                style={{
                  fontSize:
                    "32px",
                }}
              >
                {totalAnalyses}
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
                Genuine Voices
              </p>

              <strong
                style={{
                  fontSize:
                    "32px",
                  color:
                    "var(--color-genuine)",
                }}
              >
                {genuineCount}
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
                Synthetic Voices
              </p>

              <strong
                style={{
                  fontSize:
                    "32px",
                  color:
                    "var(--color-synthetic)",
                }}
              >
                {syntheticCount}
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
                Avg. Confidence
              </p>

              <strong
                style={{
                  fontSize:
                    "32px",
                }}
              >
                {(
                  averageConfidence *
                  100
                ).toFixed(1)}
                %
              </strong>
            </div>
          </div>
        )}

      {/* ANALYTICS CHARTS */}

      {!loading &&
        !error &&
        items.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "24px",
              marginBottom:
                "24px",
            }}
          >
            {/* PIE CHART */}

            <div className="card">
              <h2
                style={{
                  marginTop: 0,
                  textAlign:
                    "center",
                  fontSize:
                    "20px",
                }}
              >
                📊 Detection Overview
              </h2>

              <div
                style={{
                  width: "100%",
                  height:
                    "300px",
                }}
              >
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <PieChart>
                    <Pie
                      data={
                        pieChartData
                      }
                      cx="50%"
                      cy="50%"
                      labelLine={
                        false
                      }
                      label={({
                        name,
                        percent,
                      }) =>
                        `${name}: ${(
                          percent *
                          100
                        ).toFixed(
                          0
                        )}%`
                      }
                      outerRadius={
                        95
                      }
                      dataKey="value"
                    >
                      {pieChartData.map(
                        (
                          _entry,
                          index
                        ) => (
                          <Cell
                            key={`pie-cell-${index}`}
                            fill={
                              PIE_COLORS[
                                index %
                                  PIE_COLORS.length
                              ]
                            }
                          />
                        )
                      )}
                    </Pie>

                    <Tooltip />

                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* CONFIDENCE CHART */}

            <div className="card">
              <h2
                style={{
                  marginTop: 0,
                  textAlign:
                    "center",
                  fontSize:
                    "20px",
                }}
              >
                📈 Confidence Trend
              </h2>

              <div
                style={{
                  width: "100%",
                  height:
                    "300px",
                }}
              >
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <LineChart
                    data={
                      confidenceChartData
                    }
                    margin={{
                      top: 10,
                      right: 20,
                      left: -10,
                      bottom: 10,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      dataKey="name"
                    />

                    <YAxis
                      domain={[
                        0,
                        100,
                      ]}
                      tickFormatter={(
                        value
                      ) =>
                        `${value}%`
                      }
                    />

                    <Tooltip
                      formatter={(
                        value
                      ) => [
                        `${value}%`,
                        "Confidence",
                      ]}
                    />

                    <Legend />

                    <Line
                      type="monotone"
                      dataKey="confidence"
                      name="Confidence"
                      stroke="#6366f1"
                      strokeWidth={
                        3
                      }
                      dot={{
                        r: 5,
                      }}
                      activeDot={{
                        r: 7,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

      {/* SEARCH AND FILTER */}

      {!loading &&
        !error &&
        items.length > 0 && (
          <div
            className="card"
            style={{
              marginBottom:
                "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "16px",
                flexWrap:
                  "wrap",
                alignItems:
                  "center",
              }}
            >
              <input
                type="text"
                placeholder="🔍 Search by filename..."
                value={
                  searchTerm
                }
                onChange={(
                  event
                ) =>
                  setSearchTerm(
                    event.target
                      .value
                  )
                }
                style={{
                  flex: 1,
                  minWidth:
                    "220px",
                  padding:
                    "12px",
                  borderRadius:
                    "8px",
                  border:
                    "1px solid var(--color-border)",
                  background:
                    "var(--color-surface)",
                  color:
                    "var(--color-text-primary)",
                  fontFamily:
                    "inherit",
                }}
              />

              <select
                value={filter}
                onChange={(
                  event
                ) =>
                  setFilter(
                    event.target
                      .value as
                      | "all"
                      | "genuine"
                      | "synthetic"
                  )
                }
                style={{
                  padding:
                    "12px",
                  borderRadius:
                    "8px",
                  border:
                    "1px solid var(--color-border)",
                  background:
                    "var(--color-surface)",
                  color:
                    "var(--color-text-primary)",
                  fontFamily:
                    "inherit",
                  cursor:
                    "pointer",
                }}
              >
                <option value="all">
                  All Results
                </option>

                <option value="genuine">
                  ✓ Genuine
                </option>

                <option value="synthetic">
                  ⚠ Synthetic
                </option>
              </select>
            </div>

            <p
              style={{
                marginBottom: 0,
                color:
                  "var(--color-text-secondary)",
                fontSize:
                  "14px",
              }}
            >
              Showing{" "}
              {
                filteredItems.length
              }{" "}
              of {items.length} analyses
            </p>
          </div>
        )}

      {/* LOADING */}

      {loading && (
        <div className="card">
          <p
            style={{
              margin: 0,
              color:
                "var(--color-text-secondary)",
            }}
          >
            Loading detection history...
          </p>
        </div>
      )}

      {/* ERROR */}

      {error && (
        <div
          className="card"
          style={{
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

      {/* EMPTY HISTORY */}

      {!loading &&
        !error &&
        items.length === 0 && (
          <div className="card">
            <p
              style={{
                margin: 0,
                color:
                  "var(--color-text-secondary)",
              }}
            >
              No analyses yet.
              Record or upload a
              voice clip to see
              your results here.
            </p>
          </div>
        )}

      {/* NO SEARCH RESULTS */}

      {!loading &&
        !error &&
        items.length > 0 &&
        filteredItems.length ===
          0 && (
          <div className="card">
            <p
              style={{
                margin: 0,
                color:
                  "var(--color-text-secondary)",
              }}
            >
              No analyses match
              your search or
              filter.
            </p>
          </div>
        )}

      {/* HISTORY TABLE */}

      {!loading &&
        !error &&
        filteredItems.length >
          0 && (
          <div
            className="card"
            style={{
              padding: 0,
              overflowX:
                "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse:
                  "collapse",
              }}
            >
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Filename</th>
                  <th>Verdict</th>
                  <th>Confidence</th>
                  <th>Processing</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredItems.map(
                  (item) => (
                    <tr
                      key={
                        item.session_id
                      }
                    >
                      <td>
                        {new Date(
                          item.created_at
                        ).toLocaleString()}
                      </td>

                      <td>
                        {item.filename ??
                          "Unknown audio"}
                      </td>

                      <td>
                        <span
                          className={
                            item.prediction ===
                            "genuine"
                              ? "badge badge-genuine"
                              : "badge badge-synthetic"
                          }
                        >
                          {item.prediction ===
                          "genuine"
                            ? "✓ Genuine"
                            : "⚠ Synthetic"}
                        </span>
                      </td>

                      <td>
                        {(
                          item.confidence *
                          100
                        ).toFixed(1)}
                        %
                      </td>

                      <td>
                        {item.processing_time_ms !==
                        undefined
                          ? `${item.processing_time_ms} ms`
                          : "—"}
                      </td>

                      <td>
                        <button
                          className="btn-secondary"
                          style={{
                            cursor:
                              "pointer",
                            color:
                              "var(--color-synthetic)",
                          }}
                          onClick={() =>
                            handleDelete(
                              item.session_id
                            )
                          }
                        >
                          🗑 Delete
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
}