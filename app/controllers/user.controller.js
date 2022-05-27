const bcrypt = require('bcrypt')
const { tUser } = require('../models/db')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

/**
 * It gets all the users from the database and returns them as a JSON object.
 * @param req - request
 * @param res - the response object
 */
const getAll = async (req, res) => {
  tUser.findAll({ include: 'role', attributes: { exclude: ['password'] } }).then(data => {
    return res.json(data)
  })
}

/**
 * It takes the password from the request body, hashes it, and then creates a new user with the hashed
 * password.
 * @param req - The request object.
 * @param res - The response object.
 * @returns the result of the bcrypt.hash function.
 */
const create = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  await bcrypt.hash(req.body.password, 10, function (err, hash) {
    if (err) return res.status(500).json({ error: err })
    req.body.password = hash
    tUser.create(req.body).then(data => {
      return res.json({ data: 'User created' })
    })
  })
}

/**
 * It updates a user's information in the database, and if the user changes their password, it hashes
 * the new password before updating the database.
 * @param req - the request object
 * @param res - the response object
 * @returns the result of the bcrypt.hash function.
 */
const update = async (req, res) => {
  try {
    if (req.body.password) {
      await bcrypt.hash(req.body.password, 10, function (err, hash) {
        if (err) return res.status(500).json({ error: err })
        req.body.password = hash
        tUser.update(req.body, {
          where: {
            id: req.params.id
          }
        }).then(data => {
          return res.json({ data: 'User updated' })
        })
      })
    } else {
      tUser.update(req.body, {
        where: {
          id: req.params.id
        }
      }).then(data => {
        return res.json({ data: 'User updated' })
      })
    }
  } catch (err) {
    return res.json({ error: err })
  }
}

/**
 * It takes the user's email and password, checks if the user exists, if the user exists, it checks if
 * the password is correct, if the password is correct, it creates a token and returns it.
 * </code>
 * @param req - the request object
 * @param res - the response object
 * @returns The token is being returned.
 */
const login = async (req, res) => {
  const user = await tUser.findOne({ where: { email: req.body.email } })
  if (!user) {
    return res.status(400).json({ error: 'Wrong email or password' })
  }
  await bcrypt.compare(req.body.password, user.password, function (err, result) {
    if (err) return res.status(401).json({ error: 'Wrong email or password' })
    if (result) {
      const role = user.role_id === 1 ? 'Admin' : 'Client'
      const keyValue = Math.floor(Date.now() / 1000) * Math.floor(Math.random() * 10)
      const newToken = createToken(user, role, keyValue)
      tUser.update({ token: keyValue }, {
        where: {
          id: user.id
        }
      })
      return res.json({
        token: newToken
      })
    }
  })
}

/**
 * It deletes a user from the database.
 * @param req - request
 * @param res - The response object.
 * @returns The data is being returned as a JSON object.
 */
const deleteUser = async (req, res) => {
  try {
    tUser.destroy({
      where: {
        id: req.params.id
      }
    }).then(data => {
      return res.json({ data: 'User deleted' })
    })
  } catch (err) {
    return res.json({ error: err })
  }
}

/**
 * It takes a token from the request header, verifies it, and then updates the user's token to null.
 * @param req - The request object.
 * @param res - The response object.
 * @returns The token is being returned.
 */
const logout = async (req, res) => {
  try {
    const token = req.headers['x-access-token'] || req.headers.authorization
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }
    const decoded = jwt.verify(token, 'Secret')
    tUser.update({ token: null }, {
      where: {
        id: decoded.id
      }
    }).then(() => {
      return res.json({ data: 'Logout success' })
    })
  } catch (err) {
    return res.status(401).json({ error: 'Token is not valid' })
  }
}

/**
 * It creates a token with a secret key, and the token expires in one hour.
 * @param user - The user object that is passed in from the database.
 * @param role - the role of the user
 * @param keyValue - This is the key that is used to encrypt the token.
 * @returns A token that is signed with the secret 'Secret'
 */
const createToken = (user, role, keyValue) => {
  return jwt.sign({
    expiredAt: Math.floor(Date.now() / 1000) + (60 * 60),
    iat: Math.floor(Date.now() / 1000),
    id: user.id,
    rl: role,
    key: keyValue
  }, 'Secret')
}

module.exports = {
  getAll,
  create,
  update,
  login,
  deleteUser,
  logout
}
