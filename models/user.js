'use strict';
const { hashPassword } = require('../helpers/bcrypt');
const {
  Model
} = require('sequelize');
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
        args : true,
        msg : "username is exist"
      },
      validate : {
        notNull : {
          args : true,
          msg : "username is not null"
        },
        notEmpty : {
          args : true,
          msg : "username is not empty"
        }
      }
    },
    email: {
      type : DataTypes.STRING,
      allowNull : false,
      unique : {
        args : true,
        msg : "email is exist"
      },
      validate : {
        notNull : {
          args : true,
          msg : "email is not null"
        },
        notEmpty : {
          args : true,
          msg : "email is not empty"
        },
        isEmail : {
          args : true,
          msg : "format email invalid"
        }
      },
    },
    password: {
      type : DataTypes.STRING,
      allowNull : false,
      validate : {
        notNull : {
          args : true,
          msg : "password is not null"
        },
        notEmpty : {
          args : true,
          msg : "password is not empty"
        }
      }
    },
    role: {
      type : DataTypes.STRING,
      allowNull : false,
      validate : {
        notNull : {
          args : true,
          msg : "role is not null"
        },
        notEmpty : {
          args : true,
          msg : "role is not empty"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  User.beforeCreate( (user, options) => {
    const hashedPassword =  hashPassword(user.password)
    user.password = hashedPassword
  })
  return User;
};