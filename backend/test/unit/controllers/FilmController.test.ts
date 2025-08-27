import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../../src/services/FilmsService.js', () => ({
  listFilmsByCategory: vi.fn(),
  searchFilms: vi.fn(),
}))

const { listFilmsByCategory, searchFilms } = await import('../../../src/services/FilmsService.js')
const { getFilmsByCategory } = await import('../../../src/controllers/FilmsController.js')

function mockResponse() {
  const res: any = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  return res
}

describe('Films Controller ', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should return HTTP 200 status and return service data', async () => {
    const sample = [{ film_id: 1, title: 'A', description: null, rental_rate: 2.99 }]
    ;(listFilmsByCategory as any).mockResolvedValue(sample)

    const req: any = { query: { category_name: 'Action' } }
    const res = mockResponse()

    await getFilmsByCategory(req, res)

    expect(listFilmsByCategory).toHaveBeenCalledWith('Action')
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(sample)
    
    expect(searchFilms).not.toHaveBeenCalled()
  })

  it('should return HTTP 400 when category_name missing from query parameter', async () => {
    ;(listFilmsByCategory as any).mockRejectedValue(new Error('category_name is required'))

    const req: any = { query: {} }
    const res = mockResponse()

    await getFilmsByCategory(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'category_name is required' })
  })

  it('should return HTTP 500 on unexpected error and return correct message', async () => {
    ;(listFilmsByCategory as any).mockRejectedValue(new Error('boom'))

    const req: any = { query: { category_name: 'Action' } }
    const res = mockResponse()

    await getFilmsByCategory(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' })
  })
})