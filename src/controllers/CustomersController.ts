import type { Request, Response, NextFunction } from 'express'
import { removeCustomerGdpr, createCustomerWithAddress } from '../services/CustomerService.js'
import { HTTPError } from '../utils/Errors.js'

import { CreateCustomerSchema } from '../validators/Customer.js';

export async function deleteCustomer(req: Request, res: Response) {
  const idRaw = req.params.customer_id ?? req.params.id ?? req.query.customer_id
  const customerId = Number(idRaw)

  if (!Number.isInteger(customerId) || customerId <= 0) {
    return res.status(400).json({ error: 'Invalid customer_id' })
  }

  try {
    const ok = await removeCustomerGdpr(customerId)
    if (!ok) return res.status(404).json({ error: 'Customer not found' })
    return res.status(200).json({ success: true })
  } catch (err: any) {
    if (err?.code === 'CONFIG') {
      return res.status(500).json({ error: err.message })
    }
    // Any remaining FK errors mean detach didn’t complete for some reason
    if (err?.code === '23503') {
      return res
        .status(409)
        .json({ error: 'Customer cannot be deleted due to related records.' })
    }
    console.error('DELETE /customers/:customer_id failed:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function postCreateCustomer(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = CreateCustomerSchema.parse(req.body);
    const result = await createCustomerWithAddress(payload);

    return res.status(201).json({
      customer: result,
      address: { address_id: result.address_id }
    });
  } catch (e: any) {
    if (e.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid payload', details: e.errors });
    }
    if (e instanceof HTTPError) {
      return res.status(e.status).json({ error: e.message });
    }
    return next(e);
  }
}
