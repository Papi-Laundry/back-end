'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.Product, {
        foreignKey: 'productId'
      })
      Order.belongsTo(models.UserProfile, {
        foreignKey: 'clientId'
      })
    }
  }
  Order.init({
    productId: DataTypes.INTEGER,
    clientId: DataTypes.INTEGER,
    totalUnit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Total is required"
        },
        notEmpty: {
          msg: "Total is required"
        },
        min: {
          args: [1],
          msg: "Total is required"
        }
      }
    },
    notes: DataTypes.STRING,
    method: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Method is required"
        },
        notEmpty: {
          msg: "Method is required"
        }
      }
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Destination is required"
        },
        notEmpty: {
          msg: "Destination is required"
        }
      }
    },
    destinationPoint: DataTypes.GEOMETRY('POINT'),
    status: {
      type: DataTypes.STRING,
      defaultValue: "On-Process"
    },
    rating: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};