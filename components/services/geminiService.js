export async function getChatResponse(history, message) {
  const key = import.meta.env.VITE_GEMINI_API_KEY;

  if (!key) {
    console.error("⚠️ VITE_GEMINI_API_KEY no está definida");
    return "Error: API Key no configurada.";
  }

  // Modelo actualizado — gemini-2.0-flash es el recomendado actual
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text:
                  "Eres OrbiBot, un asistente virtual profesional. Responde de forma seria y formal a lo siguiente: " +
                  message,
              },
            ],
          },
        ],
      }),
    });

    // Leemos siempre como texto primero para evitar el crash de JSON.parse
    const raw = await response.text();

    if (!response.ok) {
      console.error(`❌ HTTP ${response.status}:`, raw);
      return `Error ${response.status}: La API de Google no respondió correctamente.`;
    }

    const data = JSON.parse(raw);

    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }

    console.warn("Respuesta inesperada:", data);
    return "No se recibió una respuesta válida.";
  } catch (error) {
    console.error("Error en el servicio:", error);
    return "Error de conexión con OrbiBot.";
  }
}