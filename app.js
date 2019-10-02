const express = require("express");
const app = express();
const nunjucks = require("nunjucks");
const morgan = require("morgan");
const expressNunjucks = require("express-nunjucks");
const routes = require("./routes");
const bodyParser = require("body-parser");
const models = require("./models");


var env = nunjucks.configure("views", { noCache: true });
// hace res.render funcionar con archivos html
app.set("view engine", "html");
// cuando res.render funciona con archivos html, haz que use nunjucks para eso.
app.engine("html", nunjucks.render);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use("/", routes);

models.db
  .sync({ force: true })
  .then(function() {
    // asegurate de reemplazar el nombre de abajo con tu app de express
    app.listen(3000, function() {
      console.log("Server is listening on port 3000!");
    });
  })
  .catch(console.error);

app.use(express.static("public"));
