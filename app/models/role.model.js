module.exports = (sequelize, DataTypes) => {
  const role = sequelize.define('role',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    { timestamps: false }
  )
  return role
}
