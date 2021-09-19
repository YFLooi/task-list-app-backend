const crypto = require("crypto");
const userLoginModel = require("./user-login.model");

async function login(username, password) {
  console.log(`Checking for user record with provided credentials`);

  try {
    const userRecord = await userLoginModel.findOne({
      username: username,
      password: password,
    });

    console.log(`userRecord found for ${userRecord.username}`);
    console.log(`userRecord found for ${userRecord.profileImageLink}`);

    // To-do: Implement for all routes
    // Create a SHA-256 hash of userId
    // const generatedToken = crypto
    //   .createHash("sha256")
    //   .update(`${userRecord._id}`)
    //   .digest("hex");
    const generatedToken = userRecord._id;

    return {
      token: generatedToken,
      profileImageLink: userRecord.profileImageLink,
    };
  } catch (err) {
    throw new Error(`Unable to find user record for username ${username}`);
  }
}

module.exports = { login };
