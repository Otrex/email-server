import { Entity, Column } from 'typeorm';
import GenericEntity from './generic';

@Entity()
export default class Template extends GenericEntity {
  @Column()
  name!: string;

  @Column()
  key!: string;

  @Column({ nullable: true })
  from!: string;

  @Column({ nullable: true })
  senderName!: string;

  @Column({ nullable: true })
  subject!: string;

  @Column({ type: 'longtext', nullable: true })
  content!: string;
}
