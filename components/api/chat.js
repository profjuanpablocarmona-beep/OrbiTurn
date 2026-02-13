export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Solo se permite POST' });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Mensaje vacío' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error('GEMINI_API_KEY no está configurada');
      return res.status(500).json({ error: 'API Key no configurada' });
    }

    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [{
        parts: [{
          text: `Eres OrbiBot, un asistente profesional. Responde de forma seria y formal, sin usar negritas ni asteriscos.\n\nPregunta: ${message}`
        }]
      }]
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error de Google:', data);
      return res.status(response.status).json({ 
        error: data.error?.message || 'Error de Google' 
      });
    }

    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return res.status(200).json({ 
        response: data.candidates[0].content.parts[0].text 
      });
    }

    return res.status(500).json({ error: 'Sin respuesta de Google' });

  } catch (error) {
    console.error('Error en el servidor:', error);
    return res.status(500).json({ error: error.message });
  }
}