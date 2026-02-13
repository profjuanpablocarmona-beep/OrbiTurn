import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function getChatResponse(history, message) {
  try {
    // Probamos con el modelo 'gemini-pro' que es el más compatible de todos
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const chat = model.startChat({
      history: history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      })),
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();

  } catch (error) {
    // Si este mensaje NO aparece en la web, es que Vercel NO está actualizando el código
    return "ESTE ES EL CODIGO NUEVO - ERROR: " + error.message;
  }
}