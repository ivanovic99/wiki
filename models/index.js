var S = require("sequelize");
var db = new S("postgres://localhost:5432/wiki", { logging: false });

class Page extends S.Model {
  route() {
    return "/wiki/" + this.getDataValue("urltitle");
  }
}
Page.init(
  {
    title: { type: S.STRING, allowNull: false },
    urltitle: {
      type: S.STRING,
      allowNull: false
    },
    content: { type: S.TEXT, allowNull: false },
    status: {
      type: S.ENUM("open", "closed")
    },
    date: {
      type: S.DATE,
      defaultValue: S.NOW
    },
    tags: {
      type: S.ARRAY(S.STRING)
    }
  },
  {
    sequelize: db,
    modelName: "page"
  }
);

// Page.beforeValidate((page, options) => {
//   page.urltitle = generateUrlTitle(page.title);
// });

Page.beforeValidate((page, options) => {
  if(page.title){
    page.urltitle = page.title.replace(/\s+/g, "_").replace(/\W/g, "");
    //options.fields.push('urltitle');
  }
  else {
        // Generá de forma aleatoria un string de 5 caracteres
        return Math.random()
          .toString(36)
          .substring(2, 7);
      }
});

// function generateUrlTitle(title) {
//   if (title) {
//     //console.log(title);
//     // Remueve todos los caracteres no-alfanuméricos
//     // y hace a los espacios guiones bajos.
//     return title.replace(/\s+/g, "_").replace(/\W/g, "");
//   } else {
//     // Generá de forma aleatoria un string de 5 caracteres
//     return Math.random()
//       .toString(36)
//       .substring(2, 7);
//   }
// }

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

Page.belongsTo(User, { as: "author" });

module.exports = {
  Page: Page,
  User: User,
  db: db
};
