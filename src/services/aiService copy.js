import axios from 'axios';

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'; // Cambié la versión del modelo

class AIService {
  constructor() {
    this.apiKey = GOOGLE_API_KEY;
    this.baseURL = GEMINI_API_URL;
  }

   async generateSpringBootCodeFromDiagram(nodes, edges) {
    try {
      const diagramData = {
        classes: nodes.map(node => ({
          name: node.data.className,
          attributes: node.data.attributes,
          methods: node.data.methods
        })),
        relationships: edges.map(edge => ({
          source: edge.source,
          target: edge.target,
          type: edge.data.type
        }))
      };

      const prompt = `
        Genera un proyecto Spring Boot basado en el siguiente diagrama UML de clases:
        
        ${JSON.stringify(diagramData, null, 2)}
        
        Crea las siguientes capas:
        1. **Model/Entity**: Clase con atributos y métodos.
        2. **Repository**: Interfaz que extiende JpaRepository.
        3. **Service**: Lógica de negocio que maneja las entidades.
        4. **Controller**: Controlador REST para exponer la API.
        
        Responde SOLO con el código generado, sin explicaciones adicionales.
        Asegúrate de que el código sea válido y siga las mejores prácticas de Spring Boot.
      `;

      const response = await axios.post(
        `${this.baseURL}?key=${this.apiKey}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.5,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 3000,  // Aumento para cubrir las 4 capas de código
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const content = response.data.candidates[0].content.parts[0].text;
      return content; // El código generado para las 4 capas de Spring Boot
    } catch (error) {
      console.error('Error generando el código de Spring Boot:', error);
      throw new Error('Error al generar el código de Spring Boot');
    }
  }

  async generateDiagramFromText(description) {
    try {
      const prompt = `
        Genera un diagrama UML de clases basado en la siguiente descripción: "${description}"
        
        Responde SOLO con un JSON válido que contenga:
        {
          "classes": [
            {
              "name": "NombreClase",
              "attributes": ["+ atributo1: tipo", "+ atributo2: tipo"],
              "methods": ["+ metodo1(): tipoRetorno", "+ metodo2(): tipoRetorno"]
            }
          ],
          "relationships": [
            {
              "source": "ClaseOrigen",
              "target": "ClaseDestino",
              "type": "Association|Aggregation|Composition|Generalization",
              "startLabel": "0..1",
              "endLabel": "1"
            }
          ]
        }
        
        Asegúrate de que:
        - Los nombres de clases sean descriptivos
        - Los atributos tengan tipos apropiados
        - Los métodos tengan tipos de retorno
        - Las relaciones sean lógicas
        - El JSON sea válido y parseable
      `;

      const response = await axios.post(
        `${this.baseURL}?key=${this.apiKey}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1000,
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const content = response.data.candidates[0].content.parts[0].text;
      
      // Extraer JSON del contenido
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('No se pudo extraer JSON válido de la respuesta');
    } catch (error) {
      console.error('Error generando diagrama:', error);
      throw new Error('Error al generar el diagrama con IA');
    }
  }

  async analyzeDiagram(nodes, edges) {
    try {
      const diagramData = {
        classes: nodes.map(node => ({
          name: node.data.className,
          attributes: node.data.attributes,
          methods: node.data.methods
        })),
        relationships: edges.map(edge => ({
          source: edge.source,
          target: edge.target,
          type: edge.data.type,
          startLabel: edge.data.startLabel,
          endLabel: edge.data.endLabel
        }))
      };

      const prompt = `
        Analiza este diagrama UML de clases y proporciona sugerencias de mejora:
        
        ${JSON.stringify(diagramData, null, 2)}
        
        Responde con un JSON que contenga:
        {
          "suggestions": [
            {
              "type": "warning|info|error",
              "message": "Descripción de la sugerencia",
              "element": "nombre del elemento afectado"
            }
          ],
          "improvements": [
            {
              "description": "Descripción de la mejora",
              "priority": "high|medium|low"
            }
          ]
        }
      `;

      const response = await axios.post(
        `${this.baseURL}?key=${this.apiKey}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.5,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 800,
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const content = response.data.candidates[0].content.parts[0].text;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('No se pudo extraer JSON válido de la respuesta');
    } catch (error) {
      console.error('Error analizando diagrama:', error);
      throw new Error('Error al analizar el diagrama con IA');
    }
  }

  async chatWithAssistant(message, context = {}) {
    try {
      const systemPrompt = `
        Eres un asistente experto en UML y diseño de software. 
        Ayudas a los usuarios a crear, entender y mejorar diagramas de clases UML.
        
        Contexto actual:
        - Número de clases: ${context.classCount || 0}
        - Número de relaciones: ${context.relationshipCount || 0}
        
        Responde de manera clara, concisa y útil. Si el usuario pregunta sobre UML,
        proporciona ejemplos prácticos y mejores prácticas.
      `;

      const response = await axios.post(
        `${this.baseURL}?key=${this.apiKey}`,
        {
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\nUsuario: ${message}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 500,
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error en chat con asistente:', error);
      throw new Error('Error al comunicarse con el asistente de IA');
    }
  }

  async generateCodeFromDiagram(nodes, edges, language = 'java') {
    try {
      const diagramData = {
        classes: nodes.map(node => ({
          name: node.data.className,
          attributes: node.data.attributes,
          methods: node.data.methods
        })),
        relationships: edges.map(edge => ({
          source: edge.source,
          target: edge.target,
          type: edge.data.type
        }))
      };

      const prompt = `
        Genera código ${language} basado en este diagrama UML de clases:
        
        ${JSON.stringify(diagramData, null, 2)}
        
        Responde SOLO con el código generado, sin explicaciones adicionales.
        Asegúrate de que el código sea válido y siga las mejores prácticas de ${language}.
      `;

      const response = await axios.post(
        `${this.baseURL}?key=${this.apiKey}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1500,
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error generando código:', error);
      throw new Error('Error al generar código con IA');
    }
  }
}

export default new AIService();
