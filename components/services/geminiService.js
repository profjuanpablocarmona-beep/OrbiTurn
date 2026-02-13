export async function getChatResponse(history, message) {
  const key = import.meta.env.VITE_GEMINI_API_KEY;

  if (!key) return "Error: API Key no configurada.";

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;

  const body = JSON.stringify({
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
  });

  // Hasta 3 intentos con espera progresiva
  for (let intento = 0; intento < 3; intento++) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });

      const raw = await response.text();

      if (response.status === 429) {
        const espera = (intento + 1) * 2000; // 2s, 4s, 6s
        console.warn(`⏳ Rate limit (429). Reintentando en ${espera / 1000}s...`);
        await new Promise((r) => setTimeout(r, espera));
        continue;
      }

      if (!response.ok) {
        console.error(`❌ HTTP ${response.status}:`, raw);
        return `Error ${response.status}: La API no respondió correctamente.`;
      }

      const data = JSON.parse(raw);

      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }

      return "No se recibió una respuesta válida.";
    } catch (error) {
      console.error("Error en el servicio:", error);
      return "Error de conexión con OrbiBot.";
    }
  }

  return "OrbiBot está saturado en este momento. Intentá de nuevo en unos segundos.";
}