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
        take: count, skip: offset
      }),
      total: await prisma.note.count()
    };
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
    })
  })