'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Laundry extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Laundry.belongsTo(models.UserProfile, {
        foreignKey: 'ownerId',
        as: "owner"
      })
      Laundry.hasMany(models.Product, {
        foreignKey: "laundryId"
      })
    }
  }
  Laundry.init({
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
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Location is required"
        },
        notEmpty: {
          msg: "Location is required"
        }
      }
    },
    locationPoint: DataTypes.GEOMETRY('POINT'),
    image: {
      type: DataTypes.STRING,
      defaultValue: "https://i.pinimg.com/originals/1f/1c/55/1f1c55442e45f24420754ce64351f6c0.png"
    },
    ownerId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Laundry',
  });
  return Laundry;
};