import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/models/FilmsModel.js', () => ({
  findFilmsByCategory: vi.fn(),
}))

const { findFilmsByCategory } = await import('../../src/models/FilmsModel.js')
const { listFilmsByCategory } = await import('../../src/services/FilmsService.js')

describe('Films Service', () => {
  beforeEach(() => vi.clearAllMocks())

  // it('should trims and delegates to model', async () => {
  //   const sample = [{ film_id: 1 }]
  //   ;(findFilmsByCategory as any).mockResolvedValue(sample)

  //   const out = await listFilmsByCategory('  Action  ')

  //   expect(findFilmsByCategory).toHaveBeenCalledWith('Action')
  //   expect(out).toEqual(sample)
  // })

  it('should throw an error on empty category name', async () => {
    await expect(listFilmsByCategory('')).rejects.toThrow('category_name is required')
    expect(findFilmsByCategory).not.toHaveBeenCalled()
  })

  it('should throw an error when no category name is given', async () => {
    await expect(listFilmsByCategory('   ')).rejects.toThrow('category_name is required')
    expect(findFilmsByCategory).not.toHaveBeenCalled()
  })
})
