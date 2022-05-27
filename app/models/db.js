const { Sequelize } = require('sequelize')
const dbConfig = require('../db.config.js')
const User = require('./user.model')
const Role = require('./Role.model')
const Product = require('./product.model')
const Order = require('./order.model')
const Invoice = require('./invoice.model')

const sequelize = new Sequelize(`postgres://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}:5432/${dbConfig.database}`)
try {
  sequelize.authenticate({ logging: false }).then(() => {
    console.log('Connection has been established successfully.')
  })
} catch (error) {
  console.error('Unable to connect to the database:', error)
}

const tUser = User(sequelize, Sequelize)
const tRole = Role(sequelize, Sequelize)
const tProduct = Product(sequelize, Sequelize)
const tOrder = Order(sequelize, Sequelize)
const tInvoice = Invoice(sequelize, Sequelize)

tUser.belongsTo(tRole, { foreignKey: 'role_id' })
tRole.hasMany(tUser, { foreignKey: 'role_id' })
tOrder.belongsTo(tUser, { foreignKey: 'user_id' })
tUser.hasMany(tOrder, { foreignKey: 'user_id' })
tOrder.belongsTo(tProduct, { foreignKey: 'product_id' })
tProduct.hasMany(tOrder, { foreignKey: 'product_id' })
tInvoice.belongsTo(tUser, { foreignKey: 'user_id' })
tUser.hasMany(tInvoice, { foreignKey: 'user_id' })
tInvoice.belongsTo(tOrder, { foreignKey: 'order_id' })
tOrder.hasMany(tInvoice, { foreignKey: 'order_id' })

sequelize.sync({ force: false, logging: false }).then(() => {
  console.log('Database & tables created!')
})

module.exports = {
  tUser,
  tRole,
  tProduct,
  tOrder,
  tInvoice
}
