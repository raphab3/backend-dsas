import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateAttendanceSignatureTable1720000000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'attendance_signatures',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'attendance_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'certificate_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'page',
            type: 'integer',
            default: 0,
          },
          {
            name: 'position_x',
            type: 'float',
            default: 0,
          },
          {
            name: 'position_y',
            type: 'float',
            default: 0,
          },
          {
            name: 'reason',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'signature_data',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['valid', 'invalid', 'revoked'],
            default: "'valid'",
          },
          {
            name: 's3_location',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'signed_at',
            type: 'timestamp with time zone',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp with time zone',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp with time zone',
            default: 'now()',
          },
        ],
      }),
    );

    // Add foreign keys
    await queryRunner.createForeignKey(
      'attendance_signatures',
      new TableForeignKey({
        columnNames: ['attendance_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'attendances',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'attendance_signatures',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'attendance_signatures',
      new TableForeignKey({
        columnNames: ['certificate_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'certificates',
        onDelete: 'CASCADE',
      }),
    );

    // Create indexes
    await queryRunner.query(
      'CREATE INDEX "IDX_ATTENDANCE_SIGNATURES_ATTENDANCE_ID" ON "attendance_signatures" ("attendance_id")',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_ATTENDANCE_SIGNATURES_USER_ID" ON "attendance_signatures" ("user_id")',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_ATTENDANCE_SIGNATURES_CERTIFICATE_ID" ON "attendance_signatures" ("certificate_id")',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('attendance_signatures');
  }
}
