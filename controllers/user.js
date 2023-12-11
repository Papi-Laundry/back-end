class User {
  static async register(req, res, next) {
    try {
      res.send({
        message: "Register"
      })
    } catch (error) {
      next(error)
    }
  }

  static async login(req, res, next) {
    try {
      res.send({
        message: "Login"
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = User