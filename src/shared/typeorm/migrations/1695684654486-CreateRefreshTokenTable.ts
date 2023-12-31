/* eslint-disable prettier/prettier */
import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateRefreshTokenTable1695684654486
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'refresh_token',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'user_id',
            type: 'string',
          },
          {
            name: 'token',
            type: 'string',
            isUnique: true,
          },
          {
            name: 'valid',
            type: 'boolean',
            default: true,
          },
          {
            name: 'expires',
            type: 'timestamp',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            name: 'refreshTokensUsers',
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            columnNames: ['user_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    )
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('refresh_token')
  }
}
