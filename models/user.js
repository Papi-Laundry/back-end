'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require('../helpers/bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.UserProfile, {
        foreignKey: 'userId'
      })
    }
  }
  User.init({
    username: {
      type : DataTypes.STRING,
      allowNull : false,
      unique : {
        msg : "Username is already exist"
      },
      validate : {
        notNull : {
          msg : "Username is required"
        },
        notEmpty : {
          msg : "Username is required"
        }
      }
    },
    email: {
      type : DataTypes.STRING,
      allowNull : false,
      unique : {
        msg : "Email is already exist"
      },
      validate : {
        notNull : {
          msg : "Email is required"
        },
        notEmpty : {
          msg : "Email is required"
        },
        isEmail : {
          msg : "Email is invalid"
        }
      },
    },
    password: {
      type : DataTypes.STRING,
      allowNull : false,
      validate : {
        notNull : {
          msg : "Password is required"
        },
        notEmpty : {
          msg : "Password is required"
        },
        len: {
          args: [6],
          msg: "Password must more than 6 characters"
        }
      }
    },
    role: {
      type : DataTypes.STRING,
      allowNull : false,
      validate : {
        notNull : {
          msg : "Role is required"
        },
        notEmpty : {
          msg : "Role is required"
        },
        isIn: {
          args: [["owner", "client"]],
          msg: "Role only have owner or client"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  User.beforeCreate((user) => {
    const password = hashPassword(user.password)
    const username = user.username?.toLowerCase()
    user.password = password
    user.username = username
  })
  return User;
};