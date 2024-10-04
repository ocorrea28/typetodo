import express from 'express';
import taskRoutes from './routes/taskRoutes';
import path from 'path';

const app = express();
app.use(express.json());

// Servir archivos estáticos como CSS e index.html
app.use(express.static(path.join(__dirname, 'public')));

// Rutas API
app.use('/api', taskRoutes);

// Ruta para servir el index.html directamente en la raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
