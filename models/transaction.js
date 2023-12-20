'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.User, {
        foreignKey: 'userId',
      })
    }
  }
  Transaction.init({
    orderId: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    status: {
      type: DataTypes.STRING,
      status: "pending"
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Price is required"
        },
        notEmpty: {
          msg: "Price is required"
        },
        min: {
          args: [1],
          msg: "Price is required"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};