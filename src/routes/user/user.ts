import Elysia, { error } from "elysia";
import { AppModule } from "../../util/app";
import { prisma } from "../..";

export const user = new Elysia()
  .use(AppModule)
  .get('/:id', async ({ params }) => {
    console.log('x');
    const res = await prisma.user.findUnique({ 
      where: {
        id: params.id
      },
      select: {
        _count: {
          select: {
            notes: true
          }
        }
      }
    });
    
    if (res === null) return error('Not Found', { message: 'User not found.', id: params.id });
    return res;
  });