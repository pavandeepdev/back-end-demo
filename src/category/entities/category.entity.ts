import { Part } from 'src/parts/entities/part.entity';
import { SubCategory } from 'src/sub-category/entities/sub-category.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => SubCategory, (sub_category) => sub_category.category)
  sub_categories: SubCategory[];

  @OneToMany(() => Part, (part) => part.category)
  parts: Part[];
}
