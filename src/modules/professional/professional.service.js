const User = require("../../models/user");
const Professional = require("../../models/professional");

const getProfile = async (userId) => {
  const professional =
    await Professional.findOne({
      user: userId,
    }).populate(
      "user",
      "phone name email role"
    );

  if (!professional) {
    throw new Error(
      "Professional profile not found"
    );
  }

  return professional;
};

const createProfile = async (
  userId,
  data
) => {
  const existing =
    await Professional.findOne({
      user: userId,
    });

  if (existing) {
    throw new Error(
      "Professional profile already exists"
    );
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.role !== "PROFESSIONAL") {
    throw new Error(
      "User is not a professional"
    );
  }

  const professional =
    await Professional.create({
      user: userId,
      bio: data.bio,
      profileImage: data.profileImage,
      experienceYears:
        data.experienceYears || 0,
      phone: data.phone,
      serviceArea: data.serviceArea,
    });

  return professional;
};

const updateProfile = async (
  userId,
  data
) => {
  const professional =
    await Professional.findOne({
      user: userId,
    });

  if (!professional) {
    throw new Error(
      "Professional profile not found"
    );
  }

  const allowedFields = [
    "bio",
    "profileImage",
    "experienceYears",
    "phone",
    "serviceArea",
  ];

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      professional[field] = data[field];
    }
  });

  await professional.save();

  return professional;
};

module.exports = {
  getProfile,
  createProfile,
  updateProfile,
};