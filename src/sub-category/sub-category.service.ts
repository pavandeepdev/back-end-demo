import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/category/entities/category.entity';
import { buildSuccessResponse } from 'src/utils/common-functions';
import MESSAGES from 'src/utils/message';
import { Repository } from 'typeorm';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { SubCategory } from './entities/sub-category.entity';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectRepository(SubCategory)
    private readonly subCategoryRepository: Repository<SubCategory>,
    @InjectRepository(Category)
    private readonly category: Repository<Category>,
  ) {}
  async create(createSubCategoryDto: CreateSubCategoryDto) {
    const { category_id } = createSubCategoryDto;
    const isExist = await this.category.findOne({
      where: { id: category_id },
    });
    console.log('isExist', isExist);
    if (!isExist) {
      throw new NotFoundException(MESSAGES.CATEGORY_NOT_FOUND);
    }
    const subCategory = this.subCategoryRepository.create(createSubCategoryDto);
    const subCategoryData = await this.subCategoryRepository.save(subCategory);
    return buildSuccessResponse(
      subCategoryData,
      MESSAGES.SUB_CATEGORY_CREATED,
      HttpStatus.CREATED,
    );
  }

  async findAll() {
    const subCategories = await this.subCategoryRepository.find({
      relations: ['category_id'],
    });

    if (!subCategories) {
      throw new NotFoundException(MESSAGES.SUB_CATEGORY_NOT_FOUND);
    }

    const response = subCategories.map((subCategory) => ({
      id: subCategory.id,
      name: subCategory.name,
      category: subCategory.category_id,
    }));

    return buildSuccessResponse(
      response,
      MESSAGES.SUB_CATEGORY_FETCHED,
      HttpStatus.OK,
    );
  }

  async findOne(id: string) {
    const subCategory = await this.subCategoryRepository.findOne({
      where: { id },
    });
    if (!subCategory) {
      throw new NotFoundException(MESSAGES.SUB_CATEGORY_NOT_FOUND);
    }
  }

  async update(id: string, updateSubCategoryDto: UpdateSubCategoryDto) {
    const isExist = await this.subCategoryRepository.findOne({
      where: { id },
    });
    if (!isExist) {
      throw new NotFoundException(MESSAGES.SUB_CATEGORY_NOT_FOUND);
    }

    const subCategory = this.subCategoryRepository.create(updateSubCategoryDto);
    await this.subCategoryRepository.update(id, subCategory);
    return buildSuccessResponse(
      subCategory,
      MESSAGES.SUB_CATEGORY_UPDATED,
      HttpStatus.OK,
    );
  }

  async remove(id: string) {
    const isExist = await this.subCategoryRepository.findOne({
      where: { id },
    });
    if (!isExist) {
      throw new NotFoundException(MESSAGES.SUB_CATEGORY_NOT_FOUND);
    }
    await this.subCategoryRepository.delete(id);
    return buildSuccessResponse(
      null,
      MESSAGES.SUB_CATEGORY_DELETED,
      HttpStatus.OK,
    );
  }
}
