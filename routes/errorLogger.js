const res = require("express/lib/response");
const ErrorLogger = require("../../models/error");

export const errorLogger = (err, req, res, next) => {
  ErrorLogger.sync()
    .create({
      message: err.message,
      stack: err.stack,
      path: req.path,
    })
    .then((result) => {
      res.status(err.status).send(err.message);
    })
    .catch(() => {
      next(err);
    });
  error.save();
  next(err);
};
