export async function getChatResponse(history, message) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  // URL forzada a gemini-1.5-flash en v1beta (la que Google suele activar por defecto)
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  try {
    const contents = [{
      role: 'user',
      parts: [{ 
        text: `Eres OrbiBot, asistente formal de OrbiTurn. Responde seriamente: ${message}` 
      }]
    }];

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    });

    const data = await response.json();

    if (data.error) throw new Error(data.error.message);

    return data.candidates[0].content.parts[0].text;

  } catch (error) {
    // ESTE TEXTO TIENE QUE CAMBIAR EN TU PÁGINA
    return "NUEVO INTENTO CRITICO - ERROR: " + error.message;
  }