const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000";


export interface HistoryItem {
  id: number;
  session_id: string;
  filename?: string | null;
  prediction: "genuine" | "synthetic";
  confidence: number;
  created_at: string;
  processing_time_ms?: number | null;
  duration_seconds?: number | null;
  explanation_summary?: string | null;
}


export interface HistoryListResponse {
  total: number;
  items: HistoryItem[];
}


export interface DeleteResponse {
  session_id: string;
  deleted: boolean;
}


export interface DetectionResponse {
  session_id: string;
  filename: string;
  prediction: "genuine" | "synthetic";
  confidence: number;
  created_at: string;

  processing_time_ms?: number | null;
  fake_probability?: number | null;
  bonafide_score?: number | null;
}


export async function fetchHistory(): Promise<HistoryListResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/history`
  );

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => null);

    throw new Error(
      errorData?.detail ||
      "Failed to fetch history"
    );
  }

  return response.json();
}


export async function deleteHistoryItem(
  sessionId: string
): Promise<DeleteResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/history/${sessionId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => null);

    throw new Error(
      errorData?.detail ||
      "Failed to delete history item"
    );
  }

  return response.json();
}


export async function analyzeAudio(
  file: File
): Promise<DetectionResponse> {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    `${API_BASE_URL}/api/detect`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => null);

    throw new Error(
      errorData?.detail ||
      "Failed to analyze audio"
    );
  }

  return response.json();
}