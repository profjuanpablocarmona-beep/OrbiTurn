export async function getChatResponse(history, message) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  // Cambiamos a 'gemini-pro' que es el modelo más compatible del mundo
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

  try {
    // Filtramos el historial para que no tenga errores de intentos previos
    const contents = history
      .filter(msg => !msg.text.includes("ERROR") && !msg.text.includes("TEST"))
      .map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

    contents.push({
      role: 'user',
      parts: [{ 
        text: `Eres OrbiBot, asistente de OrbiTurn. Tono formal y serio. No uses negritas ni asteriscos. 
        Usuario: ${message}` 
      }]
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    });

    const data = await response.json();

    if (data.error) {
      // Si este modelo tampoco existe, Google nos va a decir qué modelos TENEMOS permitidos
      throw new Error(data.error.message);
    }

    return data.candidates[0].content.parts[0].text;

  } catch (error) {
    return "ERROR DEFINITIVO: " + error.message;
  }
}