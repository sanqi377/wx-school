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

app.use((req, res, next) => {
    config.WX.freeCheck.forEach((val) => {
        if (val == req.path) next();
    });
    let data = "";
    if (req.method == "POST") {
        data = req.body;
    } else if (req.method == "GET") {
        data = req.query;
    }
    next();
});

app.use("/user", userRouter);

app.listen(config.EXPRESS.port);

module.exports = app;
