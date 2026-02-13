export async function getChatResponse(history, message) {
  try {
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return 'Por favor, escribe un mensaje válido.';
    }

    const response = await fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: message.trim() })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error del servidor:', data);
      return `Error: ${data.error || 'Ocurrió un problema'}`;
    }

    if (!data.response) {
      return 'No se recibió respuesta del servidor.';
    }

    return data.response;

  } catch (error) {
    console.error('Error de conexión:', error);
    return `Error de conexión: ${error.message}`;
  }
}