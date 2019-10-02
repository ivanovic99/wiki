var express = require("express");
var router = express.Router();
const wikiRouter = require("./wiki");
const userRouter = require("./user");
const searchRouter = require("./search")

//console.log(wikiRoutes);
router.use("/wiki", wikiRouter);

router.use("/users", userRouter);

router.use("/search", searchRouter);
router.use("/", wikiRouter); //default that sends to wiki as well. order is important, put "/" below all to avoid redirecting all requests here

module.exports = router;
