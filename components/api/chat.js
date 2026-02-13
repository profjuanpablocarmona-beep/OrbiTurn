export default function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido' });
    return;
  }

  const { message } = req.body;

  if (!message) {
    res.status(400).json({ error: 'Mensaje vacío' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    res.status(500).json({ error: 'API Key no configurada' });
    return;
  }

  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [{
      parts: [{
        text: `Eres OrbiBot, un asistente profesional. Responde de forma seria y formal, sin usar negritas ni asteriscos.\n\nPregunta: ${message}`
      }]
    }]
  };

  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  })
    .then(response => response.json())
    .then(data => {
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        res.status(200).json({ 
          response: data.candidates[0].content.parts[0].text 
        });
      } else if (data.error) {
        res.status(400).json({ error: data.error.message });
      } else {
        res.status(500).json({ error: 'Sin respuesta de Google' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
}