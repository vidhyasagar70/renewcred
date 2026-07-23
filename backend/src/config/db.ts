import mongoose from 'mongoose';
import { env } from './env';

const RETRY_INTERVAL_MS = 5000;
const MAX_RETRIES = 5;

/**
 * Establishes a connection to MongoDB via Mongoose.
 * Implements exponential-ready retry logic for resilience during startup.
 */
export async function connectDB(attempt = 1): Promise<void> {
  try {
    const conn = await mongoose.connect(env.MONGO_URI, {
      // Mongoose 8+ has sane defaults; override here if needed
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(
      `✅  MongoDB connected: ${conn.connection.host} (DB: ${conn.connection.name})`
    );

    // ── Connection lifecycle listeners ──────────────────────────────────────
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected. Attempting reconnect…');
    });

    mongoose.connection.on('error', (err: Error) => {
      console.error(`❌  MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('reconnected', () => {
      console.log('♻️  MongoDB reconnected successfully.');
    });
  } catch (error) {
    const err = error as Error;
    console.error(
      `❌  MongoDB connection failed (attempt ${attempt}/${MAX_RETRIES}): ${err.message}`
    );

    if (attempt < MAX_RETRIES) {
      console.log(`⏳  Retrying in ${RETRY_INTERVAL_MS / 1000}s…`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL_MS));
      return connectDB(attempt + 1);
    }

    console.error('💀  Max retries reached. Shutting down.');
    process.exit(1);
  }
}

/**
 * Gracefully disconnects from MongoDB.
 * Call this inside SIGTERM / SIGINT handlers.
 */
export async function disconnectDB(): Promise<void> {
  await mongoose.connection.close();
  console.log('🔌  MongoDB connection closed.');
}
