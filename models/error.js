const Sequalize = require("sequelize");
const sequalizeInstance = require("../config/database");

const ErrorLogger = sequalizeInstance.define(
  "error",
  {
    id: {
      type: Sequalize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    message: {
      type: Sequalize.STRING,
      field: "message",
      allowNull: false,
    },
    stack: {
      type: Sequalize.STRING,
      field: "stack",
      allowNull: true,
    },
    path: {
      type: Sequalize.STRING,
      field: "path",
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = ErrorLogger;
