const { Category } = require('../models/index')

class CategoryController {
  static async getAll(_, res, next) {
    try {
      const category = await Category.findAll()

      res.status(200).json(category)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = CategoryController