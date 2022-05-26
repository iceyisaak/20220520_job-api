// const { CustomAPIError } = require('../errors');
const { StatusCodes } = require('http-status-codes');

const errorHandlerMiddleware = (err, req, res, next) => {

  // console.log('err:', err);
  // console.log('err.code:', err.code);
  // console.log('err.statusCode:', err.statusCode);

  let customError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong."
  };

  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message });
  // }

  if (err.name === 'ValidationError') {
    console.log('err: ', Object.values(err));
    console.log('err.errors: ', Object.values(err.errors));
    customError.msg = Object.values(err.errors).map((item) => item.message).join(' ');
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (err.name === 'CastError') {
    customError.msg = `No item found with ID ${err.value}`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }

  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field. Please enter new value.`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  return res.status(customError.statusCode).send({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;