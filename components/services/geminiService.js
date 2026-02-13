export async function getChatResponse(history, message) {
  // 1. Forzamos la URL completa de Google para que no busque en "/api"
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Eres OrbiBot, un asistente formal. Responde a: " + message }] }]
      })
    });

    // 2. Si la respuesta no es OK, capturamos el texto para saber qué pasa
    if (!response.ok) {
      const errorText = await response.text();
      return "Error de Google: " + errorText;
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;

  } catch (error) {
    return "Error crítico: " + error.message;
  }
}