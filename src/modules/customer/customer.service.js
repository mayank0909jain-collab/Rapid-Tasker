const User = require("../../models/User");

const getProfile = async (userId) => {
  const user = await User.findById(userId).select(
    "_id phone role name email isActive createdAt"
  );

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

const updateProfile = async (userId, data) => {
  const allowedFields = {};

  if (data.name !== undefined) {
    allowedFields.name = data.name.trim();
  }

  if (data.email !== undefined) {
    allowedFields.email = data.email.trim().toLowerCase();
  }

  const user = await User.findByIdAndUpdate(
    userId,
    allowedFields,
    {
      new: true,
      runValidators: true,
    }
  ).select("_id phone role name email isActive createdAt");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

module.exports = {
  getProfile,
  updateProfile,
};