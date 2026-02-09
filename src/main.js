@"
import express from 'express';
import dotenv from 'dotenv';
import { UniversidadService } from './services/UniversidadService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Ruta principal
app.get('/', (req, res) => {
    res.json({
        proyecto: 'UES-ICCIIS - Patrones de Diseño',
        descripcion: 'Proyecto educativo demostrando patrones de diseño',
        unidades: [
            'UNIDAD 1: Patrones Creacionales',
            'UNIDAD 2: Patrones Estructurales', 
            'UNIDAD 3: Patrones de Comportamiento'
        ]
    });
});

// Ruta para demostrar patrones
app.get('/patrones', async (req, res) => {
    try {
        const servicio = new UniversidadService();
        const resultados = await servicio.demostrarPatrones();
        res.json({
            success: true,
            data: resultados
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(\`🚀 Servidor ejecutándose en http://localhost:\${PORT}\`);
    console.log('🏫 Proyecto UES-ICCIIS - Patrones de Diseño');
});

export default app;
"@ | Out-File -FilePath "src/main.js" -Encoding UTF8