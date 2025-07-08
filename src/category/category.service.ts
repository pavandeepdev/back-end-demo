import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { buildSuccessResponse } from 'src/utils/common-functions';
import MESSAGE from 'src/utils/message';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const { name } = createCategoryDto;
    const isCategoryExist = await this.categoryRepository.findOne({
      where: { name },
    });
    if (isCategoryExist) {
      throw new BadRequestException(MESSAGE.CATEGORY_EXISTS);
    }
    const category = this.categoryRepository.create(createCategoryDto);
    const categoryResponse = await this.categoryRepository.save(category);
    return buildSuccessResponse(categoryResponse, MESSAGE.CATEGORY_CREATED);
  }

  async findAll() {
    const categories = await this.categoryRepository.find({
      select: ['id', 'name'],
    });

    if (!categories) {
      throw new BadRequestException(MESSAGE.CATEGORY_NOT_FOUND);
    }

    return buildSuccessResponse(categories, MESSAGE.CATEGORY_FETCHED);
  }

  async findOne(id: string) {
    if (!id) {
      throw new BadRequestException(MESSAGE.CATEGORY_NOT_FOUND);
    }
    const category = await this.categoryRepository.findOne({
      where: { id },
    });
    return buildSuccessResponse(category, MESSAGE.CATEGORY_FETCHED);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    if (!id) {
      throw new BadRequestException(MESSAGE.CATEGORY_NOT_FOUND);
    }
    const isCategoryExist = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!isCategoryExist) {
      throw new BadRequestException(MESSAGE.CATEGORY_NOT_FOUND);
    }
    const response = await this.categoryRepository.update(
      { id },
      updateCategoryDto,
    );

    return buildSuccessResponse(response, MESSAGE.CATEGORY_UPDATED);
  }

  async remove(id: string) {
    const isCategoryExist = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!isCategoryExist) {
      throw new BadRequestException(MESSAGE.CATEGORY_NOT_FOUND);
    }
    const response = await this.categoryRepository.delete(id);
    if (!response) {
      throw new BadRequestException(MESSAGE.CATEGORY_NOT_FOUND);
    }
    return buildSuccessResponse(null, MESSAGE.CATEGORY_DELETED);
  }
}
