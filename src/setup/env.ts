import { config } from 'dotenv';

config();

if (
  !('CLIENT_ID' in process.env) ||
  !('CLIENT_SECRET' in process.env) ||
  !('MONGODB_URI' in process.env) ||
  !('JWT_SECRET' in process.env)
)
  throw new Error('Undefined environment variables');
