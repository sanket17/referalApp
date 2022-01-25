const fs = require("fs");
const Sequelize = require("sequelize");
const sequalizeInstance = require("../config/database");
const db = {};
fs.readdirSync(__dirname)
  .filter((file) => file !== "index.js")
  .forEach((file) => {
    const model = require(`./${file}`);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequalizeInstance;
db.Sequelize = Sequelize;

module.exports = db;
