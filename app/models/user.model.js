const bcrypt = require('bcrypt')
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user',
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
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false

      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      token: DataTypes.STRING
    }
  )
  return user
}
