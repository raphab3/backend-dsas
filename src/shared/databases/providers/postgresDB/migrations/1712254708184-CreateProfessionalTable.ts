import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProfessionalTable1712254708184 implements MigrationInterface {
    name = 'CreateProfessionalTable1712254708184'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "professionals" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "register_number" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "guardian_id" integer, CONSTRAINT "REL_bd849317680f403c651009c5f4" UNIQUE ("guardian_id"), CONSTRAINT "PK_d7dc8473b49fcd938def2799387" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "professionals" ADD CONSTRAINT "FK_bd849317680f403c651009c5f48" FOREIGN KEY ("guardian_id") REFERENCES "guardians"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "professionals" DROP CONSTRAINT "FK_bd849317680f403c651009c5f48"`);
        await queryRunner.query(`DROP TABLE "professionals"`);
    }

}
