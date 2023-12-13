const Product = require("../models/product")


class LaundryProduct{
    static async createProduct(req,res,next){
        try {
            const { laundryId } = req.params
            const { name, price, description, categoryId, image} = req.body

            const product = await Product.create({
                name, 
                price, 
                description,
                laundryId, 
                categoryId, 
                image
            })

            res.status(200).json({
                id : product.id,
                name : product.name,
                price : product.price,
                description : product.description,
                category : product.categoryId,
                image : product.image,
            })
        } catch (error) {
            next(error)
        }
    }

    static async updateProduct(req,res,next){
        try {
            const { productId } = req.params

            const { name, price, description, categoryId, image} = req.body
            const data = await Product.update(req.body, {
                where : {
                    id : productId
                }
            })
            const updatedProduct = await Product.findByPk(id)
            res.status(200).json({updatedProduct})

        } catch (error) {
            next(error)
        }
    }

    static async deleteProduct(req,res,next){
        try {
            const { productId } = req.params
            if(!productId){
                throw {name : "NotFoundProductId", productId}
            }
            const deleteProduct = await Product.findByPk(id)
            await Product.destroy({
                where : {
                    id : productId
                }
            })
            if(!deleteProduct){
                throw {name : "NotFoundProduct", productId}
            }

            res.status(200).json({ message : `ProductId with ${productId} success to delete`})
        } catch (error) {
            next(error)
        }
    }
}

module.exports = LaundryProduct