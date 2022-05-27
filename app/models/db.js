const { Sequelize } = require('sequelize')
const dbConfig = require('../db.config.js')
const User = require('./user.model')
const Role = require('./Role.model')
const Product = require('./product.model')
const Order = require('./order.model')
const Invoice = require('./invoice.model')
const OrderInvoice = require('./order_invoice.model')

/* Creating a new instance of Sequelize --initializing database. */
const sequelize = new Sequelize(`postgres://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}:5432/${dbConfig.database}`)
try {
  sequelize.authenticate({ logging: false }).then(() => {
    console.log('Connection has been established successfully.')
  })
} catch (error) {
  console.error('Unable to connect to the database:', error)
}

/* Creating a new instance of diferents models. */
const tUser = User(sequelize, Sequelize)
const tRole = Role(sequelize, Sequelize)
const tProduct = Product(sequelize, Sequelize)
const tOrder = Order(sequelize, Sequelize)
const tInvoice = Invoice(sequelize, Sequelize)
const tOrderInvoice = OrderInvoice(sequelize, Sequelize)

/* Creating a foreign key in the diferents tables. */
tUser.belongsTo(tRole, { foreignKey: 'role_id' })
tOrder.belongsTo(tUser, { foreignKey: 'user_id' })
tOrder.belongsTo(tProduct, { foreignKey: 'product_id' })
tInvoice.belongsTo(tUser, { foreignKey: 'user_id' })
tInvoice.belongsToMany(tOrder, { foreignKey: 'invoice_id', through: tOrderInvoice })

sequelize.sync({ force: false, logging: false }).then(() => {
  console.log('Database & tables created!')
})

module.exports = {
  tUser,
  tRole,
  tProduct,
  tOrder,
  tInvoice,
  tOrderInvoice
}
