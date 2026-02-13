import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function getChatResponse(history, message) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Limpiamos el historial para que SIEMPRE empiece con un mensaje de 'user'
    // y no tenga mensajes vacíos.
    const cleanedHistory = history
      .map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text || "" }],
      }))
      .filter(msg => msg.parts[0].text.trim() !== "");

    // Si el primer mensaje del historial no es del usuario, lo eliminamos
    while (cleanedHistory.length > 0 && cleanedHistory[0].role !== 'user') {
      cleanedHistory.shift();
    }

    const chat = model.startChat({
      history: cleanedHistory,
    });

    // Ponemos las instrucciones de personalidad justo antes del mensaje
    const finalPrompt = `INSTRUCCIONES DE PERSONALIDAD: 
    Eres OrbiBot, asistente de OrbiTurn. Tono serio y formal. 
    NO uses asteriscos ni negritas. Separa párrafos con una línea en blanco.
    
    MENSAJE DEL USUARIO: ${message}`;

    const result = await chat.sendMessage(finalPrompt);
    const response = await result.response;
    return response.text();

  } catch (error) {
    // Si sigue fallando, al menos sabremos si es por el mismo error
    return "INTENTO FINAL - ERROR: " + error.message;
  }
}