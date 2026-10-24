import { createApp } from './app.js';
import { config } from './infrastructure/config/index.js';

const app = createApp();

// Hanya jalankan app.listen jika TIDAK sedang berjalan di serverless environment (seperti Vercel)
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  const server = app.listen(config.port, () => {
    console.log(`===============================================`);
    console.log(`🚀 Alight Motion Premium API is running!`);
    console.log(`🌐 Port: ${config.port}`);
    console.log(`⚙️  Environment: ${config.nodeEnv}`);
    console.log(`📌 Documentation: http://localhost:${config.port}/`);
    console.log(`===============================================`);
  });

  // Handle graceful shutdown
  const handleShutdown = (signal: string) => {
    console.log(`Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      console.log('HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => handleShutdown('SIGINT'));
  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
}

export default app;
