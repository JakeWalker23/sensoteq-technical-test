import { describe, it, expect } from 'vitest'

const BASE = process.env.SERVICE_BASE || 'http://localhost:5000'

describe('Films Service Service Tests', () => {  
  it('should return results with category action returns an array for Action', async () => {
    const res = await fetch(`${BASE}/films?category_name=Action`)
    expect(res.ok).toBe(true)
    
    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
    
    if (data.length) {
      expect(typeof data[0].film_id).toBe('number')
      expect(typeof data[0].title).toBe('string')
      expect(typeof data[0].rental_rate).toBe('number')
    }
  })

  it('should return HTTP 400 status with no query param', async () => {
    const res = await fetch(`${BASE}/films`)
    expect(res.status).toBe(400)
  })

  it('should return HTTP 200 status and empty array when no results from category', async () => {
    const res = await fetch(`${BASE}/films?category_name=none`)
    
    expect(res.status).toBe(200)
    const json = await res.json()
    
    expect(Array.isArray(json)).toBe(true)
    expect(json).toHaveLength(0)
  })

  it('should return HTTP 200 status and checks that works with only length filter (no title)', async () => {
    const res = await fetch(`${BASE}/films/search?length=50&limit=10`)
    expect(res.status).toBe(200)
    
    const { results } = await res.json()
    expect(Array.isArray(results)).toBe(true)
    
    for (const r of results) {
      if (r.length !== null && r.length !== undefined) {
        expect(r.length).toBeLessThanOrEqual(50)
      }
    }
  })

  it('200: limit is respected and count >= results.length', async () => {
    const res = await fetch(`${BASE}/films/search?title=to&limit=3&offset=0`)
    
    expect(res.status).toBe(200)
    const { count, results } = await res.json()
    
    expect(Array.isArray(results)).toBe(true)
    expect(results.length).toBeLessThanOrEqual(3)
    expect(count).toBeGreaterThanOrEqual(results.length)
  })

  it('200: works with only length filter (no title)', async () => {
    const res = await fetch(`${BASE}/films/search?length=50&limit=10`)
    expect(res.status).toBe(200)
    
    const { results } = await res.json()
    expect(Array.isArray(results)).toBe(true)
    
    for (const result of results) {
      if (result.length !== null && result.length !== undefined) {
        expect(result.length).toBeLessThanOrEqual(50)
      }
    }
  })

  it('200: length upper bound is enforced', async () => {
    const res = await fetch(`${BASE}/films/search?title=to&length=60`)
    expect(res.status).toBe(200)
    const { results } = await res.json()
    expect(Array.isArray(results)).toBe(true)
    for (const r of results) {
      if (r.length !== null && r.length !== undefined) {
        expect(r.length).toBeLessThanOrEqual(60)
      }
    }
  })


})
