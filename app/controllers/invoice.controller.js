const { tInvoice, tOrder, tOrderInvoice, tUser } = require('../models/db')
const jwt = require('jsonwebtoken')

/**
 * It creates an invoice for a user, and updates the status of the orders to 'conclude'
 * @param req - request
 * @param res - the response object
 * @returns An invoice object
 */
const create = async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers.authorization, 'Secret')
    const orders = await tOrder.findAll({ where: { user_id: decoded.id, status: 'inProcess' } })
    if (orders.length === 0) {
      return res.status(400).json({ error: 'No orders in process' })
    }
    const jsonData = {
      quantity: 0,
      total: 0,
      user_id: decoded.id
    }
    /* Iterating over the orders array, and updating the status of each order to 'conclude'. */
    orders.forEach(async (order) => {
      jsonData.quantity += Number(order.quantity)
      jsonData.total += Number(order.total)
      order.update({ status: 'conclude' })
    })
    const invoice = await tInvoice.create(jsonData)
    /* Creating a new orderInvoice for each order. */
    for (let i = 0; i < orders.length; i++) {
      tOrderInvoice.create({ invoice_id: invoice.id, orderId: orders[i].id })
    }
    return res.json({ data: invoice })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

/**
 * It gets all invoices, and includes the order and user models, and excludes the user_id and password
 * attributes.
 * </code>
 * @param req - request
 * @param res - response
 * @returns An array of objects.
 */
const getInvoiceAdmin = async (req, res) => {
  try {
    const invoices = await tInvoice.findAll({ include: [{ model: tOrder, include: ['product'], attributes: { exclude: ['product_id'] } }, { model: tUser, include: ['role'], attributes: { exclude: ['password', 'token'] } }], attributes: { exclude: ['user_id', 'password'] } })
    return res.json({ data: invoices })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

/**
 * It gets all invoices for a user.
 * </code>
 * @param req - request
 * @param res - the response object
 * @returns An array of objects.
 */
const getInvoiceClient = async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers.authorization, 'Secret')
    const invoices = await tInvoice.findAll({ where: { user_id: decoded.id }, include: [{ model: tOrder, include: ['product'], attributes: { exclude: ['product_id'] } }, { model: tUser, include: ['role'], attributes: { exclude: ['password', 'token'] } }], attributes: { exclude: ['user_id', 'password'] } })
    return res.json({ data: invoices })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

/**
 * It gets all invoices from the database where the user_id is equal to the id in the request params,
 * and includes the order and user models, and excludes the user_id and password attributes.
 * </code>
 * @param req - request
 * @param res - response
 * @returns An array of invoices.
 */
const getInvoiceByUser = async (req, res) => {
  try {
    const invoices = await tInvoice.findAll({ where: { user_id: req.params.id }, include: [{ model: tOrder, include: ['product'], attributes: { exclude: ['product_id'] } }, { model: tUser, include: ['role'], attributes: { exclude: ['password', 'token'] } }], attributes: { exclude: ['user_id', 'password'] } })
    return res.json({ data: invoices })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

module.exports = {
  create,
  getInvoiceAdmin,
  getInvoiceClient,
  getInvoiceByUser
}
