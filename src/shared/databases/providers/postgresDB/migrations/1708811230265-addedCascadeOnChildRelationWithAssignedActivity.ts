import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedCascadeOnChildRelationWithAssignedActivity1708811230265
  implements MigrationInterface
{
  name = 'AddedCascadeOnChildRelationWithAssignedActivity1708811230265';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "contacts" ALTER COLUMN "first_name" DROP NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE "contacts" ALTER COLUMN "last_name" DROP NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE "contacts" ALTER COLUMN "email" DROP NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE "contacts" ALTER COLUMN "message" DROP NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE "contacts" ALTER COLUMN "subject" DROP NOT NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "contacts" ALTER COLUMN "subject" SET NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE "contacts" ALTER COLUMN "message" SET NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE "contacts" ALTER COLUMN "email" SET NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE "contacts" ALTER COLUMN "last_name" SET NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE "contacts" ALTER COLUMN "first_name" SET NOT NULL',
    );
  }
}
