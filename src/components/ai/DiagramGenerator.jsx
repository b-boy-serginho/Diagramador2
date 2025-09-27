import React, { useState } from 'react';
import { FaMagic, FaSpinner, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import aiService from '../../services/aiService';

const DiagramGenerator = ({ onGenerateDiagram }) => {
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleGenerate = async () => {
    if (!description.trim()) {
      setError('Por favor, describe el diagrama que quieres generar');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await aiService.generateDiagramFromText(description);
      
      // Convertir el resultado a nodos y edges compatibles con el diagramador
      const nodes = result.classes.map((cls, index) => ({
        id: (index + 1).toString(),
        type: 'classNode',
        position: {
          x: Math.random() * 400 + 100,
          y: Math.random() * 300 + 100
        },
        data: {
          className: cls.name,
          attributes: cls.attributes || [],
          methods: cls.methods || []
        }
      }));

      const edges = result.relationships.map((rel, index) => {
        const sourceNode = nodes.find(n => n.data.className === rel.source);
        const targetNode = nodes.find(n => n.data.className === rel.target);
        
        if (!sourceNode || !targetNode) return null;

        return {
          id: `edge-${index}`,
          source: sourceNode.id,
          target: targetNode.id,
          type: 'start-end',
          data: {
            type: rel.type,
            startLabel: rel.startLabel || '',
            endLabel: rel.endLabel || ''
          }
        };
      }).filter(edge => edge !== null);

      onGenerateDiagram(nodes, edges);
      setSuccess(true);
      setDescription('');
      
      // Ocultar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error generando diagrama:', error);
      setError('Error al generar el diagrama. Por favor, inténtalo de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border">
      <div className="flex items-center space-x-2 mb-4">
        <FaMagic className="text-blue-500 text-xl" />
        <h3 className="text-lg font-semibold text-gray-800">Generador de Diagramas con IA</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Describe el diagrama que quieres generar:
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ejemplo: Sistema de gestión de biblioteca con clases Usuario, Libro, Prestamo. Los usuarios pueden prestar libros, los libros tienen título y autor, los préstamos tienen fecha de inicio y fin..."
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            disabled={isGenerating}
          />
          <p className="text-xs text-gray-500 mt-1">
            Presiona Ctrl+Enter para generar rápidamente
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !description.trim()}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isGenerating ? (
            <>
              <FaSpinner className="animate-spin" />
              <span>Generando...</span>
            </>
          ) : (
            <>
              <FaMagic />
              <span>Generar Diagrama</span>
            </>
          )}
        </button>

        {error && (
          <div className="flex items-center space-x-2 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700">
            <FaExclamationTriangle />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center space-x-2 p-3 bg-green-100 border border-green-300 rounded-lg text-green-700">
            <FaCheck />
            <span className="text-sm">¡Diagrama generado exitosamente!</span>
          </div>
        )}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Consejos para mejores resultados:</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Describe las entidades principales y sus relaciones</li>
          <li>• Menciona atributos y métodos importantes</li>
          <li>• Especifica el tipo de relaciones (herencia, composición, etc.)</li>
          <li>• Sé específico sobre la funcionalidad del sistema</li>
        </ul>
      </div>
    </div>
  );
};

export default DiagramGenerator;
