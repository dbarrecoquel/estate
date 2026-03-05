// En développement local : charge le fichier .env
// En Docker : les variables sont injectées par docker-compose, dotenv ne fait rien
if (process.env.NODE_ENV !== 'production') {
    const { config } = await import('dotenv');
    config();
  }
  
  import express from 'express';
  import connectDB from './config/db.js';
  import adsRoutes from './routes/adsRoutes.js'
  import adsTypeRoutes from './routes/adsTypeRoutes.js'
  connectDB();
  
  const app = express();
  const PORT = process.env.PORT || 3000;
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  app.get('/', (req, res) => {
    res.json({
      success: true,
      message: 'API Product & Category — Node.js + MongoDB',
      version: '2.0.0',
      endpoints: {
        ads: '/api/ads'
      },
    });
  });
  
  app.use('/api/ads', adsRoutes);
  app.use('/api/adstype', adsTypeRoutes);
  app.use((req, res, next) => {
  console.log('REQ:', req.method, req.originalUrl)
  next()
})
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
    console.log(`Environnement : ${process.env.NODE_ENV}`);
  });