import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAllTables1709692536596 implements MigrationInterface {
  name = 'CreateAllTables1709692536596';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."questionnaires_type_enum" AS ENUM('milestone', 'activity')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."questionnaires_classification_month_enum" AS ENUM('12', '24', '36', '48', '60')`,
    );
    await queryRunner.query(
      `CREATE TABLE "questionnaires" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "slug" character varying(100) NOT NULL, "name" character varying(100) NOT NULL, "type" "public"."questionnaires_type_enum" NOT NULL DEFAULT 'milestone', "classification_month" "public"."questionnaires_classification_month_enum" NOT NULL DEFAULT '12', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_157917dccb6a31380ca4ab1a4ea" UNIQUE ("slug"), CONSTRAINT "UQ_b45b7a7b0ded99b4c6597a7c108" UNIQUE ("name"), CONSTRAINT "PK_a01d7cdea895ed9796b29233610" PRIMARY KEY ("id")); COMMENT ON COLUMN "questionnaires"."classification_month" IS 'Months'`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."questions_type_enum" AS ENUM('yes_no')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."questions_category_enum" AS ENUM('Social/Emotional', 'Language/Communication', 'Cognitive', 'Movement/Physical')`,
    );
    await queryRunner.query(
      `CREATE TABLE "questions" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."questions_type_enum" NOT NULL DEFAULT 'yes_no', "text" character varying(255) NOT NULL, "category" "public"."questions_category_enum" NOT NULL DEFAULT 'Social/Emotional', "description" character varying(255) NOT NULL, "correct_answer" character varying(100) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_08a6d4b0f49ff300bf3a0ca60ac" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."answer_reference_type_enum" AS ENUM('activity', 'milestone')`,
    );
    await queryRunner.query(
      `CREATE TABLE "answers" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "answer" character varying(100) NOT NULL, "questionnaire_uuid" uuid, "score" integer, "reference_uuid" uuid, "reference_type" "public"."answer_reference_type_enum", "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "question_id" integer, "child_id" integer, CONSTRAINT "PK_9c32cec6c71e06da0254f2226c6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "stories" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(100) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_18e913d264452630f78e9209e8c" UNIQUE ("title"), CONSTRAINT "PK_bb6f880b260ed96c452b32a39f0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "pages" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "order" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "storyId" integer, "attachmentId" integer, CONSTRAINT "REL_728bb0515ad770a59423d06b02" UNIQUE ("attachmentId"), CONSTRAINT "PK_8f21ed625aa34c8391d636b7d3b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."attachments_storage_drive_enum" AS ENUM('disk', 's3')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."attachments_attachment_type_enum" AS ENUM('avatar', 'story_page', 'activity_video', 'activity_material')`,
    );
    await queryRunner.query(
      `CREATE TABLE "attachments" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "filename" character varying(100) NOT NULL, "fieldname" character varying(100) NOT NULL, "mimetype" character varying(100) NOT NULL, "size" character varying(100) NOT NULL, "originalname" character varying(100) NOT NULL, "path" character varying(100) NOT NULL, "storage_drive" "public"."attachments_storage_drive_enum" NOT NULL, "attachment_type" "public"."attachments_attachment_type_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5e1f050bcff31e3084a1d662412" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(100) NOT NULL, "is_verified" boolean NOT NULL DEFAULT false, "phone" character varying(100), "password" character varying(255) NOT NULL, "is_admin" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "guardians" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "birthdate" date, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "REL_f1d05a3a2d70db0a25479b6718" UNIQUE ("user_id"), CONSTRAINT "PK_3dcf02f3dc96a2c017106f280be" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."children_sex_enum" AS ENUM('M', 'F')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."children_grade_enum" AS ENUM('not_in_school', 'kindergarten', 'preschool', 'elementary_school')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."children_neurodivergent_enum" AS ENUM('yes', 'no', 'uniformed')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."children_connection_to_child_enum" AS ENUM('father', 'mother', 'stepfather', 'stepmother', 'grandfather', 'grandmother', 'uncle', 'aunt', 'brother', 'sister', 'cousin', 'godfather', 'godmother', 'other')`,
    );
    await queryRunner.query(
      `CREATE TABLE "children" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "birthdate" date NOT NULL, "sex" "public"."children_sex_enum" NOT NULL, "grade" "public"."children_grade_enum" DEFAULT 'not_in_school', "is_studying" boolean NOT NULL, "neurodivergent" "public"."children_neurodivergent_enum", "connection_to_child" "public"."children_connection_to_child_enum" NOT NULL, "is_milestone_questionnaire_finished" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "attachmentId" integer, CONSTRAINT "PK_8c5a7cbebf2c702830ef38d22b0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."assigned_activities_status_enum" AS ENUM('pending', 'completed')`,
    );
    await queryRunner.query(
      `CREATE TABLE "assigned_activities" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."assigned_activities_status_enum" NOT NULL DEFAULT 'pending', "started_at" character varying, "finished_at" character varying, "activity_interventions" json NOT NULL DEFAULT '{"asked_for_help":0,"cried":0,"felt_bored":0}', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "activityId" integer, "childId" integer, CONSTRAINT "PK_2e4cee524068e8f17f846569996" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."activities_category_enum" AS ENUM('Social/Emotional', 'Language/Communication', 'Cognitive', 'Movement/Physical')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."activities_classification_month_enum" AS ENUM('12', '24', '36', '48', '60')`,
    );
    await queryRunner.query(
      `CREATE TABLE "activities" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(100) NOT NULL, "description" character varying(255) NOT NULL, "category" "public"."activities_category_enum" NOT NULL DEFAULT 'Social/Emotional', "classification_month" "public"."activities_classification_month_enum" NOT NULL DEFAULT '12', "published" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "questionnaireId" integer, CONSTRAINT "PK_7f4004429f731ffb9c88eb486a8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."dashboards_highlight_category_enum" AS ENUM('Social/Emotional', 'Language/Communication', 'Cognitive', 'Movement/Physical')`,
    );
    await queryRunner.query(
      `CREATE TABLE "dashboards" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "assigned_activities_completed" integer NOT NULL, "categories" text NOT NULL, "highlight_category" "public"."dashboards_highlight_category_enum" NOT NULL, "average_time_per_activity" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1b4b4bc346118e0d335f16c5344" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "audits" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid, "user_name" character varying, "user_email" character varying, "ip" character varying, "method" character varying, "path" character varying, "params" character varying, "query" character varying, "requestBody" text, "responseStatus" integer, "responsePayload" text, "startTime" TIMESTAMP, "endTime" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b2d7a2089999197dc7024820f28" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "contacts" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying(100), "last_name" character varying(100), "email" character varying(100), "phone" character varying(20), "company" character varying(100), "message" text, "website" character varying(100), "subject" character varying(100), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b99cd40cfd66a99f1571f4f72e6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "questionnaires_children" ("questionnaire_id" integer NOT NULL, "child_id" integer NOT NULL, CONSTRAINT "PK_58bf7098f1b39fbfb236765d0ad" PRIMARY KEY ("questionnaire_id", "child_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cd4541ef24613879598ce07044" ON "questionnaires_children" ("questionnaire_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4cf9e19f82d8f93f10a665ed05" ON "questionnaires_children" ("child_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "questionnaires_questions" ("question_id" integer NOT NULL, "questionnaire_id" integer NOT NULL, CONSTRAINT "PK_37916bcc3338ba810102084a703" PRIMARY KEY ("question_id", "questionnaire_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f7de44ab6ab819e296fe23854d" ON "questionnaires_questions" ("question_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b2fae70567c00c443064b49aaf" ON "questionnaires_questions" ("questionnaire_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "guardians_children" ("guardian_id" integer NOT NULL, "child_id" integer NOT NULL, CONSTRAINT "PK_9176bd2ca2fcca632f037bb89a8" PRIMARY KEY ("guardian_id", "child_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fc7ae31d1513aac2d7365d4438" ON "guardians_children" ("guardian_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5c461c3df282e7cb570edcd5b5" ON "guardians_children" ("child_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "activity_attachments" ("activity_id" integer NOT NULL, "attachment_id" integer NOT NULL, CONSTRAINT "PK_b5b43922c5fe1052ef34ec90a90" PRIMARY KEY ("activity_id", "attachment_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_34ce3a9fd0057c64fd053f5bd9" ON "activity_attachments" ("activity_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5cda77f460ddfdb8221ea9f057" ON "activity_attachments" ("attachment_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "answers" ADD CONSTRAINT "FK_677120094cf6d3f12df0b9dc5d3" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "answers" ADD CONSTRAINT "FK_69d2197f718d7f7a1eaa5bd1689" FOREIGN KEY ("child_id") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "pages" ADD CONSTRAINT "FK_ce9ee271b6175dc3a7054c24d04" FOREIGN KEY ("storyId") REFERENCES "stories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "pages" ADD CONSTRAINT "FK_728bb0515ad770a59423d06b02c" FOREIGN KEY ("attachmentId") REFERENCES "attachments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "guardians" ADD CONSTRAINT "FK_f1d05a3a2d70db0a25479b67189" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "children" ADD CONSTRAINT "FK_f741b1a9933dc969a799244d2cd" FOREIGN KEY ("attachmentId") REFERENCES "attachments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "assigned_activities" ADD CONSTRAINT "FK_27003e4b5567227db761bfa4c17" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "assigned_activities" ADD CONSTRAINT "FK_acab0079201c0e887cb80f54e76" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "activities" ADD CONSTRAINT "FK_2c422ca78ada683bda25207b0ac" FOREIGN KEY ("questionnaireId") REFERENCES "questionnaires"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionnaires_children" ADD CONSTRAINT "FK_cd4541ef24613879598ce07044f" FOREIGN KEY ("questionnaire_id") REFERENCES "questionnaires"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionnaires_children" ADD CONSTRAINT "FK_4cf9e19f82d8f93f10a665ed055" FOREIGN KEY ("child_id") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionnaires_questions" ADD CONSTRAINT "FK_f7de44ab6ab819e296fe23854d3" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionnaires_questions" ADD CONSTRAINT "FK_b2fae70567c00c443064b49aafa" FOREIGN KEY ("questionnaire_id") REFERENCES "questionnaires"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "guardians_children" ADD CONSTRAINT "FK_fc7ae31d1513aac2d7365d44382" FOREIGN KEY ("guardian_id") REFERENCES "guardians"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "guardians_children" ADD CONSTRAINT "FK_5c461c3df282e7cb570edcd5b5f" FOREIGN KEY ("child_id") REFERENCES "children"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "activity_attachments" ADD CONSTRAINT "FK_34ce3a9fd0057c64fd053f5bd9c" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "activity_attachments" ADD CONSTRAINT "FK_5cda77f460ddfdb8221ea9f0577" FOREIGN KEY ("attachment_id") REFERENCES "attachments"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "activity_attachments" DROP CONSTRAINT "FK_5cda77f460ddfdb8221ea9f0577"`,
    );
    await queryRunner.query(
      `ALTER TABLE "activity_attachments" DROP CONSTRAINT "FK_34ce3a9fd0057c64fd053f5bd9c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guardians_children" DROP CONSTRAINT "FK_5c461c3df282e7cb570edcd5b5f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guardians_children" DROP CONSTRAINT "FK_fc7ae31d1513aac2d7365d44382"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionnaires_questions" DROP CONSTRAINT "FK_b2fae70567c00c443064b49aafa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionnaires_questions" DROP CONSTRAINT "FK_f7de44ab6ab819e296fe23854d3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionnaires_children" DROP CONSTRAINT "FK_4cf9e19f82d8f93f10a665ed055"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionnaires_children" DROP CONSTRAINT "FK_cd4541ef24613879598ce07044f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "activities" DROP CONSTRAINT "FK_2c422ca78ada683bda25207b0ac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "assigned_activities" DROP CONSTRAINT "FK_acab0079201c0e887cb80f54e76"`,
    );
    await queryRunner.query(
      `ALTER TABLE "assigned_activities" DROP CONSTRAINT "FK_27003e4b5567227db761bfa4c17"`,
    );
    await queryRunner.query(
      `ALTER TABLE "children" DROP CONSTRAINT "FK_f741b1a9933dc969a799244d2cd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guardians" DROP CONSTRAINT "FK_f1d05a3a2d70db0a25479b67189"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pages" DROP CONSTRAINT "FK_728bb0515ad770a59423d06b02c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pages" DROP CONSTRAINT "FK_ce9ee271b6175dc3a7054c24d04"`,
    );
    await queryRunner.query(
      `ALTER TABLE "answers" DROP CONSTRAINT "FK_69d2197f718d7f7a1eaa5bd1689"`,
    );
    await queryRunner.query(
      `ALTER TABLE "answers" DROP CONSTRAINT "FK_677120094cf6d3f12df0b9dc5d3"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5cda77f460ddfdb8221ea9f057"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_34ce3a9fd0057c64fd053f5bd9"`,
    );
    await queryRunner.query(`DROP TABLE "activity_attachments"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5c461c3df282e7cb570edcd5b5"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fc7ae31d1513aac2d7365d4438"`,
    );
    await queryRunner.query(`DROP TABLE "guardians_children"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b2fae70567c00c443064b49aaf"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f7de44ab6ab819e296fe23854d"`,
    );
    await queryRunner.query(`DROP TABLE "questionnaires_questions"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4cf9e19f82d8f93f10a665ed05"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cd4541ef24613879598ce07044"`,
    );
    await queryRunner.query(`DROP TABLE "questionnaires_children"`);
    await queryRunner.query(`DROP TABLE "contacts"`);
    await queryRunner.query(`DROP TABLE "audits"`);
    await queryRunner.query(`DROP TABLE "dashboards"`);
    await queryRunner.query(
      `DROP TYPE "public"."dashboards_highlight_category_enum"`,
    );
    await queryRunner.query(`DROP TABLE "activities"`);
    await queryRunner.query(
      `DROP TYPE "public"."activities_classification_month_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."activities_category_enum"`);
    await queryRunner.query(`DROP TABLE "assigned_activities"`);
    await queryRunner.query(
      `DROP TYPE "public"."assigned_activities_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "children"`);
    await queryRunner.query(
      `DROP TYPE "public"."children_connection_to_child_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."children_neurodivergent_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."children_grade_enum"`);
    await queryRunner.query(`DROP TYPE "public"."children_sex_enum"`);
    await queryRunner.query(`DROP TABLE "guardians"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "attachments"`);
    await queryRunner.query(
      `DROP TYPE "public"."attachments_attachment_type_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."attachments_storage_drive_enum"`,
    );
    await queryRunner.query(`DROP TABLE "pages"`);
    await queryRunner.query(`DROP TABLE "stories"`);
    await queryRunner.query(`DROP TABLE "answers"`);
    await queryRunner.query(`DROP TYPE "public"."answer_reference_type_enum"`);
    await queryRunner.query(`DROP TABLE "questions"`);
    await queryRunner.query(`DROP TYPE "public"."questions_category_enum"`);
    await queryRunner.query(`DROP TYPE "public"."questions_type_enum"`);
    await queryRunner.query(`DROP TABLE "questionnaires"`);
    await queryRunner.query(
      `DROP TYPE "public"."questionnaires_classification_month_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."questionnaires_type_enum"`);
  }
}
