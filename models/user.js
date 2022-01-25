const Sequelize = require("sequelize");
const sequalizeInstance = require("../config/database");

const User = sequalizeInstance.define(
  "registeredUser",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    firstName: {
      type: Sequelize.STRING,
      field: "first_name",
      allowNull: false,
    },
    lastName: {
      type: Sequelize.STRING,
      field: "last_name",
      allowNull: true,
    },
    email: {
      type: Sequelize.STRING,
      field: "email",
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      field: "password",
      allowNull: false,
    },
    contactNumber: {
      type: Sequelize.BIGINT,
      field: "contact_number",
    },
    address: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    referenceString: {
      type: Sequelize.STRING,
      field: "reference_string",
    },
    isActive: {
      type: Sequelize.BOOLEAN,
      field: "is_active",
      defaultValue: true,
    },
    isDeleted: {
      type: Sequelize.BOOLEAN,
      field: "is_deleted",
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    tableName: "registered_user",
    defaultScope: {
      where: {
        isActive: true,
        isDeleted: false,
      },
    },
    scopes: {
      deleted: {
        where: {
          isDeleted: true,
        },
      },
    },
  }
);

User.hasOne(User, { as: "reference", foreignKey: "referenceId" });

module.exports = User;
