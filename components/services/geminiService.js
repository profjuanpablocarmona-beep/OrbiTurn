// geminiService.js

const SYSTEM_PROMPT = `Eres OrbiBot, un asistente virtual profesional. 
Características de tus respuestas:
- Tono serio y formal
- Sin usar negritas, asteriscos ni formato markdown
- Respuestas claras y directas
- Lenguaje profesional pero accesible`;

export async function getChatResponse(history, message) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    return "Error de configuración: API Key no encontrada. Verifica las variables de entorno en Vercel.";
  }

  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  try {
    // Construir el contenido correctamente
    const contents = [];
    
    // Agregar mensaje del sistema como primer mensaje del usuario
    contents.push({
      role: 'user',
      parts: [{ text: SYSTEM_PROMPT }]
    });
    
    // Respuesta del modelo aceptando las instrucciones
    contents.push({
      role: 'model',
      parts: [{ text: 'Entendido. Soy OrbiBot y responderé de forma seria y formal, sin usar negritas ni asteriscos.' }]
    });
    
    // Agregar historial previo si existe
    if (history && Array.isArray(history) && history.length > 0) {
      history.forEach(msg => {
        // Asegurarse de que cada mensaje tenga la estructura correcta
        if (msg.content && msg.content.trim() !== '') {
          contents.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
          });
        }
      });
    }
    
    // Agregar el mensaje actual del usuario
    if (message && message.trim() !== '') {
      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });
    } else {
      return "Error: El mensaje está vacío.";
    }

    const requestBody = {
      contents: contents,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error de Google API:', errorData);
      return `Error ${response.status}: ${errorData.error?.message || 'Error desconocido al conectar con Google'}`;
    }

    const data = await response.json();

    if (data.error) {
      console.error('Error en respuesta de Google:', data.error);
      return `Error de Google Gemini: ${data.error.message}`;
    }

    if (!data.candidates || data.candidates.length === 0) {
      return "La respuesta de Google está vacía. Esto puede deberse a filtros de seguridad o límites de cuota.";
    }

    const candidate = data.candidates[0];
    
    if (candidate.finishReason === 'SAFETY') {
      return "La respuesta fue bloqueada por los filtros de seguridad de Google. Intenta reformular tu pregunta.";
    }

    if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
      return "Google respondió pero sin contenido. Verifica tu cuota de API.";
    }

    return candidate.content.parts[0].text;

  } catch (error) {
    console.error('Error en getChatResponse:', error);
    return `Error de conexión: ${error.message}. Verifica tu conexión a internet y la configuración de Vercel.`;
  }
}