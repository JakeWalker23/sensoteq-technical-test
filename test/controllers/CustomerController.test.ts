import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HTTPError } from '../../src/utils/Errors.js'

const { postCreateCustomer, deleteCustomer } = await import('../../src/controllers/CustomersController.js')
const { createCustomerWithAddress, gdprDeleteCustomer } = await import('../../src/services/CustomerService.js')

vi.mock('../../src/services/CustomerService.js', () => ({
    createCustomerWithAddress: vi.fn(),
    gdprDeleteCustomer: vi.fn(),
  }))

function responseMock() {
  const res: any = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  return res
}

function nextMock() {
  const res: any = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)

  return res
}

const valid = {
  store_id: 1,
  first_name: 'Ada',
  last_name: 'Lovelace',
  email: 'ada@example.com',
  phone: '0123456789',
  address: '123 Algorithm Ave',
  address2: 'Apt 42',
  district: 'Antrim',
  city_id: 1,
  postal_code: 'BT1 1AA',
}

describe('POST /customers (controller)', () => {
  beforeEach(() => vi.clearAllMocks())

  it('201 on success, returns customer + address_id', async () => {
    ;(createCustomerWithAddress as any).mockResolvedValue({
      customer_id: 600,
      address_id: 700,
      store_id: 1,
      first_name: 'Ada',
      last_name: 'Lovelace',
      email: 'ada@example.com',
      activebool: true,
      create_date: new Date('2025-08-25T00:00:00Z').toISOString(),
    })

    const req: any = { body: valid }
    const res = responseMock()

    await postCreateCustomer(req, res, nextMock)

    expect(createCustomerWithAddress).toHaveBeenCalledWith(valid)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({
      customer: expect.objectContaining({ customer_id: 600, store_id: 1 }),
      address: { address_id: 700 },
    })
  })

  it('400 on invalid payload (ZodError)', async () => {
    // omit required field: phone
    const req: any = { body: { ...valid, phone: undefined } }
    const res = responseMock ()

    await postCreateCustomer(req, res, nextMock)

    expect(res.status).toHaveBeenCalledWith(400)
    const payload = res.json.mock.calls[0][0]
    expect(payload).toHaveProperty('error', 'Invalid payload')
    expect(payload).toHaveProperty('details')
  })

  it('maps HTTPError from service', async () => {
    ;(createCustomerWithAddress as any).mockRejectedValue(
      new HTTPError(400, 'store_id 999 does not exist')
    )
    const req: any = { body: valid }
    const res = responseMock()

    await postCreateCustomer(req, res, nextMock)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'store_id 999 does not exist' })
  })
})

describe('DELETE /customers/:customer_id (controller)', () => {
    beforeEach(() => vi.clearAllMocks())

    it('200 on success (returns summary)', async () => {
        ;(gdprDeleteCustomer as any).mockResolvedValue({
        deleted_customer_id: 600,
        reassigned_to: 601,
        rentals_reassigned: 0,
        payments_reassigned: 0,
        address_deleted: true,
        })
        const req: any = { params: { customer_id: '600' } }
        const res = responseMock()

        await deleteCustomer(req, res, nextMock)

        expect(gdprDeleteCustomer).toHaveBeenCalledWith(600)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ deleted_customer_id: 600, reassigned_to: 601 })
        )
    })

    it('400 on invalid path param', async () => {
        const req: any = { params: { customer_id: 'abc' } }
        const res = responseMock()
        
        await deleteCustomer(req, res, nextMock)
        
        expect(gdprDeleteCustomer).not.toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(400)
    })

    it('404 when customer not found', async () => {
        ;(gdprDeleteCustomer as any).mockRejectedValue(new HTTPError(404, 'customer_id 999 not found'))
        const req: any = { params: { customer_id: '999' } }
        const res = responseMock()
        
        await deleteCustomer(req, res, nextMock)
        
        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({ error: 'customer_id 999 not found' })
    })
})