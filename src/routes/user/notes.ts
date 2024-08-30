import { Elysia, error, t } from "elysia";
import { logger, prisma } from "../..";
import { AppModule } from "../../util/app";
import { Permission } from "@prisma/client";

export const notes = new Elysia()
  .use(AppModule)
  .get('/', async ({ query }) => {
    const count = parseInt(query['count'] ?? '12');
    const offset = parseInt(query['offset'] ?? '0');
    if (isNaN(count) || isNaN(offset)) return error('Bad Request', { message: 'Invalid count or offset, expecting an integer.' });
    return {
      notes: await prisma.note.findMany({
        take: count, skip: offset, omit: { content: true }
      }),
      total: await prisma.note.count()
    };
  }, {
    detail: {
      description: 'Fetches number of existing notes, without their content',
      tags: ['Notes'],
      responses: {
        200: {
          description: 'Request was sucessful, response body contains notes and total count of notes',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  notes: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'integer',
                          description: 'Unique identifier of the note'
                        },
                        title: {
                          type: 'string',
                          description: 'Title of the note'
                        }
                      }
                    }
                  },
                  total: {
                    type: 'integer',
                    description: 'Total number of notes in the database'
                  }
                }
              }
            }
          }
        }
      },
      parameters: [
        {
          name: 'count',
          in: 'query',
          description: 'Number of notes to fetch, defaults to 12, if missing',
          required: false,
          schema: {
            type: 'integer'
          },
          example: 12
        },
        {
          name: 'offset',
          in: 'query',
          description: 'Number of notes to skip, defaults to 0, if missing',
          required: false,
          schema: {
            type: 'integer'
          },
          example: 12
        }
      ]
    }
  })
  .post('/', async ({ body, authManager }) => {
    const user = await authManager.authorized([Permission.CREATE_POST]);

    logger.info(`${user.username}: Creating new note: ${body.title}`);
    const res = await prisma.note.create({
      data: {
        title: body.title,
        content: body.content,
        author: {
          connect: {
            id: user.id
          }
        }
      }
    })
    return res ? Response.json({ id: res.id }, { status: 201 }) : error('Internal Server Error')
  }, {
    body: t.Object({
      title: t.String({ minLength: 5, maxLength: 35 }),
      content: t.String({ minLength: 20, maxLength: 5000 }),
    }),
    detail: {
      description: 'Creates a new note',
      tags: ['Notes'],
      responses: {
        201: {
          description: 'New note was created succesfully',
        },
        401: {
          description: 'User was not authenticated or didn\'t have sufficient permissions to access this route',
        },
        422: {
          description: 'Request body validation failed, see the response body for more information'
        }
      }
    },
  })