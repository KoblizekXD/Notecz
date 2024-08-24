import Elysia, { error } from "elysia";
import { prisma } from "../..";

export const notes = new Elysia()
  .get('/', async ({ query }) => {
    const count = parseInt(query['count'] ?? '12');
    const offset = parseInt(query['offset'] ?? '0');
    if (isNaN(count) || isNaN(offset)) return error('Bad Gateway', { message: 'Invalid count or offset, expecting an integer.' });
    return {
      notes: await prisma.note.findMany({ take: count, skip: offset }),
      total: await prisma.note.count()
    };
  })