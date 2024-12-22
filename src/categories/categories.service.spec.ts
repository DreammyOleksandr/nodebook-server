import { Test, TestingModule } from '@nestjs/testing'
import { CategoriesService } from './categories.service'
import { getModelToken } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Category } from './models/category.model'
import { BadRequestException, NotFoundException } from '@nestjs/common'

const mockCategory = {
  _id: '507f1f77bcf86cd799439011',
  name: 'Test Category',
}

const mockCategoryModel = {
  new: jest.fn().mockImplementation(() => ({
    save: jest.fn().mockResolvedValue(mockCategory),
  })),
  find: jest.fn().mockResolvedValue([mockCategory]),
  findById: jest.fn().mockResolvedValue(mockCategory),
  findByIdAndUpdate: jest.fn().mockResolvedValue(mockCategory),
  findByIdAndDelete: jest.fn().mockResolvedValue(mockCategory),
  create: jest.fn().mockResolvedValue(mockCategory),
}

describe('CategoriesService', () => {
  let service: CategoriesService
  let model: Model<Category>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getModelToken('category'),
          useValue: mockCategoryModel,
        },
      ],
    }).compile()

    service = module.get<CategoriesService>(CategoriesService)
    model = module.get<Model<Category>>(getModelToken('category'))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findAll', () => {
    it('should return all categories', async () => {
      jest.spyOn(model, 'find').mockResolvedValueOnce([mockCategory])
      const result = await service.findAll()
      expect(result).toEqual([mockCategory])
    })
  })

  describe('findOne', () => {
    it('should return a category if it exists', async () => {
      jest.spyOn(model, 'findById').mockResolvedValueOnce(mockCategory)
      const result = await service.findOne(mockCategory._id)
      expect(result).toEqual(mockCategory)
    })

    it('should throw NotFoundException if category does not exist', async () => {
      jest.spyOn(model, 'findById').mockResolvedValueOnce(null)
      await expect(service.findOne(mockCategory._id)).rejects.toThrow(
        NotFoundException,
      )
    })

    it('should throw BadRequestException for invalid ID format', async () => {
      await expect(service.findOne('invalid-id')).rejects.toThrow(
        BadRequestException,
      )
    })
  })

  describe('update', () => {
    it('should update a category if it exists', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValueOnce(mockCategory)
      const result = await service.update(mockCategory._id, {
        name: 'Updated Category',
      })
      expect(result).toEqual(mockCategory)
    })

    it('should throw NotFoundException if category does not exist', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValueOnce(null)
      await expect(
        service.update(mockCategory._id, { name: 'Updated Category' }),
      ).rejects.toThrow(NotFoundException)
    })
  })

  describe('remove', () => {
    it('should delete a category if it exists', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockResolvedValueOnce(mockCategory)
      const result = await service.remove(mockCategory._id)
      expect(result).toEqual(mockCategory)
    })

    it('should throw NotFoundException if category does not exist', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockResolvedValueOnce(null)
      await expect(service.remove(mockCategory._id)).rejects.toThrow(
        NotFoundException,
      )
    })
  })
})
