const { Product, Category, Laundry } = require("../models/index")
const cloudinary = require('../config/cloudinary')

class ProductController {
  static async getAll(req, res, next) {
    try {
      const { laundryId } = req.params
      if(!Number(laundryId)) throw { name: "InvalidParams" }
  
      const laundry = await Laundry.findOne({
        where: {
          id: laundryId
        }
      })
      if(!laundry) throw { name: "NotFound" }

      const products = await Product.findAll({
        where: {
          laundryId
        },
        include: {
          model: Category,
          as: 'category',
          attributes: ["name"]
        },
        order: [
          ["createdAt"]
        ]
      })

      res.status(200).json(products)
    } catch (error) {
      next(error)
    }
  }
  static async create(req,res,next) {
    try {
      const { laundryId } = req.params
      const { name, price, description, categoryId } = req.body

      const queryCreate = {
        name, 
        price, 
        description,
        laundryId, 
        categoryId
      }

      if(req.file) {
        const { mimetype, buffer, originalname } = req.file;
        const file = "data:" + mimetype + ";base64," + buffer.toString("base64")
  
        const response = await cloudinary.v2.uploader.upload(file, { public_id: originalname })
        if(!response.url) throw { name: "NetworkIssues" }

        queryCreate.image = response.url
      }

      const product = await Product.create(queryCreate)

      const category = await Category.findByPk(categoryId)

      res.status(201).json({
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        category: category.name,
        image: product.image,
        createdAt: product.createdAt
      })
    } catch (error) {
      next(error)
    }
  }

  static async update(req,res,next){
    try {
      const { productId } = req.params
      const { name, price, description, categoryId } = req.body
      
      const queryUpdate = {
        name, 
        price, 
        description,
        categoryId
      }

      if(req.file) {
        const { mimetype, buffer, originalname } = req.file;
        const file = "data:" + mimetype + ";base64," + buffer.toString("base64")
  
        const response = await cloudinary.v2.uploader.upload(file, { public_id: originalname })
        if(!response.url) throw { name: "NetworkIssues" }

        queryUpdate.image = response.url
      }

      if(!Number(productId)) throw { name: "InvalidParams" }
      let product = await Product.findByPk(productId)
      if(!product) throw { name: "NotFound" }

      await Product.update(queryUpdate, {
        where : {
          id : productId
        }
      })

      product = await Product.findByPk(productId)

      const category = await Category.findByPk(product.categoryId)

      res.status(200).json({
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        category: category.name,
        image: product.image,
        updatedAt: product.updatedAt
      })
    } catch (error) {
      next(error)
    }
  }

  static async delete(req,res,next){
    try {
      const { productId } = req.params
      if(!Number(productId)) {
        throw { name : "InvalidParams" }
      }

      const product = await Product.findByPk(productId)
      if(!product) throw { name: "NotFound" }
      
      const category = await Category.findByPk(product.categoryId)

      await Product.destroy({
        where : {
          id : productId
        }
      })
      
      res.status(200).json({
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        category: category.name,
        image: product.image,
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = ProductController