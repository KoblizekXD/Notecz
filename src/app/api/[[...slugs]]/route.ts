import { AppModule } from '@/lib/authlib';
import swagger from '@elysiajs/swagger';
import { Elysia } from 'elysia';
import { auth } from './auth';
import { notes } from './user/note';
import { user } from './user';
import { elysia, logger } from '@/lib/util';

elysia.use(AppModule)
	.use(
		  swagger({
		    path: '/docs',
		    documentation: {
		      info: {
		        title: 'Notecz API documentation',
		        description: 'Development documentation for the Notecz public API',
		        version: '1.0.0',
		      },
		      tags: [
		        {
		          name: 'Authentication',
		          description:
		            'Authentication endpoints. Authentication in Notecz is session based. Some requests might require session cookie to be present',
		        },
		        {
		          name: 'Notes',
		          description: 'Endpoints for interacting with notes',
		        },
		        {
		          name: 'User',
		          description:
		            'Endpoints for interacting with users(primarily fetching information)',
		        },
		      ],
		      components: {
		        securitySchemes: {
		          cookieAuth: {
		            type: 'apiKey',
		            in: 'cookie',
		            name: 'session',
		          },
		        },
		      },
		    },
		  }),
		)
	.use(auth)
	.use(user)
	.use(notes);

if (process.env.BACKEND_ONLY) {
  logger.info('Detected backend only mode, skipping frontend setup, and launching API only');
  elysia.listen(3000);
}

export const GET = elysia.handle;
export const POST = elysia.handle;