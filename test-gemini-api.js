// Script de prueba para verificar la API de Gemini
const API_KEY = 'AIzaSyBjKThZEIVuhf3Iw5u7J1A9uQUdUsEJP1w';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

async function testGeminiAPI() {
  console.log('🔍 Probando API de Gemini...');
  console.log('URL:', API_URL);
  console.log('API Key:', API_KEY.substring(0, 10) + '...');
  
  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: "Responde solo con 'OK' si puedes leer este mensaje"
          }]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 10
        }
      })
    });

    console.log('📊 Status:', response.status);
    console.log('📊 Status Text:', response.statusText);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ API funcionando:', data);
      return true;
    } else {
      const errorText = await response.text();
      console.error('❌ Error en API:', response.status, response.statusText);
      console.error('❌ Detalles del error:', errorText);
      return false;
    }
  } catch (error) {
    console.error('❌ Error de conexión:', error);
    return false;
  }
}

// Ejecutar la prueba
testGeminiAPI();