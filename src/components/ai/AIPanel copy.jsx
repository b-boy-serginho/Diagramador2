import React, { useState } from 'react';
import { FaRobot, FaMagic, FaSearch, FaCode, FaTimes, FaSpinner } from 'react-icons/fa';
import aiService from '../../services/aiService';
import DiagramGenerator from './DiagramGenerator';
import DiagramAnalyzer from './DiagramAnalyzer';
import CodeGenerator from './CodeGenerator';
import ChatAssistant from './ChatAssistant';
import { db } from '../../firebase-confing/Firebase';  // Corregido: importación correcta
import { collection, addDoc } from 'firebase/firestore';  // Importar Firestore correctamente

const AIPanel = ({ isOpen, onClose, nodes, edges }) => {
  const [activeTab, setActiveTab] = useState('generator');
  const [generatedSpringBootCode, setGeneratedSpringBootCode] = useState('');
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [error, setError] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const tabs = [
    { id: 'generator', label: 'Generar', icon: FaMagic },
    { id: 'analyzer', label: 'Analizar', icon: FaSearch },
    { id: 'code', label: 'Código', icon: FaCode },
    { id: 'springBoot', label: 'Spring Boot', icon: FaCode }
  ];

  // Define la función onGenerateDiagram
  const onGenerateDiagram = (nodes, edges) => {
    saveDiagramToFirestore(nodes, edges); // Guarda el diagrama en Firestore
  };

  // Función para guardar el diagrama en Firestore
  const saveDiagramToFirestore = async (nodes, edges) => {
    try {
      // Crea un nuevo documento en la colección "board" de Firestore
      const docRef = await addDoc(collection(db, "board"), {
        nodes: nodes,
        edges: edges,
        createdAt: new Date(),
      });
      console.log("Diagrama guardado con ID: ", docRef.id);
    } catch (e) {
      console.error("Error al guardar el diagrama en Firestore: ", e);
      setError('Hubo un error al guardar el diagrama.');
    }
  };

  const handleGenerateSpringBootCode = async () => {
    setIsGeneratingCode(true);
    setError(null);
    try {
      const code = await aiService.generateSpringBootCodeFromDiagram(nodes, edges);
      setGeneratedSpringBootCode(code);
    } catch (error) {
      setError('Hubo un error al generar el código. Por favor, intenta de nuevo.');
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'springBoot':
        return (
          <div className="space-y-4">
            <button
              onClick={handleGenerateSpringBootCode}
              disabled={isGeneratingCode}
              className="w-full py-3 px-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isGeneratingCode ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Generando código de Spring Boot...</span>
                </>
              ) : (
                'Generar Código Spring Boot'
              )}
            </button>
            {error && (
              <div className="text-red-500 p-4 bg-red-100 rounded-lg">{error}</div>
            )}
            {generatedSpringBootCode && (
              <div className="space-y-3">
                <div className="text-sm bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                  <pre className="font-mono">{generatedSpringBootCode}</pre>
                </div>
              </div>
            )}
          </div>
        );
      case 'generator':
        return <DiagramGenerator onGenerateDiagram={onGenerateDiagram} />;
      case 'analyzer':
        return <DiagramAnalyzer nodes={nodes} edges={edges} />;
      case 'code':
        return <CodeGenerator nodes={nodes} edges={edges} />;
      default:
        return <DiagramGenerator onGenerateDiagram={onGenerateDiagram} />;
    }
  };

  const handleCloseModal = () => {
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <div className="flex items-center space-x-2">
                <FaRobot className="text-xl" />
                <h2 className="text-lg font-semibold">Panel de IA</h2>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="px-3 py-1 bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition-colors text-sm"
                >
                  Chat
                </button>
                <button
                  onClick={handleCloseModal}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
            </div>

            <div className="flex border-b bg-gray-50">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-colors ${activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                  >
                    <Icon />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex-1 overflow-y-auto p-6">{renderTabContent()}</div>
          </div>
        </div>
      )}

      <ChatAssistant
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        context={{
          classCount: nodes?.length || 0,
          relationshipCount: edges?.length || 0
        }}
      />
    </>
  );
};

export default AIPanel;
