const dotenv = require('dotenv');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const { userController } = require("./controller/UserController.js");
const userModel = require("./models/User.js")
const { saveProduct, editProduct, deleteProduct } = require("./controller/ProductController.js");


dotenv.config();
const handleLogin = async (req, res) => {
    let dbData = await userModel.find({ username: req.body.username });
    if (dbData.length === 0 || dbData === null) {
        console.error("no result found for username----");
        res.status(401).send("failed");

    } else {
        const { pass } = req.body;
        let dbPass = dbData[0].password;
        bcrypt.compare(pass, dbPass, async (err, result) => {
            if (result === true) {
                const token = jwt.sign(
                    { user_id: "testingcookiesIshouldwesomethingrandombalkashdfalskdhfasldfkjhsaldkfj" },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "24h",
                    }
                );
                res.cookie("jwt", token, {
                    httpOnly: true,
                    secure: false,
                    sameOrigin: false,
                    maxAge: 24 * 60 * 60 * 1000,
                    hostOnly: false,
                });
                res.header("Access-Control-Allow-Origin", "http://31.187.72.242:3000");
                res.status(200).send('login successful');
            } else {
                res.status(401).send("wrong password");
                console.error("user not verified----");
            }
        });
    }
};

function handleProduct(req, res) {
    if (req.query.module === "edit") {
        console.log(" edit condition handle")
        editProduct(req, res)
    }
    if (req.query.module === "delete") {
        deleteProduct(req, res)
    }
}

module.exports = { handleLogin, handleProduct };
