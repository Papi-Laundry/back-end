const { comparePassword } = require("../helpers/bcrypt");
const { createToken } = require("../helpers/jwt");
const { UserProfile } = require("../models/index");
const { User } = require("../models/index");

class controllerUser {
  static async register(req, res, next) {
    try {
      let data = await User.create(req.body);
      res.status(201).json({ username: data.username, email: data.email });
      res.send({
        message: "Register",
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      let data = await User.findOne({
        where: {
          email: req.body.emailOrUsername,
        },
      });
      if (!data) {
        let user = await User.findOne({
          where: {
            username: req.body.emailOrUsername,
          },
        });
        if (user) {
          throw { name: "invalidUser/Password" };
        }
      }

      const isValid = comparePassword(req.body.password, data.password)
      if(isValid === true){
        const token = createToken({
          id : data.id
        })
        res.status(200).json({ access_token : token, email : data.email, username : data.username})
      } else {
        throw { name: "invalidUser/Password" };
      }


      res.send({
        message: "Login",
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { name, image } = req.body;
      const { id } = req.user;

      await UserProfile.update(
        {
          name,
          image,
        },
        {
          where: {
            userId: id,
          },
        }
      );

      const profile = await UserProfile.findOne({
        where: {
          userId: id,
        },
      });
      if (!profile) throw { name: "NotFound" };

      res.status(200).json({
        id: profile.id,
        name: profile.name,
        image: profile.image,
        updatedAt: profile.updatedAt,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = controllerUser;
