import { describe, it, expect, vi } from 'vitest'
import { listFilmsByCategory, deleteFilmById } from '../../src/services/FilmsService'
import * as FilmsModel from '../../src/models/FilmsModel.js'

vi.spyOn(FilmsModel, 'findFilmsByCategory').mockResolvedValue([
  { film_id: 1, title: 'Mocked', description: null, rental_rate: 2.99 }
])

describe('listFilmsByCategory', () => {
  it('returns mocked films', async () => {
    const result = await listFilmsByCategory('Action')
    
    expect(result[0].title).toBe('Mocked')
  })
})

describe('deleteFilmById', () => {
  it('returns true when a film is deleted', async () => {
    vi.spyOn(FilmsModel, 'removeFilm').mockResolvedValue(1)
    
    const result = await deleteFilmById(123)
    
    expect(result).toBe(true)
  })

  it('returns false when no film is deleted', async () => {
    vi.spyOn(FilmsModel, 'removeFilm').mockResolvedValue(0)
    
    const result = await deleteFilmById(999)
    
    expect(result).toBe(false)
  })
})