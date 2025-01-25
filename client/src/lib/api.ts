const API_BASE = "/api";

export async function convertFile(formData: FormData): Promise<{ markdown: string }> {
  const response = await fetch(`${API_BASE}/convert`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}
