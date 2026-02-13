export async function getChatResponse(history, message) {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${key}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Eres OrbiBot, responde formalmente: " + message }] }]
      })
    });

    if (!response.ok) {
      return "Error: La API de Google rechazó la petición. Revisa la Key en Vercel.";
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    return "Error de conexión con el servicio.";
  }
}