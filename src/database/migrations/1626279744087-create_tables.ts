import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTables1626279744087 implements MigrationInterface {
  name = 'createTables1626279744087';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `email_template` CHANGE `from` `from` varchar(255) NULL');
    await queryRunner.query(
      'ALTER TABLE `email_template` CHANGE `senderName` `senderName` varchar(255) NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `email_template` CHANGE `subject` `subject` varchar(255) NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `email_template` CHANGE `content` `content` longtext NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `email_template` CHANGE `content` `content` longtext NULL DEFAULT 'NULL'"
    );
    await queryRunner.query(
      "ALTER TABLE `email_template` CHANGE `subject` `subject` varchar(255) NULL DEFAULT 'NULL'"
    );
    await queryRunner.query(
      "ALTER TABLE `email_template` CHANGE `senderName` `senderName` varchar(255) NULL DEFAULT 'NULL'"
    );
    await queryRunner.query(
      "ALTER TABLE `email_template` CHANGE `from` `from` varchar(255) NULL DEFAULT 'NULL'"
    );
  }
}
