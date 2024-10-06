import Elysia, { error, t } from 'elysia';
import { AppModule } from '@/lib/authlib';
import { prisma } from '@/lib/util';
import { User } from '@prisma/client';

export const user = new Elysia({ prefix: '/user' })
  .use(AppModule)
  .get(
    '/:id',
    async ({ params }) => {
      const res = await prisma.user.findUnique({
        where: {
          id: params.id,
        },
        select: {
          id: true,
          username: true,
          name: true,
          notes: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      if (res === null)
        return error('Not Found', {
          message: 'User not found.',
          id: params.id,
        });
      return res;
    },
    {
      params: t.Object({
        id: t.String({ minLength: 1 }),
      }),
      detail: {
        tags: ['User'],
        description: 'Returns information about a user specified by their ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description:
              'Unique identifier of the user, the format used for identifiers is CUID',
            required: true,
          },
        ],
        responses: {
          200: {
            description:
              'Request was successful, the response body will contain information about the user and their notes',
          },
          404: {
            description:
              'User not found, the response body will contain an error message',
          },
        },
      },
    },
  )
  .get(
    '/me',
    async ({ authManager }) => {
      const user = await authManager.getAccessingUser();

      if (!user) return error('Unauthorized');

      const notes = await prisma.note.findMany({
        where: {
          authorId: user.id,
        },
      });

      const { password, permissions, ...userWithoutSensitiveFields } = user;
      return { ...userWithoutSensitiveFields, notes };
    },
    {
      detail: {
        tags: ['User'],
        description:
          'Returns information about the currently authenticated user',
        responses: {
          200: {
            description:
              'Request was successful, the response body will contain information about the user and their notes',
          },
          401: {
            description:
              'User is not authenticated, the response body will contain an error message',
          },
        },
      },
    },
  )
  .get(
    '/:id/notes',
    async ({ params }) => {
      const res = await prisma.user.findUnique({
        where: {
          id: params.id,
        },
        select: {
          notes: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      if (res === null)
        return error('Not Found', {
          message: 'User not found.',
          id: params.id,
        });
      return res.notes;
    },
    {
      detail: {
        description: 'Fetches notes created by a user specified by their ID',
        tags: ['User', 'Notes'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            description:
              'Unique identifier of the user, the format used for identifiers is CUID',
            required: true,
          },
        ],
        responses: {
          200: {
            description:
              'Request was successful, the response body will contain notes created by the user',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'integer',
                        description: 'Unique identifier of the note',
                      },
                      title: {
                        type: 'string',
                        description: 'Title of the note',
                      },
                    },
                  },
                },
              },
            },
          },
          404: {
            description:
              'User was not found, the response body will contain an error message',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      description: 'Error message',
                    },
                    id: {
                      type: 'string',
                      description: 'User ID',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  );
