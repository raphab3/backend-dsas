import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCompanyTable1712671170716 implements MigrationInterface {
    name = 'CreateCompanyTable1712671170716'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "companys" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "cnpj" character varying(255), "cpf" character varying(255), "employees_number" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_c892294a59655f5cb25e355fa40" UNIQUE ("cnpj"), CONSTRAINT "UQ_cc5bb7652bc6261caa7b734451f" UNIQUE ("cpf"), CONSTRAINT "PK_a4f1caae0b4e0af6fe3315cec31" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "companies_professionals" ("company_id" integer NOT NULL, "professional_id" integer NOT NULL, CONSTRAINT "PK_0b44823ca7230f5ccb9cc70fb31" PRIMARY KEY ("company_id", "professional_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_20fe555fdbc1f5611434941814" ON "companies_professionals" ("company_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_a7ed68fa4b649fd4084e92e911" ON "companies_professionals" ("professional_id") `);
        await queryRunner.query(`ALTER TABLE "companies_professionals" ADD CONSTRAINT "FK_20fe555fdbc1f5611434941814d" FOREIGN KEY ("company_id") REFERENCES "companys"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "companies_professionals" ADD CONSTRAINT "FK_a7ed68fa4b649fd4084e92e9113" FOREIGN KEY ("professional_id") REFERENCES "professionals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "companies_professionals" DROP CONSTRAINT "FK_a7ed68fa4b649fd4084e92e9113"`);
        await queryRunner.query(`ALTER TABLE "companies_professionals" DROP CONSTRAINT "FK_20fe555fdbc1f5611434941814d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a7ed68fa4b649fd4084e92e911"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_20fe555fdbc1f5611434941814"`);
        await queryRunner.query(`DROP TABLE "companies_professionals"`);
        await queryRunner.query(`DROP TABLE "companys"`);
    }

}
