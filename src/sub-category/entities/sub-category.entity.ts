import { Category } from 'src/category/entities/category.entity';
import { Part } from 'src/parts/entities/part.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('sub_categories')
export class SubCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ unique: true })
  name: string;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @ManyToOne(() => Category, (category) => category.sub_categories)
  category: string;
  @OneToMany(() => Part, (part) => part.subCategory)
  parts: Part[];
}
