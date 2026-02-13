export async function getChatResponse(history, message) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  try {
    const contents = [{ role: 'user', parts: [{ text: "Eres OrbiBot. Responde: " + message }] }];
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    });

    const data = await response.json();

    // Si Google nos manda un error, esto nos va a decir qué es
    if (data.error) {
      return "ERROR DE GOOGLE: " + data.error.message;
    }

    // Verificamos si existe la respuesta antes de intentar leer el '0'
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    } else {
      return "Google respondió vacío. Revisá tu cuota o API Key.";
    }

  } catch (error) {
    return "ERROR DE RED: " + error.message;
  }
}