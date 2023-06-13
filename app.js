const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const { template } = require("./utils/Constants");
const chalk = require("chalk");
const config = require("./config/key");
const userRoutes = require("./routes/users");
const jsonParser = bodyParser.json();

String.prototype.log = function (data) {
  return console.log(data);
};
String.prototype.elog = function (data) {
  return console.log(chalk.bgRed(data));
};
const l = "";
l.log(config.mongoURI)
mongoose.set("strictQuery", true);
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(chalk.bgGreen("MongoDB Connected...")))
  .catch((err) => console.log(err));

const corsConfig = {
  credentials: true,
  origin: "https://jkharbels.com",
};
app.use(cors(corsConfig));

//to not get any deprecation warning or error
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
//to get json data
// support parsing of application/json type post data
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/", userRoutes);

app.post('/by-pass-api', jsonParser, async (req, response) => {
  const { url } = req.body;
  console.log("url", url)
  // const data = { data: req.body.data };
  const result = await axios.get(url);
  response.send(result);
});


//use this to show the image you have in node js server to client (react js)
//https://stackoverflow.com/questions/48914987/send-image-path-from-node-js-express-server-to-react-client
app.use("/uploads", express.static("uploads"));

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  // All the javascript and css files will be read and served from this folder
  // app.use(express.static("client/build"));
  // index.html for all page routes    html or routing and naviagtion
  // app.get("*", (req, res) => {
  //   res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  // });
}

const port = process.env.PORT || 5002;

app.get("/", (req, res) => {
  res.send(template(port));
});

app.listen(port, () => {
  l.log(port);
  console.log(chalk.bgGreen(`Server Listening on ${port}`));
});
