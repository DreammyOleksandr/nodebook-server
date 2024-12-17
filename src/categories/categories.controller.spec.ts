import { Test, TestingModule } from '@nestjs/testing'
import { CategoriesController } from './categories.controller'
import { CategoriesService } from './categories.service'
import { NotFoundException, BadRequestException } from '@nestjs/common'
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from 'src/requests/categories.requests'

const mockCategory = {
  _id: '507f1f77bcf86cd799439011',
  name: 'Test Category',
  description: 'A sample description',
}

const mockCategoriesService = {
  create: jest.fn().mockResolvedValue(mockCategory),
  findAll: jest.fn().mockResolvedValue([mockCategory]),
  findOne: jest.fn().mockResolvedValue(mockCategory),
  findByName: jest.fn().mockResolvedValue([mockCategory]),
  update: jest.fn().mockResolvedValue(mockCategory),
  remove: jest.fn().mockResolvedValue(mockCategory),
}

describe('CategoriesController', () => {
  let controller: CategoriesController
  let service: CategoriesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
      ],
    }).compile()

    controller = module.get<CategoriesController>(CategoriesController)
    service = module.get<CategoriesService>(CategoriesService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('create', () => {
    it('should successfully create a category', async () => {
      const createCategoryRequest: CreateCategoryRequest = {
        name: 'New Category',
      }

      const result = await controller.create(createCategoryRequest)
      expect(result).toEqual(mockCategory)
      expect(service.create).toHaveBeenCalledWith(createCategoryRequest)
    })
  })

  describe('findAll', () => {
    it('should return all categories', async () => {
      const result = await controller.findAll()
      expect(result).toEqual([mockCategory])
      expect(service.findAll).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should return a category by id', async () => {
      const result = await controller.findOne(mockCategory._id)
      expect(result).toEqual(mockCategory)
      expect(service.findOne).toHaveBeenCalledWith(mockCategory._id)
    })

    it('should throw NotFoundException if category not found', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValueOnce(new NotFoundException())
      try {
        await controller.findOne('invalid_id')
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException)
      }
    })

    it('should throw BadRequestException if ID is invalid', async () => {
      try {
        await controller.findOne('invalid_id_format')
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException)
      }
    })
  })

  describe('findByName', () => {
    it('should return categories by name', async () => {
      const result = await controller.findByName('Test')
      expect(result).toEqual([mockCategory])
      expect(service.findByName).toHaveBeenCalledWith('Test')
    })
  })

  describe('update', () => {
    it('should successfully update a category by id', async () => {
      const updateCategoryRequest: UpdateCategoryRequest = {
        name: 'Updated Category',
      }

      const result = await controller.update(
        mockCategory._id,
        updateCategoryRequest,
      )
      expect(result).toEqual(mockCategory)
      expect(service.update).toHaveBeenCalledWith(
        mockCategory._id,
        updateCategoryRequest,
      )
    })

    it('should throw NotFoundException if category to update does not exist', async () => {
      jest
        .spyOn(service, 'update')
        .mockRejectedValueOnce(new NotFoundException())
      try {
        await controller.update('invalid_id', {})
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException)
      }
    })

    it('should throw BadRequestException if ID is invalid', async () => {
      try {
        await controller.update('invalid_id_format', {})
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException)
      }
    })
  })

  describe('remove', () => {
    it('should successfully delete a category by id', async () => {
      const result = await controller.remove(mockCategory._id)
      expect(result).toEqual(mockCategory)
      expect(service.remove).toHaveBeenCalledWith(mockCategory._id)
    })

    it('should throw NotFoundException if category to delete does not exist', async () => {
      jest
        .spyOn(service, 'remove')
        .mockRejectedValueOnce(new NotFoundException())
      try {
        await controller.remove('invalid_id')
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException)
      }
    })

    it('should throw BadRequestException if ID is invalid', async () => {
      try {
        await controller.remove('invalid_id_format')
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException)
      }
    })
  })
})
