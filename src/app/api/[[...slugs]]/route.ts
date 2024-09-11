import { elysia, logger } from '@/lib/util';

if (process.env.BACKEND_ONLY) {
  logger.info(
    'Detected backend only mode, skipping frontend setup, and launching API only',
  );
  elysia.listen(3000);
}

export const GET = elysia.handle;
export const POST = elysia.handle;
