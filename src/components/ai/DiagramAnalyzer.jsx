import React, { useState } from 'react';
import { FaSearch, FaSpinner, FaCheck, FaExclamationTriangle, FaInfoCircle, FaLightbulb } from 'react-icons/fa';
import aiService from '../../services/aiService';

const DiagramAnalyzer = ({ nodes, edges }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!nodes || nodes.length === 0) {
      setError('No hay diagrama para analizar. Crea al menos una clase.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await aiService.analyzeDiagram(nodes, edges);
      setAnalysis(result);
    } catch (error) {
      console.error('Error analizando diagrama:', error);
      setError('Error al analizar el diagrama. Por favor, inténtalo de nuevo.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'error':
        return <FaExclamationTriangle className="text-red-500" />;
      case 'warning':
        return <FaExclamationTriangle className="text-yellow-500" />;
      case 'info':
        return <FaInfoCircle className="text-blue-500" />;
      default:
        return <FaInfoCircle className="text-gray-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border">
      <div className="flex items-center space-x-2 mb-4">
        <FaSearch className="text-green-500 text-xl" />
        <h3 className="text-lg font-semibold text-gray-800">Analizador de Diagramas</h3>
      </div>

      <div className="space-y-4">
        <div className="text-sm text-gray-600">
          <p>Analiza tu diagrama UML y recibe sugerencias de mejora basadas en mejores prácticas.</p>
          <p className="mt-1">
            <strong>Clases:</strong> {nodes?.length || 0} | 
            <strong> Relaciones:</strong> {edges?.length || 0}
          </p>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !nodes || nodes.length === 0}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isAnalyzing ? (
            <>
              <FaSpinner className="animate-spin" />
              <span>Analizando...</span>
            </>
          ) : (
            <>
              <FaSearch />
              <span>Analizar Diagrama</span>
            </>
          )}
        </button>

        {error && (
          <div className="flex items-center space-x-2 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700">
            <FaExclamationTriangle />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {analysis && (
          <div className="space-y-4">
            {/* Sugerencias */}
            {analysis.suggestions && analysis.suggestions.length > 0 && (
              <div>
                <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                  <FaExclamationTriangle className="text-yellow-500" />
                  <span>Sugerencias</span>
                </h4>
                <div className="space-y-2">
                  {analysis.suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg border"
                    >
                      {getIconForType(suggestion.type)}
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">{suggestion.message}</p>
                        {suggestion.element && (
                          <p className="text-xs text-gray-500 mt-1">
                            Elemento: <span className="font-medium">{suggestion.element}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mejoras */}
            {analysis.improvements && analysis.improvements.length > 0 && (
              <div>
                <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                  <FaLightbulb className="text-blue-500" />
                  <span>Mejoras Sugeridas</span>
                </h4>
                <div className="space-y-2">
                  {analysis.improvements.map((improvement, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${getPriorityColor(improvement.priority)}`}
                    >
                      <div className="flex items-start justify-between">
                        <p className="text-sm flex-1">{improvement.description}</p>
                        <span className="text-xs font-medium ml-2 px-2 py-1 rounded-full bg-white">
                          {improvement.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(!analysis.suggestions || analysis.suggestions.length === 0) && 
             (!analysis.improvements || analysis.improvements.length === 0) && (
              <div className="flex items-center space-x-2 p-3 bg-green-100 border border-green-300 rounded-lg text-green-700">
                <FaCheck />
                <span className="text-sm">¡Tu diagrama se ve bien! No se encontraron problemas significativos.</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 p-3 bg-green-50 rounded-lg">
        <h4 className="text-sm font-medium text-green-800 mb-2">🔍 ¿Qué analiza el sistema?</h4>
        <ul className="text-xs text-green-700 space-y-1">
          <li>• Consistencia en nombres y convenciones</li>
          <li>• Relaciones lógicas entre clases</li>
          <li>• Completitud de atributos y métodos</li>
          <li>• Mejores prácticas de diseño UML</li>
          <li>• Sugerencias de optimización</li>
        </ul>
      </div>
    </div>
  );
};

export default DiagramAnalyzer;
