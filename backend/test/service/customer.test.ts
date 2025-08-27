import { describe, it, expect } from 'vitest'

const BASE = process.env.SERVICE_BASE || 'http://localhost:5000'

describe('Customer Service Service Test Suite', () => {
  it('should return HTTP 201 status and create a customer in DB', async () => {
    const email = `svc.${Date.now()}@example.com`
    const payload = {
      store_id: 1,
      first_name: 'Temp',
      last_name: 'User',
      email,
      phone: '0123456789',
      address: '1 Test St',
      district: 'Antrim',
      city_id: 1
    }

    const res = await fetch(`${BASE}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    expect(res.status).toBe(201)
    const body = await res.json()
    
    expect(typeof body?.customer?.customer_id).toBe('number')
    expect(typeof body?.address?.address_id).toBe('number')
    expect(body.customer.email).toBe(email)
    expect(body.customer.activebool).toBe(true)
  })

  it('should return HTTP 400 status when body is invalid)', async () => {
    const res = await fetch(`${BASE}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        store_id: 1,
        email: 'invalid@example.com',
      }),
    })
    expect(res.status).toBe(400)
  })

  it('should return HTTP 400 status body contains invalid store_id', async () => {
    const badStore = await fetch(`${BASE}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        store_id: 999999,
        first_name: 'X',
        last_name: 'Y',
        email: `bad.store.${Date.now()}@example.com`,
        phone: '000',
        address: 'Nowhere',
        district: 'Nowhere',
        city_id: 1,
      }),
    })
    expect(badStore.status).toBe(400)

    const badCity = await fetch(`${BASE}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        store_id: 1,
        first_name: 'X',
        last_name: 'Y',
        email: `bad.city.${Date.now()}@example.com`,
        phone: '000',
        address: 'Nowhere',
        district: 'Nowhere',
        city_id: 999999,
      }),
    })
    expect(badCity.status).toBe(400)
  })
})

async function createTempCustomer() {
  const email = `del.${Date.now()}@example.com`
  const payload = {
    store_id: 1,
    first_name: 'Del',
    last_name: 'Me',
    email,
    phone: '0123456789',
    address: '9 Delete Rd',
    district: 'Antrim',
    city_id: 1
  }
  const res = await fetch(`${BASE}/customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (res.status !== 201) {
    throw new Error(`Failed to create temp customer: ${res.status}`)
  }
  const body = await res.json()
  return body.customer.customer_id as number
}

describe('DELETE /customers/:id', () => {
  it('200/204: deletes an existing customer; second delete -> 404', async () => {
    const id = await createTempCustomer()

    const res1 = await fetch(`${BASE}/customers/${id}`, { method: 'DELETE' })
    expect([200, 204]).toContain(res1.status)
    if (res1.status === 200) {
      const body = await res1.json().catch(() => null)
  
      if (body && typeof body.deleted_customer_id === 'number') {
        expect(body.deleted_customer_id).toBe(id)
      }
    }

    const res2 = await fetch(`${BASE}/customers/${id}`, { method: 'DELETE' })
    expect(res2.status).toBe(404)
  })

  it('should return HTTP 404 status when customer ID not found', async () => {
    const res = await fetch(`${BASE}/customers/999999999`, { method: 'DELETE' })
    expect(res.status).toBe(404)
  })
})
