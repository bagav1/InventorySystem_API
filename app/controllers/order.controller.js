const { tOrder, tProduct } = require('../models/db')
const { Op } = require('sequelize')
const jwt = require('jsonwebtoken')

/**
 * It creates an order if the order doesn't exist, or updates the order if it does exist.
 * @param req - request
 * @param res - response
 * @returns The order object
 */
const create = async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers.authorization, 'Secret')
    req.body.user_id = decoded.id
    /* Checking if the order exists. */
    const orderExist = await tOrder.findOne({ where: { product_id: req.body.product_id, user_id: req.body.user_id, status: 'inProcess' } })
    if (orderExist !== null) {
      /* Checking if the product exists and if the quantity is greater than or equal to the quantity
      requested. */
      const product = await tProduct.findOne({ where: { id: req.body.product_id, available_quantity: { [Op.gte]: req.body.quantity } } })
      if (!product) return res.json({ error: 'Insufficient inventory' })
      /* Updating the product's available quantity. */
      product.update({ available_quantity: product.available_quantity - req.body.quantity })
      req.body.total = Number(product.price * req.body.quantity)
      /* Updating the order's quantity and total. */
      orderExist.update({ quantity: orderExist.quantity + req.body.quantity, total: (Number(orderExist.total) + (product.price * req.body.quantity)) })
      return res.json({ data: orderExist })
    } else {
      req.body.status = 'inProcess'
      /* Checking if the product exists and if the quantity is greater than or equal to the quantity
      requested. */
      const product = await tProduct.findOne({ where: { id: req.body.product_id, available_quantity: { [Op.gte]: req.body.quantity } } })
      if (!product) return res.json({ error: 'Insufficient inventory' })
      /* Updating the product's available quantity. */
      product.update({ available_quantity: product.available_quantity - req.body.quantity })
      req.body.total = Number(product.price * req.body.quantity)
      /* Creating an order. */
      const order = await tOrder.create(req.body)
      return res.json({ data: order })
    }
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

/**
 * It gets the cart of the user who is logged in.
 * @param req - the request object
 * @param res - the response object
 * @returns An array of objects.
 */
const getCart = async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers.authorization, 'Secret')
    /* Getting all the orders that are in process. */
    const orders = await tOrder.findAll({ where: { user_id: decoded.id, status: 'inProcess' } })
    return res.json({ data: orders })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

/**
 * It gets the user's id from the token, then finds all the orders with that user_id and status
 * 'conclude' and returns them.
 * @param req - the request object
 * @param res - the response object
 * @returns An array of objects.
 */
const getHistoric = async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers.authorization, 'Secret')
    /* Getting all the orders that have the user_id and status 'conclude'. */
    const orders = await tOrder.findAll({ where: { user_id: decoded.id, status: 'conclude' } })
    return res.json({ data: orders })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

module.exports = {
  create,
  getCart,
  getHistoric
}
