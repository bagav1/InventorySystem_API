module.exports = (sequelize, DataTypes) => {
  const product = sequelize.define('product',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      price: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      lot: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      available_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }
  )
  return product
}
