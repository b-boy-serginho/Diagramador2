// Script para listar modelos disponibles de Gemini
const API_KEY = 'AIzaSyBjKThZEIVuhf3Iw5u7J1A9uQUdUsEJP1w';
const LIST_MODELS_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

async function listAvailableModels() {
  try {
    const response = await fetch(`${LIST_MODELS_URL}?key=${API_KEY}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Modelos disponibles:');
      data.models.forEach(model => {
        console.log(`- ${model.name}`);
        console.log(`  Métodos soportados: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
        console.log('---');
      });
    } else {
      const error = await response.text();
      console.error('❌ Error:', response.status, error);
    }
  } catch (error) {
    console.error('❌ Error de conexión:', error);
  }
}

listAvailableModels();
