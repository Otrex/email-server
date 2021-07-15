import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1626355139343 implements MigrationInterface {
  name = 'init1626355139343';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `_email_server_template` (`id` varchar(36) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, `key` varchar(255) NOT NULL, `from` varchar(255) NULL, `senderName` varchar(255) NULL, `subject` varchar(255) NULL, `content` longtext NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `_email_server_template`');
  }
}
