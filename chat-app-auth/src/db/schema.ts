import { promisify } from 'util';
import knex from 'knex';
import knexConfig from './knexfile.js';
import { Model, JSONSchema } from 'objection';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import type { UserData, UserModel } from '../types/index.js';

const knexConnection = knex(knexConfig);
const randomBytesAsync = promisify(crypto.randomBytes);

Model.knex(knexConnection);

export class User extends Model implements UserModel {
  userid!: number;
  username!: string;
  email!: string;
  password!: string;
  token!: string;

  static override get tableName(): string {
    return 'users';
  }

  static override get idColumn(): string {
    return 'userid';
  }

  getUser(): UserData {
    return {
      userid: this.userid,
      username: this.username,
      token: this.token,
      email: this.email,
    };
  }

  override async $beforeInsert(): Promise<void> {
    const salt = bcrypt.genSaltSync();
    this.password = await bcrypt.hash(this.password, salt);
    const createRandomToken = await randomBytesAsync(16).then(buf => buf.toString('hex'));
    this.token = createRandomToken;
  }

  verifyPassword(password: string, callback: (err: Error | undefined, result: boolean) => void): void {
    bcrypt.compare(password, this.password, callback);
  }

  static override get jsonSchema(): JSONSchema {
    return {
      type: 'object',
      required: ['username', 'email'],
      properties: {
        userid: { type: 'integer' },
        username: { type: 'string', minLength: 1, maxLength: 255 },
        token: { type: 'string', minLength: 1, maxLength: 255 },
        email: { type: 'string', minLength: 1, maxLength: 255 }
      }
    };
  }
}