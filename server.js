import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Inicializa Gemini con API Key de variable de entorno
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Servir archivos estáticos
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/images', express.static(path.join(__dirname, 'ImageSource')));
app.use('/plantillas', express.static(path.join(__dirname, 'plantillas')));

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'plantillas', 'index.html'));
});

// Ruta para generar configuración de PC
app.post('/api/generate-pc-config', async (req, res) => {
  try {
    const { budget, usage, brand, features } = req.body;

    const prompt = `
Genera una configuración de PC para:
- Presupuesto: ${budget}
- Uso principal: ${usage}
- Preferencia de marca: ${brand || 'Sin preferencia'}
- Características especiales: ${features || 'Ninguna'}

Responde SOLO con un JSON válido en este formato:
{
    "components": {
        "cpu": {"name": "nombre del procesador", "price": precio},
        "gpu": {"name": "nombre de la tarjeta gráfica", "price": precio},
        "ram": {"name": "especificación de RAM", "price": precio},
        "storage": {"name": "almacenamiento", "price": precio},
        "motherboard": {"name": "placa base", "price": precio},
        "psu": {"name": "fuente de poder", "price": precio},
        "case": {"name": "gabinete", "price": precio}
    },
    "totalPrice": precio_total,
    "recommendations": ["recomendación 1", "recomendación 2", "recomendación 3"]
}

Usa precios reales y componentes actuales del mercado.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ parts: [{ text: prompt }] }],
    });

    // Extraer texto de la respuesta de Gemini
    const aiResponse = response.candidates[0]?.content?.parts[0]?.text;

    if (!aiResponse) {
      throw new Error('No se recibió respuesta de Gemini');
    }

    // Parsear JSON
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const config = JSON.parse(jsonMatch[0]);
      res.json({ success: true, data: config });
    } else {
      throw new Error('No se pudo parsear la respuesta de IA');
    }
  } catch (error) {
    console.error('Error en Gemini:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Iniciar servidor en puerto 5500
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log('📁 Archivos estáticos servidos correctamente');
  console.log('🤖 API de Gemini lista');
});
