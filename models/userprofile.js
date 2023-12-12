'use strict';
const {
  Model
} = require('sequelize');
const { toCapitalize } = require('../helpers/converter');
module.exports = (sequelize, DataTypes) => {
  class UserProfile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserProfile.belongsTo(models.User, {
        foreignKey: 'userId'
      })
      UserProfile.hasMany(models.Laundry, {
        foreignKey: 'ownerId'
      })
      UserProfile.hasMany(models.Order, {
        foreignKey: 'clientId'
      })
    }
  }
  UserProfile.init({
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserProfile',
  });
  UserProfile.beforeCreate((userProfile) => {
    const name = toCapitalize(userProfile.name)
    userProfile.name = name
    userProfile.image = "https://i.pinimg.com/originals/0c/3b/3a/0c3b3adb1a7530892e55ef36d3be6cb8.png"
  })
  return UserProfile;
};