import type { Request, Response, NextFunction } from 'express'
import { gdprDeleteCustomer, createCustomerWithAddress } from '../services/CustomerService.js'
import { HTTPError } from '../utils/Errors.js'

import { CreateCustomerSchema } from '../validators/Customer.js';

export async function deleteCustomer(req: Request, res: Response, next: NextFunction) {
  try {
    const idStr = req.params.customer_id
    const customer_id = Number(idStr)
    if (!Number.isInteger(customer_id) || customer_id <= 0) {
      return res.status(400).json({ error: 'Invalid customer_id' })
    }

    const result = await gdprDeleteCustomer(customer_id)
    // choose 204 if you want silence; 200 is nice for demo
    return res.status(200).json(result)
  } catch (e: any) {
    if (e instanceof HTTPError) {
      return res.status(e.status).json({ error: e.message })
    }
    return next(e)
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
