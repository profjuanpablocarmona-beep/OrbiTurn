export async function getChatResponse(history, message) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  // Usamos la URL oficial de Google v1 (la estable)
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  try {
    // Preparamos los mensajes para Google
    const contents = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // Agregamos el mensaje actual con las instrucciones de OrbiBot
    contents.push({
      role: 'user',
      parts: [{ 
        text: `Instrucciones: Eres OrbiBot, el asistente oficial de OrbiTurn. Tono formal, serio, sin negritas ni asteriscos. 
        Pregunta del usuario: ${message}` 
      }]
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    return data.candidates[0].content.parts[0].text;

  } catch (error) {
    console.error("Error directo:", error);
    return "ERROR DE CONEXIÓN DIRECTA: " + error.message;
  }
}