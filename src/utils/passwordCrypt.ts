import crypto from "crypto";

async function hassingPassword(password: string) {
  const salt = crypto.randomBytes(128).toString("hex");
  const hashedPwd = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return {
    salt: salt,
    hashedPwd: hashedPwd,
  };
}
async function checkingHashedPassword(
  password: string,
  salt: string,
  hashedPwd: string,
) {
  const newHashedPwd = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  if (newHashedPwd == hashedPwd) {
    return true;
  } else {
    return false;
  }
}

export { hassingPassword, checkingHashedPassword };
