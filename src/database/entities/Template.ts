import { Entity, Column } from 'typeorm';
import { GenericEntity } from './generic';

@Entity('email_template')
export default class Template extends GenericEntity {
  @Column()
  name!: string;

  @Column({ nullable: true })
  from!: string;

  @Column({ nullable: true })
  senderName!: string;

  @Column({ nullable: true })
  subject!: string;

  @Column({ type: 'longtext', nullable: true })
  content!: string;

  @Column()
  slug!: string;
}
