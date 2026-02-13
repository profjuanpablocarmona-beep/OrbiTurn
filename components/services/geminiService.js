// geminiService.js

export async function getChatResponse(history, message) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    return "Error: API Key no encontrada.";
  }

  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  try {
    // Construcción simple y directa del contenido
    const contents = [
      {
        parts: [
          {
            text: `Eres OrbiBot, un asistente virtual profesional. Responde de forma seria y formal, sin usar negritas ni asteriscos.

Usuario: ${message}`
          }
        ]
      }
    ];

    const requestBody = {
      contents: contents
    };

    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    
    console.log('Response data:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('Error de Google API:', data);
      return `Error ${response.status}: ${data.error?.message || 'Error desconocido'}`;
    }

    if (data.error) {
      return `Error: ${data.error.message}`;
    }

    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }

    return "No se recibió respuesta válida de Google.";

  } catch (error) {
    console.error('Error en getChatResponse:', error);
    return `Error de conexión: ${error.message}`;
  }
}