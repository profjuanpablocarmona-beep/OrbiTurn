export async function getChatResponse(history, message) {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  // Cambiamos v1 por v1beta y el modelo al que te funcionó
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ text: "Eres OrbiBot, un asistente virtual profesional. Responde de forma seria y formal a lo siguiente: " + message }] 
        }]
      })
    });

    if (!response.ok) {
      // Si falla, queremos ver el texto del error
      const errorData = await response.text();
      console.error("Detalle del error:", errorData);
      return "Error: La API de Google no respondió correctamente.";
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    }
    
    return "No se recibió una respuesta válida.";

  } catch (error) {
    console.error("Error en el servicio:", error);
    return "Error de conexión con OrbiBot.";
  }
}