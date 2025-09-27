import React, { useState } from 'react';
import { FaRobot, FaMagic, FaSearch, FaCode, FaTimes } from 'react-icons/fa';
import ChatAssistant from './ChatAssistant';
import DiagramGenerator from './DiagramGenerator';
import DiagramAnalyzer from './DiagramAnalyzer';
import CodeGenerator from './CodeGenerator';

const AIPanel = ({ isOpen, onClose, nodes, edges, onGenerateDiagram }) => {
  const [activeTab, setActiveTab] = useState('generator');
  const [isChatOpen, setIsChatOpen] = useState(false);

  const tabs = [
    { id: 'generator', label: 'Generar', icon: FaMagic },
    { id: 'analyzer', label: 'Analizar', icon: FaSearch },
    { id: 'code', label: 'Código', icon: FaCode }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
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

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
          {/* Header */}
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
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b bg-gray-50">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>

      {/* Chat Assistant Modal */}
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
