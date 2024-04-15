let bcryptjs = require("bcryptjs");

let hashPassword = async (password) => {
  let salt = bcryptjs.genSaltSync(10);
  let hash = bcryptjs.hashSync(password, salt);
  console.log(
    "🚀 ~ file: universalFunction.js ~ line 11 ~ hashPassword ~ hash",
    hash
  );
  return hash;
};

let comparePassword = async (password, hash) => {
  let valid = bcryptjs.compareSync(password, hash);
  console.log(
    "🚀 ~ file: universalFunction.js ~ line 14 ~ comparePassword ~ valid",
    valid
  );
  return valid;
};

module.exports = {
  hashPassword,
  comparePassword,
};
