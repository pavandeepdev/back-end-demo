import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePartDto } from './dto/create-part.dto';
import { UpdatePartDto } from './dto/update-part.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Part } from './entities/part.entity';
import { Repository } from 'typeorm';
import { Category } from 'src/category/entities/category.entity';
import { SubCategory } from 'src/sub-category/entities/sub-category.entity';
import { buildSuccessResponse } from 'src/utils/common-functions';
import { MESSAGE } from './data/message';

@Injectable()
export class PartsService {
  constructor(
    @InjectRepository(Part)
    private readonly partRepository: Repository<Part>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(SubCategory)
    private readonly subCategoryRepository: Repository<SubCategory>,
  ) {}
  async create(createPartDto: CreatePartDto) {
    const { category_id, sub_category_id } = createPartDto;
    const isCategoryValid = await this.categoryRepository.findOne({
      where: {
        id: category_id,
      },
    });
    if (!isCategoryValid) {
      throw new HttpException('Category Id is not valid', HttpStatus.NOT_FOUND);
    }
    const isSubCategoryValid = await this.subCategoryRepository.findOne({
      where: {
        id: sub_category_id,
      },
    });
    if (!isSubCategoryValid) {
      throw new HttpException(
        'Sub Category Id is not valid',
        HttpStatus.NOT_FOUND,
      );
    }
    const part = this.partRepository.create({
      name: createPartDto.name,
      category: isCategoryValid,
      subCategory: isSubCategoryValid,
    });
    const response = await this.partRepository.save(part);
    return buildSuccessResponse(response, MESSAGE.PART_CREATED);
  }

  async findAll() {
    const parts = await this.partRepository.find({
      relations: ['category', 'subCategory'],
      select: {
        id: true,
        name: true,
        category: {
          id: true,
          name: true,
        },
        subCategory: {
          id: true,
          name: true,
        },
      },
    });
    return buildSuccessResponse(parts, MESSAGE.PARTS_FETCHED);
  }

  async findOne(id: string) {
    const part = await this.partRepository.findOne({
      where: {
        id,
      },
      relations: ['category', 'subCategory'],
      select: {
        id: true,
        name: true,
        category: {
          id: true,
          name: true,
        },
        subCategory: {
          id: true,
          name: true,
        },
      },
    });
    if (!part) {
      throw new HttpException('Part not found', HttpStatus.NOT_FOUND);
    }
    return buildSuccessResponse(part, MESSAGE.PARTS_FETCHED);
  }

  async update(id: string, updatePartDto: UpdatePartDto) {
    const isPartValid = await this.partRepository.findOne({
      where: {
        id,
      },
    });
    if (!isPartValid) {
      throw new HttpException('Part Id is not valid', HttpStatus.NOT_FOUND);
    }
    const part = await this.partRepository.update(id, {
      name: updatePartDto.name,
      category: {
        id: updatePartDto.category_id,
      },
      subCategory: {
        id: updatePartDto.sub_category_id,
      },
    });
    if (part.affected === 0) {
      throw new HttpException('Part not updated', HttpStatus.BAD_REQUEST);
    }
    const response = await this.partRepository.findOne({
      where: {
        id,
      },
      relations: ['category', 'subCategory'],
      select: {
        id: true,
        name: true,
        category: {
          id: true,
          name: true,
        },
        subCategory: {
          id: true,
          name: true,
        },
      },
    });

    return buildSuccessResponse(response, MESSAGE.PART_UPDATED);
  }

  async remove(id: string) {
    const isValidPart = await this.partRepository.findOne({
      where: {
        id,
      },
    });
    if (!isValidPart) {
      throw new HttpException('Part Id is not valid', HttpStatus.NOT_FOUND);
    }
    const part = await this.partRepository.delete(id);
    if (part.affected === 0) {
      throw new HttpException('Part not deleted', HttpStatus.BAD_REQUEST);
    }
    return buildSuccessResponse([], MESSAGE.PART_DELETED);
  }
}
