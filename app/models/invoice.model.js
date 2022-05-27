module.exports = (sequelize, DataTypes) => {
  const invoice = sequelize.define('invoice',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      total: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      order_id: {
        type: DataTypes.INTEGER
      }
    }
  )
  return invoice
}
