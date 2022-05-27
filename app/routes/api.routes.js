const router = require('express').Router()
const admin = require('express').Router()
const client = require('express').Router()
const user = require('../controllers/user.controller')
const product = require('../controllers/product.controller')
const middleware = require('../middlewares/Auth.middleware')
const { check } = require('express-validator')

const validationUser = [
  check('email').isEmail().withMessage('Email is required'),
  check('password').not().isEmpty().withMessage('Password is required')
]

const validationProduct = [
  check('name').not().isEmpty().withMessage('Name is required'),
  check('price').not().isEmpty().withMessage('Price is required'),
  check('available_quantity').not().isEmpty().withMessage('Quantity is required')
]

router.post('/login', validationUser, user.login)
router.post('/logout', user.logout)

// ------------------------------------------------------------------------------
router.use('/admin', middleware.isAdmin, admin)

admin.get('/user', user.getAll)
admin.put('/user/:id', user.update)
admin.delete('/user/:id', user.deleteUser)
admin.post('/user', validationUser, user.create)
admin.get('/product', product.getAll)
admin.get('/product/:id', product.getOne)
admin.post('/product', validationProduct, product.create)
admin.put('/product/:id', product.updateAdmin)
admin.delete('/product/:id', product.deleteProduct)
// ------------------------------------------------------------------------------
router.use('/client', middleware.isClient, client)

client.get('/product/:id', product.getOne)
client.put('/product/:id', product.updateClient)
// ------------------------------------------------------------------------------

module.exports = router
