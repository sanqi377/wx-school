const config = require("../config/config");

const express = require("express");

const userRouter = require("../router/User");

const app = express();

// app.use(
//     express.urlencoded({
//         extended: true,
//     })
// );

app.use(express.json());

app.use("/user", userRouter);

app.listen(config.EXPRESS.port);

module.exports = app;
