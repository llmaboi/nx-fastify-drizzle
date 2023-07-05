import { insertUserSchema, selectUserSchema } from '../lib/users';
import { makeInsertUser, makeSelectUser } from './users.generator';

describe('users.generator', () => {
  describe('makeUser', () => {
    it('generates an insert user', () => {
      const fakeUser = makeInsertUser();

      expect(insertUserSchema.safeParse(fakeUser).success).toBeTruthy();
    });

    it('generates an insert user', () => {
      const fakeUser = makeInsertUser();
      const parsed = insertUserSchema.parse(fakeUser)

      expect(parsed);
    });

    it('should not generate an id', () => {
      const fakeUser = makeInsertUser();

      // @ts-expect-error accessing non describe attribute
      expect(fakeUser.id).toBeUndefined();
    });
  });

  describe('makeSelectUser', () => {
    it('generates an existing user', () => {
      const fakeUser = makeSelectUser();

      expect(selectUserSchema.safeParse(fakeUser).success).toBeTruthy();
    });

    it('should generate an id', () => {
      const fakeUser = makeSelectUser();

      expect(typeof fakeUser.id).toBe('number');
    });
  });
});
