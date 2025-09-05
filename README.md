# 🤖 Asistente IA para Ensamblaje de PC

Un asistente inteligente que te ayuda a elegir los componentes perfectos para tu PC usando inteligencia artificial.

## ✨ Características

- **🧠 IA Real**: Integración con OpenAI GPT-3.5-turbo
- **🎯 Configuraciones Personalizadas**: Según presupuesto y uso
- **📊 Modelos 3D Interactivos**: Visualización de componentes
- **🔄 Evolución de PC**: Comparación vintage vs moderno
- **💾 Exportación**: Guardar y exportar configuraciones
- **🔒 Seguridad**: API key protegida en el backend

## 🚀 Instalación y Uso

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Iniciar el Servidor
```bash
npm start
```

### 3. Abrir en el Navegador
```
http://localhost:3000
```

## 📁 Estructura del Proyecto

```
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # JavaScript del frontend
├── server.js           # Servidor Express
├── package.json        # Dependencias
└── README.md          # Este archivo
```

## 🔧 API Endpoints

### POST `/api/generate-pc-config`
Genera una configuración de PC usando IA.

**Body:**
```json
{
  "budget": "800-1200",
  "usage": "gaming",
  "brand": "amd",
  "features": "rgb, silent"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "components": {
      "cpu": {"name": "AMD Ryzen 5 5600X", "price": 250},
      "gpu": {"name": "RTX 3060", "price": 350},
      // ... más componentes
    },
    "totalPrice": 1200,
    "recommendations": ["Recomendación 1", "Recomendación 2"]
  }
}
```

### POST `/api/chat`
Chat general con la IA sobre hardware.

### GET `/api/status`
Verifica el estado de la API y conexión con OpenAI.

## 🎮 Funcionalidades

### 1. **Asistente IA para PC**
- Selección de presupuesto ($500 - $3000+)
- Uso principal (Gaming, Oficina, Streaming, etc.)
- Preferencias de marca (Intel/AMD, NVIDIA/AMD)
- Características especiales (RGB, Silenciosa, Compacta)

### 2. **Tutoriales Interactivos 3D**
- 6 modelos 3D de componentes reales
- Filtros por categorías
- Información detallada de cada componente

### 3. **Evolución de la PC**
- Comparación PC vintage vs moderna
- Tabla de características comparativas
- Modelos 3D de diferentes épocas

## 🔒 Seguridad

- **API Key protegida**: Solo en el backend, nunca expuesta al frontend
- **CORS habilitado**: Para desarrollo local
- **Validación de datos**: En todas las rutas de API
- **Manejo de errores**: Fallback a simulación si falla la IA

## 🛠️ Desarrollo

### Modo Desarrollo
```bash
npm run dev
```

### Estructura del Backend
- **Express.js**: Servidor web
- **OpenAI API**: Integración con GPT-3.5-turbo
- **CORS**: Para permitir requests del frontend
- **Body Parser**: Para procesar JSON

### Estructura del Frontend
- **Vanilla JavaScript**: Sin frameworks
- **CSS Grid/Flexbox**: Layout responsivo
- **Three.js**: Modelos 3D (preparado para futuras implementaciones)
- **Fetch API**: Comunicación con el backend

## 📱 Responsive Design

- **Desktop**: Layout completo con sidebar
- **Tablet**: Grid adaptativo
- **Mobile**: Stack vertical optimizado

## 🎨 Características de Diseño

- **Glassmorphism**: Efectos de cristal modernos
- **Gradientes**: Fondos dinámicos
- **Animaciones**: Transiciones suaves
- **Iconos**: Font Awesome
- **Colores**: Paleta moderna y profesional

## 🔧 Configuración

### Variables de Entorno (Opcional)
```bash
PORT=3000
OPENAI_API_KEY=tu_api_key_aqui
```

### Personalización
- Modifica `styles.css` para cambiar colores y estilos
- Edita `script.js` para agregar nuevas funcionalidades
- Actualiza `server.js` para modificar la lógica del backend

## 📊 Tecnologías Utilizadas

### Frontend
- HTML5
- CSS3 (Grid, Flexbox, Animations)
- JavaScript ES6+
- Font Awesome Icons

### Backend
- Node.js
- Express.js
- OpenAI API
- CORS
- Body Parser

## 🚀 Despliegue

### Heroku
```bash
git add .
git commit -m "Initial commit"
git push heroku main
```

### Vercel
```bash
vercel --prod
```

### Netlify
```bash
netlify deploy --prod
```

## 📝 Licencia

MIT License - Puedes usar este proyecto libremente.

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📞 Soporte

Si tienes problemas o preguntas:

1. Revisa la consola del navegador para errores
2. Verifica que el servidor esté corriendo
3. Comprueba la conexión a internet
4. Asegúrate de que la API key de OpenAI sea válida

---

¡Disfruta construyendo tu PC perfecta! 🎮✨