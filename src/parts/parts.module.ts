import { Module } from '@nestjs/common';
import { PartsService } from './parts.service';
import { PartsController } from './parts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Part } from './entities/part.entity';
import { Category } from 'src/category/entities/category.entity';
import { SubCategory } from 'src/sub-category/entities/sub-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Part, Category, SubCategory])],
  controllers: [PartsController],
  providers: [PartsService],
})
export class PartsModule {}
