const Account = require("../models/accountModel");

const updateTopCreators = async () => {
  try {
    // 1️⃣ Reset all users
    await Account.updateMany({}, { isTopCreator: false });

    // 2️⃣ Get top 5 users by totalLikes
    const topUsers = await Account.find()
      .sort({ totalLikes: -1 })
      .limit(5);

    // 3️⃣ Mark them
    for (let user of topUsers) {
      user.isTopCreator = true;
      await user.save();
    }

    console.log("Top creators updated ✅");
  } catch (error) {
    console.error("Error updating top creators:", error);
  }
};

module.exports = updateTopCreators;