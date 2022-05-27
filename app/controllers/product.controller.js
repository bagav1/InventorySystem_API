const { tProduct } = require('../models/db')
const { validationResult } = require('express-validator')

const getAll = async (req, res) => {
  tProduct.findAll().then(data => {
    return res.json(data)
  })
}

const create = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  tProduct.create(req.body).then(prod => {
    return res.json({ data: prod })
  })
}

const getOne = async (req, res) => {
  try {
    const data = await tProduct.findOne({ where: { id: req.params.id } })
    return res.json(data)
  } catch (err) {
    return res.status(404).json({ error: 'Product not found' })
  }
}

const updateAdmin = async (req, res) => {
  try {
    await tProduct.update(req.body, { where: { id: req.params.id } })
    return res.json({ data: req.body })
  } catch (err) {
    return res.status(404).json({ error: 'Product not found' })
  }
}

const updateClient = async (req, res) => {
  try {
    await tProduct.update(req.body.available_quantity, { where: { id: req.params.id } })
    return res.json({ data: req.body })
  } catch (err) {
    return res.status(404).json({ error: 'Product not found' })
  }
}

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
  updateClient,
  deleteProduct
}
