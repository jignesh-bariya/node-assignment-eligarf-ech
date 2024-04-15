const jwt = require("jsonwebtoken");
const moment = require("moment");
const { jwtConfig } = require("./constant");
const { UserModel } = require("../schema");
const { http_codes, messages } = require("../utils/constant");

exports.generateRandomString = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

exports.generateAccessToken = (userPayload) => {
  const exp = moment().add(jwtConfig.accessExpirationMinutes, "minutes");
  const payload = {
    fullName: userPayload.fullName,
    userId: userPayload._id,
    email: userPayload.email,
    sub: userPayload._id,
    iat: moment().unix(),
    exp: exp.unix(),
  };
  console.log(
    "🚀 ~ file: universalFunction.js ~ line 24 ~ generateAccessToken ~ payload",
    payload
  );
  return jwt.sign(payload, jwtConfig.secret);
};

exports.userVerifyToken = async (req, res, next) => {
  if (!req.headers["authorization"]) {
    return res.status(http_codes.unAuthorized).json({
      code: http_codes.unAuthorized,
      data: {},
      message: messages.tokenRequire,
    });
  }
  let token = req.headers["authorization"].split(" ")[1];
  await jwt.verify(token, process.env.JWT_SECRET, (err) => {
    if (err) {
      console.log("err", err);
      return res.status(http_codes.unAuthorized).json({
        code: http_codes.unAuthorized,
        data: {},
        message: messages.tokenExpired,
      });
    } else {
      let obj = decodeToken(token);
      console.log("obj", obj);
      let query = { _id: obj.userId, isDeleted: false };
      UserModel.findOne(query)
        .then(async (data) => {
          if (!data) {
            return res.status(http_codes.unAuthorized).json({
              code: http_codes.unAuthorized,
              data: {},
              message: messages.invalidToken,
            });
          } else {
            req.user = data;
            next();
          }
        })
        .catch((err) => {
          console.error("Error In User Verify Token", err);
          return res.status(http_codes.internalError).json({
            code: http_codes.internalError,
            data: {},
            message: messages.internalServerError,
          }); //msg.internalServerError })
        });
    }
  });
};

exports.userAuthorize = async (req, res, next) => {
  try {
    let token = req.headers["authorization"].split(" ")[1];
    await jwt.verify(token, process.env.JWT_SECRET, (err) => {
      if (err) {
        console.log("err", err);
        return {
          error: true,
          message: err.message,
          user: "",
        };
      } else {
        let obj = decodeToken(token);
        let query = { _id: obj.userId, isDeleted: false };
        UserModel.findOne(query)
          .then(async (data) => {
            if (!data) {
              return {
                error: true,
                message: "User record not found.",
                user: "",
              };
            } else {
              const response = {
                error: false,
                message: "User Found.",
                user: data,
              };
              req.user = data;
              return next;
              return response;
            }
          })
          .catch((err) => {
            console.error("Error In User Verify Token", err);
            return {
              error: true,
              message: err.message,
              user: "",
            };
          });
      }
    });
  } catch (error) {
    console.error("Error In User Verify Token", error);
    return {
      error: true,
      message: error.message,
      user: "",
    };
  }
};

decodeToken = (token) => {
  return jwt.decode(token);
};

/**
 * Removes extension from file
 * @param {string} file - filename
 */
exports.removeExtensionFromFile = (file) => {
  return file.split(".").slice(0, -1).join(".").toString();
};

/**
 * Gets browser info from user
 * @param {*} req - request object
 */
exports.getBrowserInfo = (req) => req.headers["user-agent"];

/**
 * Gets country from user using CloudFlare header 'cf-ipcountry'
 * @param {*} req - request object
 */
exports.getCountry = (req) =>
  req.headers["cf-ipcountry"] ? req.headers["cf-ipcountry"] : "XX";

/**
 * Handles error by printing to console in development env and builds and sends an error response
 * @param {Object} res - response object
 * @param {Object} err - error object
 */
exports.handleError = (res, err) => {
  // Prints error in console
  if (process.env.NODE_ENV === "development") {
    console.log(err);
  }
  // Sends error to user
  res.status(err.code).json({
    errors: {
      msg: err.message,
    },
  });
};

/**
 * Builds error object
 * @param {number} code - error code
 * @param {string} message - error text
 */
exports.buildErrObject = (code, message) => {
  return {
    code,
    message,
  };
};

/**
 * Builds error for validation files
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Object} next - next object
 */
exports.validationResult = (req, res, next) => {
  try {
    validationResult(req).throw();
    if (req.body.email) {
      req.body.email = req.body.email.toLowerCase();
    }
    return next();
  } catch (err) {
    return this.handleError(res, this.buildErrObject(422, err.array()));
  }
};

/**
 * Builds success object
 * @param {string} message - success text
 */
exports.buildSuccessObject = (message) => {
  return {
    msg: message,
  };
};

/**
 * Checks if given ID is good for MongoDB
 * @param {string} id - id to check
 */
exports.isIDGood = async (id) => {
  return new Promise((resolve, reject) => {
    const goodID = mongoose.Types.ObjectId.isValid(id);
    return goodID
      ? resolve(id)
      : reject(this.buildErrObject(422, "ID MALFORMED"));
  });
};

/**
 * Item not found
 * @param {Object} err - error object
 * @param {Object} item - item result object
 * @param {Object} reject - reject object
 * @param {string} message - message
 */
exports.itemNotFound = (err, item, reject, message) => {
  if (err) {
    reject(this.buildErrObject(422, err.message));
  }
  if (!item) {
    reject(this.buildErrObject(404, message));
  }
};

/**
 * Item already exists
 * @param {Object} err - error object
 * @param {Object} item - item result object
 * @param {Object} reject - reject object
 * @param {string} message - message
 */
exports.itemAlreadyExists = (err, item, reject, message) => {
  if (err) {
    reject(this.buildErrObject(422, err.message));
  }
  if (item) {
    reject(this.buildErrObject(422, message));
  }
};

exports.addCommaInCurrency = (word) => {
  return parseFloat(word).toLocaleString("en-IN", { maximumFractionDigits: 0 });
};

exports.convertToCamelCase = (str) => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+|-/g, "");
};

exports.restructureData = (data) => {
  const result = [];

  let currentProduct = null;

  for (const obj of data) {
    const {
      no,
      id,
      size,
      gram,
      costPrice,
      offerPrice,
      actualPrice,
      diameter,
      circumference,
      ...rest
    } = obj;

    if (no && no.trim() !== "") {
      if (currentProduct) {
        result.push(currentProduct);
      }

      currentProduct = { no, id, ...rest, productSize: [] };
    }

    if (size) {
      currentProduct &&
        currentProduct.productSize.push({
          size,
          gram,
          productCostPrice: costPrice,
          productOfferPrice: offerPrice,
          productActualPrice: actualPrice,
          diameter,
          circumference,
        });
    }
  }

  // Push the last product into the result array if it exists
  if (currentProduct) {
    result.push(currentProduct);
  }

  return result;
};
