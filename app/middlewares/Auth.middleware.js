const jwt = require('jsonwebtoken')
const { tUser } = require('../models/db')

/**
 * If the token is valid, then the user is an admin, and the next function is called.
 * @param req - request
 * @param res - response
 * @param next - is a function that is called when the middleware is complete.
 * @returns The function isAdmin is being returned.
 */
const isAdmin = async (req, res, next) => {
  const token = req.headers.authorization
  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }
  try {
    const decoded = jwt.verify(token, 'Secret')
    tUser.findOne({ where: { id: decoded.id } }).then(user => {
      /* Checking if the user is an admin and if the token is valid. */
      if (Number(user.token) === decoded.key && decoded.rl === 'Admin') {
        next()
      } else res.status(401).json({ error: 'Token is not valid' })
    })
  } catch (err) {
    return res.status(401).json({ error: 'Token is not valid' })
  }
}

/**
 * It checks if the user is a client and if the token is valid.
 * @param req - request
 * @param res - response
 * @param next - is a function that passes control to the next middleware function.
 * @returns a function that is being called by the router.
 */
const isClient = async (req, res, next) => {
  const token = req.headers.authorization
  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }
  try {
    const decoded = jwt.verify(token, 'Secret')
    tUser.findOne({ where: { id: decoded.id } }).then(user => {
      /* Checking if the user is a client and if the token is valid. */
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
