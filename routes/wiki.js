var express = require("express");
var router = express.Router();
var models = require("../models");
var Page = models.Page;
var User = models.User;

router.post("/", function(req, res, next) {
  // agregá definiciones para  `title` y `content`
  var page = Page.create({
    title: req.body.pageTitle,
    content: req.body.content
  });
  // Asegurate que solo redirigimos **luego** que nuestro create esta completo!
  // nota:  `.create` devuelve una promesa
  page.then(value => {
    res.redirect(value.urltitle);
  });
});

router.get("/", function(req, res, next) {
  res.send("funcionó GET /wiki/");
});
// router.post("/", function(req, res, next) {
//   res.json(req.body);
//   console.log(req.body.title);
// });
router.get("/add", function(req, res, next) {
  res.render("addpage");
});

router.get("/:urlTitle", function(req, res, next) {
  Page.findOne({ 
    where: { 
      urltitle: req.params.urlTitle 
    } 
  })
  .then(function(foundPage){
    res.json(foundPage);
  })
  .catch(next);
  //res.send("llego a la ruta dinámica con: " + req.params.urlTitle);
});

module.exports = router;
