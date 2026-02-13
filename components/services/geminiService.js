export async function getChatResponse(history, message) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  // Usamos la URL que Google acepta por defecto
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  try {
    const contents = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    contents.push({
      role: 'user',
      parts: [{ 
        text: `Eres OrbiBot, el asistente oficial de OrbiTurn. Tono formal, serio, sin negritas ni asteriscos. 
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
    // Si sale este mensaje, es que el código llegó entero a Vercel
    return "CÓDIGO COMPLETO - ERROR: " + error.message;
  }
}