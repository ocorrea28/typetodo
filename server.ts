import express from 'express';
import dotenv from 'dotenv';
import taskRoutes from './routes/taskRoutes';
import path from 'path';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Servir archivos estáticos como CSS e index.html
app.use(express.static(path.join(__dirname, 'public')));

// Rutas API
app.use('/api', taskRoutes);

// Ruta para servir el index.html directamente en la raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
