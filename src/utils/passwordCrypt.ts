import crypto from "crypto";

async function hassingPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hashedPwd = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return {
    salt: salt,
    hashedPwd: hashedPwd,
  };
}

export { hassingPassword };
