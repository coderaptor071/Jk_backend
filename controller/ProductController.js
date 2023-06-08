const productModel = require("../models/products.js");
const fs = require("fs");


const deleteProduct = async (req, res) => {
    try {
        await productModel.deleteOne({ "_id": req.query.id }
        )
        return res.send("Deleted successfully")
    } catch (err) {
        console.log(err)
        return res.status(500).send("internal error")
    }
}

module.exports = { deleteProduct };
