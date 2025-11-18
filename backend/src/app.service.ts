import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TestModel } from './others/test.model';
import { Sequelize } from 'sequelize-typescript';
import { QueryTypes } from 'sequelize';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(TestModel) private readonly testModel: typeof TestModel,
    private readonly sequelize: Sequelize,
  ) {}

  getHealth(): string {
    console.log('HEalth check');

    return 'The server is healthy!';
  }

  async getTest() {
    return await this.testModel.findAll();
  }

  async deleteUsers(user_id: number) {
    const [provider]: any = await this.sequelize.query(
      'select provider_id from main.providers where user_id = :user_id',
      { replacements: { user_id }, type: 'SELECT' },
    );

    await this.sequelize.query(
     `delete from main.providers where user_id = :user_id;
      delete from main.users where user_id = :user_id;
      delete from main.refresh_tokens where user_id = :user_id;
      delete from main.users_bookmark where user_id = :user_id;
      delete from main.provider_profession where provider_id = :provider_id;
      `,
      {
        replacements: { user_id, provider_id: provider?.provider_id || null },
        type: QueryTypes.DELETE,
      },
    );
  }
}
