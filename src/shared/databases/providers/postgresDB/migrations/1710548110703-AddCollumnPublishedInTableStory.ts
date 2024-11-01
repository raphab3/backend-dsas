import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCollumnPublishedInTableStory1710548110703 implements MigrationInterface {
    name = 'AddCollumnPublishedInTableStory1710548110703'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stories" ADD "published" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stories" DROP COLUMN "published"`);
    }

}
