const productModel = require('../models/product');

exports.createProduct = async (req, res) => {
    try {
        const {name, description, price, stock} = req.body;
        const product = new productModel({
            name,
            description,
            price,
            stock
        });
        await product.save();
        res.status(201).json({
            message: 'Product created successfully',
            product
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating product',
            error: error.message
        });
    }
};
