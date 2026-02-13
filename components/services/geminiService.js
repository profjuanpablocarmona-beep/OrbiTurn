export async function getChatResponse(history, message) {
  try {
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return 'Por favor, escribe un mensaje válido.';
    }

    // Llamar DIRECTO a Google (sin servidor intermedio)
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      return 'Error: API Key no configurada. Verifica las variables de entorno.';
    }

    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Eres OrbiBot, un asistente profesional. Responde de forma seria y formal, sin usar negritas ni asteriscos.\n\nPregunta: ${message}`
          }]
        }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error de Google:', data);
      return `Error: ${data.error?.message || 'Error de Google Gemini'}`;
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return 'No se recibió respuesta de Google.';
    }

    return text;

  } catch (error) {
    console.error('Error:', error);
    return `Error de conexión: ${error.message}`;
  }
}