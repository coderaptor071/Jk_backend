const dotenv = require("dotenv");
const route = require("express").Router();
const { handleLogin, handleProduct } = require("../handler.js");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const productModel = require("../models/products.js");
const fs = require("fs");
const path = require('path');
const { sendEmail } = require('../utils/HelperFunctions.js')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('please upload JPEG,JPG,PNG file extension'));// sending error
    }
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });


dotenv.config();


route.post("/login", handleLogin);

route.get("/deleteProduct", handleProduct);

route.get("/logout", (req, res) => {
  res.clearCookie('jwt')
  res.status(200).send("logout successful")
})

route.get("/singleProduct", async (req, res) => {
  try {
    // console.log("single product", req.query.id)
    let data = await productModel.find({ _id: req.query.id })
    return res.json(data)
  } catch (err) {
    res.status(500).send(err.message)
  }
})
route.post("/saveProduct", upload.single("productImage"), async (req, res) => {
  let { name, company, price, description, stock, shipping } = req.body
  try {
    // console.log("__dirname-------------->imp", __dirname)
    // console.log("REQ.FILE.PATH-------------->imp", req.file.path)
    let imgPath = path.join(__dirname + '../' + '../' + '/uploads/' + req.file.filename)
    let tmp = {
      data: fs.readFileSync(imgPath),
      contentType: "image/png",
    }
    const temp = await productModel.find({ name: name, price: price })

    if (name == undefined) {
      return res.send("product information is required")
    }
    shipping = shipping ? shipping : 0
    if (temp.length < 1) {
      await productModel.create({
        name: name, price: price, description: description, img: tmp, stock: stock, shipping: shipping
      })
      fs.unlink(imgPath, (err) => {
        if (err) {
          console.error(err.message);
          return
        }
      });
      return res.status(201).send("Saved Successfully")
    }
    else {
      return res.send("Product already exists")
    }
  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal server Error")
  }
})
route.get('/allProducts', async (req, res) => {
  try {
    const num = req.query.num
    if (num) {
      const allData = await productModel.find().sort({ createdAt: -1 }).limit(num)
      return res.json(allData)
    }
    const allData = await productModel.find()
    res.json(allData)
  } catch (err) {
    res.status(500).send(err.message)
  }
})
route.post("/editProduct", upload.single("productImage"), async (req, res) => {
  try {
    let { name, price, description, stock, shipping } = req.body
    const id = req.query.id
    let tmp = null;
    shipping = shipping ? shipping : 0
    if (req.file) {
      const imgPath = path.join(__dirname + '../' + '../' + '/tmp/' + req.file.filename)
      tmp = {
        data: fs.readFileSync(imgPath),
        contentType: "image/png",
      }
    }
    if (name == undefined) {
      return res.send("product information is required")
    }
    if (tmp) {
      await productModel.findOneAndUpdate({ _id: id }, {
        name: name, price: price, description: description, img: tmp, stock: stock, shipping: shipping
      })
      fs.unlink(imgPath, (err) => {
        if (err) {
          console.error(err.message);
          return
        }
      });
    }
    else {
      const updatedDoc = await productModel.findOneAndUpdate({ _id: id }, {
        name: name, price: price, description: description, stock: stock, shipping: shipping
      }, { new: true })
    }
    console.log("Product Edited")
    return res.status(201).send("Edited Successfully")
  } catch (err) {
    console.log(err)
    return res.status(500).send("internal error")
  }

});

route.post("/contact", async (req, res) => {
  // console.log("req.body CONTACT", req.body)
  try {
    await sendEmail(req.body)
    return res.status(200).send("sent")
  } catch (err) {
    console.log(err)
    return res.status(500).send("internal error")
  }

})

//verify cookies
route.get("/session", (req, res) => {
  jwt.verify(req.cookies.jwt, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Error in verifying token or token not found cookie");
      res.status(403).send(err.message);
    } else {
      console.log("user verified");
      res.send(decoded).status(200);
    }
  });
});

module.exports = route;
