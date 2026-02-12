
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../../types";

const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getChatResponse(history: ChatMessage[], message: string): Promise<string> {
  try {
    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        { 
          role: 'user', 
          parts: [{ 
            text: `Eres OrbiBot, el asistente oficial de OrbiTurn. 
            Tu tono debe ser EXTREMADAMENTE SERIO, PROFESIONAL Y FORMAL. 
            Trabajas para una institución gubernamental o médica de alto nivel brindando turnos.
            
            REGLAS DE FORMATO (OBLIGATORIAS):
            1. NO utilices asteriscos (***) ni negritas bajo ninguna circunstancia.
            2. Divide la información en párrafos claros.
            3. Deja UNA LÍNEA EN BLANCO entre cada párrafo.
            4. No utilices listas con viñetas; usa oraciones completas y profesionales.
            
            CONTENIDO:
            - Solo informa sobre: Consultoría Técnica, Gestión Administrativa, Análisis Especializado y Mantenimiento de Infraestructura.
            - Los turnos duran de 90 a 120 minutos.
            - Sé breve y directo.` 
          }]
        },
        ...history.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        })),
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        temperature: 0.1, // Reducimos temperatura para máxima sobriedad y consistencia
        topK: 10,
        topP: 0.9,
      }
    });

    return response.text || "Ha ocurrido un error en la comunicación. Por favor, intente nuevamente.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error en el sistema de procesamiento. Contacte al departamento técnico.";
  }
}
