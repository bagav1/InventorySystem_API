module.exports = (sequelize, DataTypes) => {
  const orderInvoice = sequelize.define('order_invoice',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      invoice_id: DataTypes.INTEGER,
      orderId: DataTypes.INTEGER
    },
    { timestamps: false }
  )
  return orderInvoice
}
