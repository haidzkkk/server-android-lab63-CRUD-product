const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
    },
    quantity: {
        type: Number
    },
}, 
{
    collection: 'Products'
})

const ProductModel = new mongoose.model('Product', ProductSchema)

module.exports = ProductModel