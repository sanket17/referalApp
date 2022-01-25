const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const helper = require("../helper/index");

router.post("/", async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    contactNumber,
    password,
    confirmPassword,
    address,
    aadharNumber,
  } = req.body;

  if (!firstName) {
    return res.status(400).send("First Name is required.");
  }
  if (password !== confirmPassword) {
    return res.status(400).send("Entered Password did not match.");
  }

  if (!email) {
    return res.status(422).send("Email is required");
  } else if (!helper.checkValidEmail(email)) {
    return res.status(400).send("Invalid Email");
  }
  if (!helper.checkValidPhone(contactNumber)) {
    return res.status(400).send("Invalid Contact Number");
  }

  let referenceString = "";
  if (
    (aadharNumber !== "" ||
      aadharNumber !== null ||
      aadharNumber !== undefined) &&
    aadharNumber.length === 12
  ) {
    referenceString = `${firstName
      .slice(0, 3)
      .toUpperCase()}${aadharNumber.slice(8)}`;
  } else {
    referenceString = `${firstName.slice(0, 3).toUpperCase()}${Math.floor(
      1000 + Math.random() * 9000
    )}`;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  User.sync()
    .findOrCreate({
      where: { email: email },
      defaults: {
        firstName: firstName,
        lastName: lastName || null,
        email: email,
        contactNumber: contactNumber,
        password: hashedPassword,
        address: address,
        aadharNumber: aadharNumber,
        referenceString: referenceString,
      },
    })
    .spread((user, created) => {
      if (created) {
        return res.status(200).send(user);
      } else {
        return res.status(400).send("User already exists");
      }
    })
    .catch((error) => {
      next({ ...error, status: 400, path: req.path });
    });
});

router.get("/", (req, res, next) => {
  User.findAll()
    .then((users) => {
      return res.status(200).send(users);
    })
    .catch((error) => {
      console.log(error);
      next({ ...error, status: 400, path: req.path });
    });
});

router.get("/:id", (req, res, next) => {
  User.findByPk(req.params.id)
    .then((user) => {
      return res.status(200).send(user);
    })
    .catch((error) => {
      next({ ...error, status: 400, path: req.path });
    });
});

router.put("/:id", (req, res, next) => {
  const { firstName, lastName, email, contactNumber, address, aadharNumber } =
    req.body;

  if (!helper.checkValidPhone(contactNumber)) {
    return res.status(400).send("Invalid Contact Number");
  }

  User.update(
    {
      firstName: firstName,
      lastName: lastName || null,
      email: email,
      contactNumber: contactNumber,
      address: address,
      aadharNumber: aadharNumber,
    },
    { where: { id: req.params.id, isActive: true, isDeleted: false } }
  )
    .then((user) => {
      if (user) {
        return res.status(200).send(user);
      }
    })
    .catch((error) => {
      next({ ...error, status: 400, path: req.path });
    });
});

router.delete("/:id", (req, res, next) => {
  User.update(
    { isActive: false, isDeleted: true },
    { where: { id: req.params.id, isActive: true, isDeleted: false } }
  )
    .then((user) => {
      if (user) {
        return res.status(200).send(user);
      }
    })
    .catch((error) => {
      next({ ...error, status: 400, path: req.path });
    });
});

module.exports = router;
