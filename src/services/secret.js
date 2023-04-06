const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const CreateToken = async (id) => {
  return JWT.sign(
    {
      iss: "NPT",
      sub: id,
    },
    process.env.SECRET_KEY,
    { expiresIn: "3h" }
  );
};
const HashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt).then(function (hash) {
    return hash;
  });
  return passwordHash;
};
const ComparePassword = async (passRq, passDb) => {
  const result = await bcrypt.compare(passRq, passDb);
  return result;
};
module.exports = { CreateToken, HashPassword, ComparePassword };
