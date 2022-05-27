const { tProduct } = require('../models/db')
const { validationResult } = require('express-validator')

/**
 * This function will return all the products from the database.
 * @param req - request
 * @param res - the response object
 */
const getAll = async (req, res) => {
  tProduct.findAll().then(data => {
    return res.json(data)
  })
}

/**
 * It creates a new product and returns the product data in JSON format.
 * @param req - The request object.
 * @param res - the response object
 * @returns The product that was created.
 */
const create = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  tProduct.create(req.body).then(prod => {
    return res.json({ data: prod })
  })
}

/**
 * It's an async function that uses the tProduct model to find a product by its id, and returns the
 * product as a JSON object.
 * @param req - The request object.
 * @param res - the response object
 * @returns The data is being returned as a JSON object.
 */
const getOne = async (req, res) => {
  try {
    const data = await tProduct.findOne({ where: { id: req.params.id } })
    return res.json(data)
  } catch (err) {
    return res.status(404).json({ error: 'Product not found' })
  }
}

/**
 * It updates the product with the id that is passed in the url, with the data that is passed in the
 * body of the request.
 * @param req - request
 * @param res - response
 * @returns The updated product.
 */
const updateAdmin = async (req, res) => {
  try {
    await tProduct.update(req.body, { where: { id: req.params.id } })
    return res.json({ data: req.body })
  } catch (err) {
    return res.status(404).json({ error: 'Product not found' })
  }
}

/**
 * It deletes a product from the database based on the id of the product.
 * @param req - The request object.
 * @param res - The response object.
 * @returns a promise.
 */
const deleteProduct = async (req, res) => {
  try {
    await tProduct.destroy({ where: { id: req.params.id } })
    return res.json({ data: `Delete product Id: ${req.params.id}` })
  } catch (err) {
    return res.status(404).json({ error: 'Product not found' })
  }
}

module.exports = {
  getAll,
  create,
  getOne,
  updateAdmin,
  deleteProduct
}
