import { eq } from 'drizzle-orm';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { db } from '../database';
// TODO: FIXME IMPORTS
// import { Users, users } from 'packages/drizzle-api/drizzle-definitions/src';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  Users,
  insertUserSchema,
  users,
} from '../../../drizzle-definitions/src'; //' drizzle-definitions/src';

export default async function (fastify: FastifyInstance) {
  fastify.get(
    '/users',
    async function (request: FastifyRequest, reply: FastifyReply) {
      const foundUsers = await db.select().from(users).all();
      return { users: foundUsers };
    }
  );

  fastify.post(
    '/users',
    async function (
      request: FastifyRequest<{
        Body: Omit<Partial<Users>, 'id'>;
      }>,
      reply: FastifyReply
    ) {
      const parsedParams = insertUserSchema.parse(request.body);

      const createdUser = db
        .insert(users)
        // @ts-expect-error Drizzles typings are seemingly wrong here...
        .values(parsedParams)
        .returning()
        .get();

      return { user: createdUser };
    }
  );

  fastify.get(
    '/users/:userId',
    async function (
      request: FastifyRequest<{ Params: { userId: string } }>,
      reply: FastifyReply
    ) {
      const foundUser = await db
        .select()
        .from(users)
        .where(eq(users.id, Number(request.params.userId)))
        .get();

      if (typeof foundUser === 'undefined') {
        reply.callNotFound();
        return;
      }

      return { user: foundUser };
    }
  );

  fastify.patch(
    '/users/:userId',
    async function (
      request: FastifyRequest<{
        Body: Omit<Partial<Users>, 'id'>;
        Params: { userId: string };
      }>,
      reply: FastifyReply
    ) {
      if (typeof request.params.userId !== 'string')
        throw new Error('Invalid params, missing userId');

      const { body, params } = request;
      const setValues: Partial<Users> = {};
      if (body.cityId) setValues.cityId = body.cityId;
      if (body.email) setValues.email = body.email;
      if (body.name) setValues.name = body.name;

      const updatedUser = db
        .update(users)
        .set(setValues)
        .where(eq(users.id, Number(params.userId)))
        .returning()
        .get();

      return { user: updatedUser };
    }
  );

  fastify.delete(
    '/users/:userId',
    async function (
      request: FastifyRequest<{ Params: { userId: string } }>,
      reply: FastifyReply
    ) {
      return await db
        .delete(users)
        .where(eq(users.id, Number(request.params.userId)))
        .run();
    }
  );
}
