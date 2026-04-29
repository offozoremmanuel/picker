const router = require('express').Router();
const { createProduct } = require('../controller/product')

router.post('/product', createProduct)

module.exports = router