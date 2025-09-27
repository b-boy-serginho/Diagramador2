# 🤖 Integración de IA en Diagramador2

## Descripción
Se ha integrado un sistema de inteligencia artificial completo en tu proyecto Diagramador2, que permite generar, analizar y optimizar diagramas UML de manera inteligente.

## 🚀 Funcionalidades Implementadas

### 1. **Generador de Diagramas con IA**
- Genera diagramas UML completos desde descripciones en texto natural
- Crea clases, atributos, métodos y relaciones automáticamente
- Soporte para diferentes tipos de relaciones UML

### 2. **Analizador Inteligente**
- Analiza diagramas existentes y proporciona sugerencias de mejora
- Detecta inconsistencias y mejores prácticas
- Ofrece recomendaciones de optimización

### 3. **Generador de Código**
- Convierte diagramas UML a código en múltiples lenguajes
- Soporte para Java, Python, JavaScript, TypeScript, C#, C++
- Código limpio y bien estructurado

### 4. **Chat Asistente**
- Asistente conversacional para dudas sobre UML
- Ayuda contextual basada en el diagrama actual
- Explicaciones detalladas de conceptos

## 📁 Archivos Creados

```
src/
├── services/
│   └── aiService.js              # Servicio principal de IA
├── components/
│   └── ai/
│       ├── AIPanel.jsx           # Panel principal de IA
│       ├── ChatAssistant.jsx     # Chat con asistente
│       ├── DiagramGenerator.jsx  # Generador de diagramas
│       ├── DiagramAnalyzer.jsx   # Analizador de diagramas
│       └── CodeGenerator.jsx     # Generador de código
└── pages/
    └── BoardPage.jsx             # Integración en la página principal
```

## ⚙️ Configuración

### 1. **Variables de Entorno**
Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_OPENAI_API_KEY=tu_clave_de_openai_aqui
```

### 2. **Obtener API Key de OpenAI**
1. Ve a [OpenAI Platform](https://platform.openai.com/)
2. Crea una cuenta o inicia sesión
3. Ve a "API Keys" en el menú
4. Crea una nueva clave API
5. Copia la clave y pégala en tu archivo `.env`

### 3. **Instalación de Dependencias**
```bash
npm install axios
```

## 🎯 Cómo Usar

### **Acceder al Panel de IA**
1. Abre cualquier tablero en tu diagramador
2. Haz clic en el botón **"Asistente IA"** en la barra superior
3. Se abrirá el panel con todas las funcionalidades

### **Generar Diagramas**
1. Ve a la pestaña **"Generar"**
2. Describe el sistema que quieres modelar
3. Haz clic en **"Generar Diagrama"**
4. El diagrama se creará automáticamente

### **Analizar Diagramas**
1. Ve a la pestaña **"Analizar"**
2. Haz clic en **"Analizar Diagrama"**
3. Revisa las sugerencias y mejoras

### **Generar Código**
1. Ve a la pestaña **"Código"**
2. Selecciona el lenguaje de programación
3. Haz clic en **"Generar Código"**
4. Copia o descarga el código generado

### **Chat con Asistente**
1. Haz clic en **"Chat"** en el panel de IA
2. Escribe tu pregunta sobre UML
3. Recibe respuestas inteligentes y contextuales

## 💡 Ejemplos de Uso

### **Generar Diagrama de Biblioteca**
```
Descripción: "Sistema de gestión de biblioteca con clases Usuario, Libro, Prestamo. Los usuarios pueden prestar libros, los libros tienen título y autor, los préstamos tienen fecha de inicio y fin"
```

### **Preguntas al Chat**
- "¿Qué es la herencia en UML?"
- "¿Cómo represento una relación de composición?"
- "¿Cuál es la diferencia entre agregación y composición?"

## 🔧 Personalización

### **Modificar Prompts**
Edita el archivo `src/services/aiService.js` para personalizar los prompts y mejorar las respuestas.

### **Agregar Nuevos Lenguajes**
Modifica `src/components/ai/CodeGenerator.jsx` para agregar soporte a más lenguajes de programación.

### **Personalizar Análisis**
Ajusta `src/components/ai/DiagramAnalyzer.jsx` para cambiar los criterios de análisis.

## 🚨 Consideraciones Importantes

### **Costos de API**
- OpenAI cobra por uso (aproximadamente $0.03 por 1K tokens)
- Monitorea tu uso en el dashboard de OpenAI
- Considera implementar límites de uso para usuarios

### **Rendimiento**
- Las llamadas a la API pueden tomar 2-5 segundos
- Implementa estados de carga para mejor UX
- Considera cachear respuestas frecuentes

### **Seguridad**
- Nunca expongas tu API key en el frontend
- Considera usar un backend proxy para las llamadas
- Implementa validación de entrada

## 🔮 Próximas Mejoras

- [ ] Integración con Claude API
- [ ] Soporte para diagramas de secuencia
- [ ] Análisis de código existente
- [ ] Sugerencias de refactorización
- [ ] Exportación a diferentes formatos
- [ ] Colaboración en tiempo real con IA

## 🆘 Solución de Problemas

### **Error: "API Key no encontrada"**
- Verifica que el archivo `.env` existe
- Asegúrate de que la variable `VITE_OPENAI_API_KEY` esté definida
- Reinicia el servidor de desarrollo

### **Error: "Rate limit exceeded"**
- Has excedido el límite de llamadas a la API
- Espera unos minutos o actualiza tu plan de OpenAI

### **Error: "Invalid API key"**
- Verifica que la clave API sea correcta
- Asegúrate de que la clave tenga permisos suficientes

## 📞 Soporte

Si tienes problemas con la integración de IA:
1. Revisa la consola del navegador para errores
2. Verifica la configuración de las variables de entorno
3. Consulta la documentación de OpenAI
4. Revisa los logs del servidor

---

¡Disfruta de tu nuevo diagramador inteligente! 🎉
