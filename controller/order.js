const orderModel = require('../models/order');
const userModel = require('../models/user');

exports.createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const {productId, quantity, totalAmount} = req.body;
        const order = new orderModel({
            userId,
            productId,
            quantity,
            totalAmount
        });
        await order.save();
        res.status(201).json({
            message: 'Order created successfully',
            order
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating order',
            error: error.message
        });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await orderModel.find({userId}).populate('productId').populate('userId', 'fullName email');
        res.status(200).json({
            message: 'User orders retrieved successfully',
            orders
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving user orders',
            error: error.message
        });
    }
};