const router = require('express').Router()
const admin = require('express').Router()
const client = require('express').Router()
const user = require('../controllers/user.controller')
const product = require('../controllers/product.controller')
const order = require('../controllers/order.controller')
const invoice = require('../controllers/invoice.controller')
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

/* Login/Logout routers. */
router.post('/login', validationUser, user.login)
router.post('/logout', user.logout)

// -----Admin routers-----

/* A middleware that checks if the user is an admin. */
router.use('/admin', middleware.isAdmin, admin)

/* Users admin routers. */
admin.get('/user', user.getAll)
admin.put('/user/:id', user.update)
admin.delete('/user/:id', user.deleteUser)
admin.post('/user', validationUser, user.create)
/* Products routers. */
admin.get('/product', product.getAll)
admin.get('/product/:id', product.getOne)
admin.post('/product', validationProduct, product.create)
admin.put('/product/:id', product.updateAdmin)
admin.delete('/product/:id', product.deleteProduct)
/* Invoices routers. */
admin.get('/invoice', invoice.getInvoiceAdmin)
admin.get('/user_invoice/:id', invoice.getInvoiceByUser)

// -----Client routers-----

/* A middleware that checks if the user is a client. */
router.use('/client', middleware.isClient, client)

client.get('/product/:id', product.getOne)
client.post('/order', order.create)
client.get('/cart', order.getCart)
client.get('/historic', order.getHistoric)
client.post('/invoice', invoice.create)
client.get('/invoice', invoice.getInvoiceClient)

module.exports = router
