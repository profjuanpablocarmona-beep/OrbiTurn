import { GoogleGenerativeAI } from "@google/generative-ai";

// @ts-ignore
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function getChatResponse(history, message) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemInstruction = `Eres OrbiBot, el asistente oficial de OrbiTurn. 
    Tu tono debe ser EXTREMADAMENTE SERIO, PROFESIONAL Y FORMAL. 
    REGLAS: NO usar asteriscos, NO usar negritas. Dividir en párrafos claros con una línea en blanco de por medio.`;

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
    return "Error en el sistema de procesamiento. Contacte al departamento técnico.";
  }
}