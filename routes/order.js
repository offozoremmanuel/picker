const router = require('express').Router();
const { createOrder, getUserOrders } = require('../controller/order')
const {checkLogin} = require('../middleware/auth')

router.post('/order', checkLogin, createOrder)
router.get('/orders', checkLogin, getUserOrders)


module.exports = router