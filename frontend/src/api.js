const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/api/upload`, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Upload failed.");
  return data;
}

export async function sendMessage(message, history) {
  const res = await fetch(`${API_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to get a response.");
  return data.answer;
}

export async function fetchDocuments() {
  const res = await fetch(`${API_URL}/api/documents`);
  return res.json();
}

export async function deleteDocument(id) {
  await fetch(`${API_URL}/api/documents/${id}`, { method: "DELETE" });
}
