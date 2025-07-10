import { Category } from 'src/category/entities/category.entity';
import { SubCategory } from 'src/sub-category/entities/sub-category.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('parts')
export class Part {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @ManyToOne(() => Category, (category) => category.parts)
  category: Category;

  @ManyToOne(() => SubCategory, (subCategory) => subCategory.parts)
  subCategory: SubCategory;
}
