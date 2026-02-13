import { GoogleGenerativeAI } from "@google/generative-ai";

// Configuramos la API para que use la versión estable 'v1'
const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_GEMINI_API_KEY,
  { apiVersion: 'v1' }
);

export async function getChatResponse(history, message) {
  try {
    // Usamos el modelo flash estándar
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemInstruction = `Eres OrbiBot, el asistente oficial de OrbiTurn. 
    Tu tono debe ser EXTREMADAMENTE SERIO, PROFESIONAL Y FORMAL. 
    REGLAS: NO usar asteriscos, NO usar negritas. Párrafos separados por una línea en blanco.`;

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemInstruction }],
        },
        ...history.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }],
        })),
      ],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();

  } catch (error) {
    console.error("Gemini Error:", error);
    // Dejamos el test para ver si el error cambia
    return "ESTO ES UN TEST NUEVO: " + error.message;
  }
}