var express = require("express");
var router = express.Router();
var models = require("../models");
var S = require("sequelize");
const Op = S.Op;
var Page = models.Page;
var User = models.User;

router.post("/", function(req, res, next) {
  // agregá definiciones para  `title` y `content`
  User.findOrCreate({
    where: {
      name: req.body.name,
      email: req.body.email  // needs both because these are parameters for create as well
    }
  })
    .then(function(values) {
      var user = values[0];
      var page = Page.create({
        title: req.body.pageTitle,
        content: req.body.content,
        tags: req.body.tags.split(" ")
      });

      //console.log(user);
      return page.then(function(page) {
        console.log(page.tags);
        return page.setAuthor(user);
      });
    })
    .then(function(page) {
      res.redirect(page.route());
    })
    .catch(next);
});

router.get("/", function(req, res, next) {
  let dataArr = [];
  Page.findAll({
    attributes: ["title", "urltitle"]
  })
    .then(function(pages) {
      //console.log(pages);
      res.render("index", { pages });
    })
    .catch(next);
});

router.get("/add", function(req, res, next) {
  res.render("addpage");
});

router.get("/search", function(req, res, next) {
  console.log(req.body);
  Page.findAll({
    where: {
      tags: {
        [Op.in]: req.body.tagSearch
      }
    }
  })
    .then(function(pages) {
      console.log("hola");
      console.log(pages);
      res.render("tags", { pages });
    })
    .catch(next);
});

router.get("/:urlTitle", function(req, res, next) {
  Page.findOne({
    where: {
      urltitle: req.params.urlTitle
    },
    include: [{ model: User, as: "author" }]
  })
    .then(function(page) {
      // la instancia page va a tener una propiedad .author
      // como un objeto user ({ name, email })
      if (page === null) {
        res.status(404).send();
      } else {
        // console.log(page);      //could also add a property. like page.author = page.getAuthor()
        res.render("wikipage", {
          page: page
        });
      }
    })
    .catch(next);

  //   Page.findOne({
  //     where: {
  //       urltitle: req.params.urlTitle
  //     }
  //   })
  //     .then(function(foundPage) {
  //       res.render("wikipage", foundPage.dataValues);
  //     })
  //     .catch(next);
});

module.exports = router;
