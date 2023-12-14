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
        foreignKey: 'categoryId',
        as: 'category'
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
          msg : "Name is required"
        },
        notEmpty : {
          msg : "Name is required"
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
        },
        min: {
          args: [1],
          msg: "Price is required"
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
          msg : "Category is required"
        },
        notEmpty : {
          msg : "Category is required"
        }
      }
    },
    image: DataTypes.STRING,
    laundryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  Product.beforeCreate((product) => {
    const image = product.image ? product.image : "https://cdn.icon-icons.com/icons2/773/PNG/512/label_icon-icons.com_64593.png"
    product.image = image
  })
  return Product;
};