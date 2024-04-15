const { UserModel } = require("../../schema");
const {
  hashPassword,
  comparePassword,
} = require("../../utils/universalFunction");
const { http_codes, messages } = require("../../utils/constant");
const { generateAccessToken } = require("../../utils/utils");

const register = async (req, res) => {
  try {
    const { email } = req.body;
    const checkEmail = await UserModel.findOne({
      email: email,
      isDeleted: false,
    });
    if (checkEmail) {
      return res.status(http_codes.badRequest).json({
        code: http_codes.badRequest,
        data: {},
        message: "Email address already exists.",
      });
    }

    req.body.password = await hashPassword(req.body.password);
    const createUser = await UserModel.create(req.body);
    return res.status(http_codes.ok).json({
      code: http_codes.ok,
      data: {
        userId: createUser._id,
        email: createUser.email,
      },
      message: "Registration successfully completed.",
    });
  } catch (error) {
    console.error("Error in User Register", error.message);
    return res.status(http_codes.internalError).json({
      code: http_codes.internalError,
      data: {},
      message: messages.internalServerError,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const loginData = await UserModel.findOne({
      email: email,
      isDeleted: false,
    });

    if (!loginData) {
      return res.status(http_codes.badRequest).json({
        code: http_codes.badRequest,
        data: {},
        message: "Invalid email address.",
      });
    } else if (!(await comparePassword(password, loginData.password))) {
      console.log(await comparePassword(password, loginData.password));
      console.log(password, loginData.password);
      return res.status(http_codes.badRequest).json({
        code: http_codes.badRequest,
        data: {},
        message: "Invalid Password",
      });
    } else {
      if (loginData.isDeleted) {
        return res.status(http_codes.badRequest).json({
          code: http_codes.badRequest,
          data: {},
          message: "User not found.",
        });
      }
      const token = generateAccessToken(loginData);
      const response = {
        token: token,
        ...loginData?._doc,
      };
      delete response?.password;
      return res.status(http_codes.ok).json({
        code: http_codes.ok,
        data: response,
        message: "Login successfully.",
      });
    }
  } catch (error) {
    console.error("Error in User Login", error.message);
    return res.status(http_codes.internalError).json({
      code: http_codes.internalError,
      data: {},
      message: messages.internalServerError,
    });
  }
};

module.exports = {
  register,
  login,
};
