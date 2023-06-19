const mongoose = require("mongoose");

const productsSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    company: {
        type: String,
        trim: true,
    },
    price: {
        type: Number
    },
    description: {
        type: String,
        trim: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    featured: {
        type: Boolean,
        default: true,
    },
    stock: {
        type: Number,
        default: 0,
    },
    img: {
        data: Buffer,
        contentType: String,
    },
}, {
    timestamps: true,
});

const products = mongoose.model(
    "products",
    productsSchema
);

module.exports = products;
