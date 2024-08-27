import Elysia, { error, t } from "elysia";
import { AppModule } from "../../util/app";
import { prisma } from "../..";

export const user = new Elysia()
  .use(AppModule)
  .get('/:id', async ({ params }) => {
    const res = await prisma.user.findUnique({ 
      where: {
        id: params.id
      },
      select: {
        id: true,
        username: true,
        name: true,
        notes: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });
    
    if (res === null) return error('Not Found', { message: 'User not found.', id: params.id });
    return res;
  }, {
    params: t.Object({
      id: t.String({ minLength: 1 })
    })
  });