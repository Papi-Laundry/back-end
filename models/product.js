'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.hasMany(models.Order, {
        foreignKey: 'productId'
      })
      Product.belongsTo(models.Category, {
        foreignKey: 'categoryId'
      })
      Product.belongsTo(models.Laundry, {
        foreignKey: 'laundryId'
      })
    }
  }
  Product.init({
    name: {
      type : DataTypes.STRING,
      allowNull : false,
      validate : {
        notNull : {
          msg : "Product Name is required"
        },
        notEmpty : {
          msg : "Product Name is required"
        }
      }
    },
    price: {
      type : DataTypes.INTEGER,
      allowNull : false,
      validate : {
        notNull : {
          msg : "Price is required"
        },
        notEmpty : {
          msg : "Price is required"
        }
      }
    },
    description: {
      type : DataTypes.STRING,
      allowNull : false,
      validate : {
        notNull : {
          msg : "Description is required"
        },
        notEmpty : {
          msg : "Description is required"
        }
      }
    },
    categoryId: {
      type : DataTypes.INTEGER,
      allowNull : false,
      validate : {
        notNull : {
          msg : "categoryId is required"
        },
        notEmpty : {
          msg : "categoryId is required"
        }
      }
    },
    image: {
      type : DataTypes.STRING,
      allowNull : false,
      validate : {
        notNull : {
          msg : "Image is required"
        },
        notEmpty : {
          msg : "Image is required"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};