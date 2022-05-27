const jwt = require('jsonwebtoken')
const { tUser } = require('../models/db')

const isAdmin = async (req, res, next) => {
  const token = req.headers.authorization
  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }
  try {
    const decoded = jwt.verify(token, 'Secret')
    tUser.findOne({ where: { id: decoded.id } }).then(user => {
      if (Number(user.token) === decoded.key && decoded.rl === 'Admin') {
        next()
      } else res.status(401).json({ error: 'Token is not valid' })
    })
  } catch (err) {
    return res.status(401).json({ error: 'Token is not valid' })
  }
}

const isClient = async (req, res, next) => {
  const token = req.headers.authorization
  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }
  try {
    const decoded = jwt.verify(token, 'Secret')
    tUser.findOne({ where: { id: decoded.id } }).then(user => {
      if (Number(user.token) === decoded.key && decoded.rl === 'Client') {
        next()
      } else res.status(401).json({ error: 'Token is not valid' })
    })
  } catch (err) {
    return res.status(401).json({ error: 'Token is not valid' })
  }
}

module.exports = {
  isAdmin,
  isClient
}
