import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../../src/models/FilmsModel.js', () => ({
  findFilmsByCategory: vi.fn(),
}))

const { findFilmsByCategory } = await import('../../../src/models/FilmsModel.js')
const { listFilmsByCategory } = await import('../../../src/services/FilmsService.js')

describe('Films Service', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should throw an error on empty category name', async () => {
    await expect(listFilmsByCategory('')).rejects.toThrow('category_name is required')
    expect(findFilmsByCategory).not.toHaveBeenCalled()
  })

  it('should throw an error when no category name is given', async () => {
    await expect(listFilmsByCategory('   ')).rejects.toThrow('category_name is required')
    expect(findFilmsByCategory).not.toHaveBeenCalled()
  })
})