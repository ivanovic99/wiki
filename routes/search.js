var express = require("express");
var router = express.Router();
var models = require("../models");
var Page = models.Page;
var User = models.User;

router.get("/", function(req, res, next) {
  res.render("./search")
});

module.exports = router;