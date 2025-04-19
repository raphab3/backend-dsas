import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVerificationCodeToDocuments1745015570225 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "documents" ADD "verification_code" character varying`);
        await queryRunner.query(`CREATE INDEX "IDX_documents_verification_code" ON "documents" ("verification_code")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_documents_verification_code"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "verification_code"`);
    }

}
