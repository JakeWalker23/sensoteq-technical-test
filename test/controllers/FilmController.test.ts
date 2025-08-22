import { describe, it, expect, vi } from 'vitest'
import { listFilmsByCategory } from '../../src/services/filmsService'
import * as filmsModel from '../../src/models/filmsModel'

vi.spyOn(filmsModel, 'findFilmsByCategory').mockResolvedValue([
  { film_id: 1, title: 'Mocked', description: null, rental_rate: 2.99 }
])

describe('listFilmsByCategory', () => {
  it('returns mocked films', async () => {
    const result = await listFilmsByCategory('Action')
    expect(result[0].title).toBe('Mocked')
  })
})