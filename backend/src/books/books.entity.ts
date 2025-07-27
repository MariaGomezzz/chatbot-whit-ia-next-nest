import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

enum Role {
  USER = 'user',
  MODEL = 'model'
}

@Entity()
export class BooksEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: Role,
  })
  role: string;

  @Column({
    type:'text'
  })
  content: string;

  @CreateDateColumn()
  create_date: Date;
}