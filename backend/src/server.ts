import { env } from './config/env';
import { connectDB, disconnectDB } from './config/db';
import app from './app';

const PORT = env.PORT;

async function bootstrap(): Promise<void> {
  // 1. Connect to MongoDB
  await connectDB();

  // 2. Start HTTP server
  const server = app.listen(PORT, () => {
    console.log(
      `🚀  CMS Backend running on http://localhost:${PORT} [${env.NODE_ENV}]`
    );
  });

  // ── Graceful shutdown ────────────────────────────────────────────────────
  const shutdown = async (signal: string): Promise<void> => {
    console.log(`\n🛑  ${signal} received. Shutting down gracefully…`);
    server.close(async () => {
      await disconnectDB();
      console.log('👋  Server closed. Goodbye.');
      process.exit(0);
    });

    // Force exit after 10 s if graceful shutdown stalls
    setTimeout(() => {
      console.error('⏱️  Forced shutdown after timeout.');
      process.exit(1);
    }, 10_000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // ── Unhandled promise rejections ─────────────────────────────────────────
  process.on('unhandledRejection', (reason: unknown) => {
    console.error('💥  Unhandled Rejection:', reason);
    shutdown('unhandledRejection');
  });

  // ── Uncaught exceptions ──────────────────────────────────────────────────
  process.on('uncaughtException', (error: Error) => {
    console.error('💥  Uncaught Exception:', error.message);
    shutdown('uncaughtException');
  });
}

bootstrap().catch((err: Error) => {
  console.error('Fatal startup error:', err.message);
  process.exit(1);
});
