const http_codes = {
  badRequest: 400,
  internalError: 500,
  created: 201,
  notFound: 404,
  conflict: 409,
  ok: 200,
  notImplemented: 501,
  forbidden: 403,
  unAuthorized: 401,
};

const messages = {
  //Common Message
  recordNotFound: "Record not found",
  emailAlreadyRegistered: "Email already registered",
  recordNotFound: "Record not found",
  tokenRequire: "Token is require",
  tokenExpired: "Token is expired",
  invalidUserEmail: "Please enter valid email",
  internalServerError: "Internal server error",
  listFetch: "Record(s) found successfully.",
  detailsFetch: "Record details found successfully.",
  recordUpdate: "Record updated successfully.",
  recordDelete: "Record deleted successfully.",
  recordCreate: "Record created successfully.",
  signUpSuccess: "User registered successfully",
  invalidPassword: "User password invalid",
  badRequest: "Something went wrong. Please try after sometimes",
  forgotPasswordCodeSent:
    "Verification code successfully sent. Please very for change password.",
  passwordChangeSuccess: "Password successfully changed",
  profileGetSuccess: "Profile Data Successfully fetched.",
  invalidOldPassword: "Invalid old password.",
  verificationCodeExpited: "Password's email verification code expired.",
  otpSendSuccess: "Verification OTP send successfully.",
  invalidMobileNo: "Mobile number is invalid. Please check and try again!!!",
  invalidOtp: "Invalid verification code.",
  referenceData:
    "Can not delete provided ids data, It's available in reference data.",
  recordsListFetched: "Records get successfully.",
  accountDeactive:
    "Your account is deactivated by admin. Please contact administrator",
};

const jwtConfig = {
  secret: process.env.JWT_SECRET,
  accessExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION,
};

module.exports = {
  http_codes,
  messages,
  jwtConfig,
};
