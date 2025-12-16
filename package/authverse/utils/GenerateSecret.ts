import crypto from "crypto";

export const GenerateSecret = async () => {
  const secret = crypto.randomBytes(64).toString("hex");
  return secret;
};
