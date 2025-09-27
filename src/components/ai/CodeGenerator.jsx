import React, { useState } from 'react';
import { FaCode, FaSpinner, FaDownload, FaCopy, FaCheck } from 'react-icons/fa';
import aiService from '../../services/aiService';

const CodeGenerator = ({ nodes, edges }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('java');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const languages = [
    { value: 'java', label: 'Java' },
    { value: 'python', label: 'Python' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'csharp', label: 'C#' },
    { value: 'cpp', label: 'C++' }
  ];

  const handleGenerateCode = async () => {
    if (!nodes || nodes.length === 0) {
      setError('No hay diagrama para generar código. Crea al menos una clase.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedCode('');

    try {
      const code = await aiService.generateCodeFromDiagram(nodes, edges, selectedLanguage);
      setGeneratedCode(code);
    } catch (error) {
      console.error('Error generando código:', error);
      setError('Error al generar el código. Por favor, inténtalo de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copiando código:', error);
    }
  };

  const handleDownloadCode = () => {
    const extension = getFileExtension(selectedLanguage);
    const filename = `generated_code.${extension}`;
    
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  };

  const getFileExtension = (language) => {
    const extensions = {
      java: 'java',
      python: 'py',
      javascript: 'js',
      typescript: 'ts',
      csharp: 'cs',
      cpp: 'cpp'
    };
    return extensions[language] || 'txt';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border">
      <div className="flex items-center space-x-2 mb-4">
        <FaCode className="text-purple-500 text-xl" />
        <h3 className="text-lg font-semibold text-gray-800">Generador de Código</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
            Selecciona el lenguaje de programación:
          </label>
          <select
            id="language"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isGenerating}
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <div className="text-sm text-gray-600">
          <p>Genera código basado en tu diagrama UML de clases.</p>
          <p className="mt-1">
            <strong>Clases:</strong> {nodes?.length || 0} | 
            <strong> Relaciones:</strong> {edges?.length || 0}
          </p>
        </div>

        <button
          onClick={handleGenerateCode}
          disabled={isGenerating || !nodes || nodes.length === 0}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isGenerating ? (
            <>
              <FaSpinner className="animate-spin" />
              <span>Generando código...</span>
            </>
          ) : (
            <>
              <FaCode />
              <span>Generar Código {languages.find(l => l.value === selectedLanguage)?.label}</span>
            </>
          )}
        </button>

        {error && (
          <div className="flex items-center space-x-2 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700">
            <FaCode />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {generatedCode && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-semibold text-gray-800">Código Generado:</h4>
              <div className="flex space-x-2">
                <button
                  onClick={handleCopyCode}
                  className="flex items-center space-x-1 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm"
                >
                  {copied ? <FaCheck /> : <FaCopy />}
                  <span>{copied ? 'Copiado' : 'Copiar'}</span>
                </button>
                <button
                  onClick={handleDownloadCode}
                  className="flex items-center space-x-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm"
                >
                  <FaDownload />
                  <span>Descargar</span>
                </button>
              </div>
            </div>
            
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
              <pre className="text-sm whitespace-pre-wrap font-mono">
                {generatedCode}
              </pre>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 p-3 bg-purple-50 rounded-lg">
        <h4 className="text-sm font-medium text-purple-800 mb-2">💻 Características del generador:</h4>
        <ul className="text-xs text-purple-700 space-y-1">
          <li>• Genera clases con atributos y métodos</li>
          <li>• Implementa relaciones UML (herencia, composición, etc.)</li>
          <li>• Sigue convenciones del lenguaje seleccionado</li>
          <li>• Código limpio y bien estructurado</li>
          <li>• Listo para usar en tu proyecto</li>
        </ul>
      </div>
    </div>
  );
};

export default CodeGenerator;
