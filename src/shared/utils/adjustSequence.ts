import { QueryRunner } from 'typeorm';

export async function adjustSequence(
  queryRunner: QueryRunner,
  tableName: string,
  sequenceName: string,
  primaryKeyColumn: string,
): Promise<void> {
  const maxResult = await queryRunner.query(
    `SELECT MAX(${primaryKeyColumn}) AS max_id FROM ${tableName}`,
  );
  const maxId = maxResult[0].max_id || 0;

  await queryRunner.query(
    `ALTER SEQUENCE ${sequenceName} RESTART WITH ${maxId + 1}`,
  );
}
