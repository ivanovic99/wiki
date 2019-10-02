var S = require("sequelize");
var db = new S("postgres://localhost:5432/wiki", { logging: false });

class Page extends S.Model {}
Page.init(
  {
    title: { type: S.STRING, allowNull: false },
    urltitle: {
      type: S.STRING,
      allowNull: false,
      get() {
        // return "/wiki/" + this.urltitle;
        return "/wiki/" + this.getDataValue("urltitle");
      }
    },
    content: { type: S.TEXT, allowNull: false },
    status: {
      type: S.ENUM("open", "closed")
    },
    date: {
      type: S.DATE,
      defaultValue: S.NOW
    }
  },
  {
    sequelize: db,
    modelName: "page"
  }
);

Page.beforeValidate((page, options) => {
  page.urltitle = generateUrlTitle(page.title);
});

function generateUrlTitle(title) {
  if (title) {
    //console.log(title);
    // Remueve todos los caracteres no-alfanuméricos
    // y hace a los espacios guiones bajos.
    return title.replace(/\s+/g, "_").replace(/\W/g, "");
  } else {
    // Generá de forma aleatoria un string de 5 caracteres
    return Math.random()
      .toString(36)
      .substring(2, 7);
  }
}

class User extends S.Model {}
User.init(
  {
    name: {
      type: S.STRING,
      allowNull: false
    },
    email: {
      type: S.STRING,
      allowNull: false,
      validate: { isEmail: true }
    }
  },
  { sequelize: db, modelName: "user" }
);

module.exports = {
  Page: Page,
  User: User,
  db: db
};
