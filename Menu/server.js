import express from 'express';
const server = express();

const PORT = process.env.PORT || 3000;

// Middleware para registrar las solicitudes
server.use((req, res, next) => {
  console.log(`Solicitud recibida: ${req.method} ${req.url}`);
  next();
});

// Endpoint raíz
server.all('/', (req, res) => {
  res.send('El bot está activo y listo para ser usado.');
});

// Endpoint de estado
server.get('/status', (req, res) => {
  res.send({ status: 'El bot está activo y funcionando.', timestamp: new Date() });
});

// Manejo de errores
server.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal! D:');
});

function keepAlive() {
  server.listen(PORT, () => { 
    console.log(`Servidor activo en el puerto ${PORT}. Hora: ${Date.now()}`); 
  });
}

export default keepAlive;
