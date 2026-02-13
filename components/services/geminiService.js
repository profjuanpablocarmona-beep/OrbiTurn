import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function getChatResponse(history, message) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // La instrucción de sistema ahora va dentro de la configuración del modelo
    // Esto evita que se confunda con el historial
    const chat = model.startChat({
      history: history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      })),
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    // Le enviamos la instrucción de sistema y el mensaje del usuario juntos
    const promptRefinado = `Instrucción: Eres OrbiBot, el asistente oficial de OrbiTurn. 
    Tono: Extremadamente serio, profesional y formal. 
    Reglas: NO usar asteriscos, NO usar negritas. Párrafos separados por una línea en blanco.
    
    Pregunta del usuario: ${message}`;

    const result = await chat.sendMessage(promptRefinado);
    const response = await result.response;
    return response.text();

  } catch (error) {
    // Si todavía falla, el error saldrá aquí, pero este formato es el estándar
    return "ERROR DE CONFIGURACIÓN: " + error.message;
  }
}