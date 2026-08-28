const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");

const User = require("../../models/user");
const Otp = require("../../models/otp");

const { sendOtpEmail } = require("../../utils/mailer");

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
};

const sendOtp = async ({ phone, email }) => {
  if (!phone && !email) {
    throw new Error("Phone number or email is required");
  }

  const otp = otpGenerator.generate(6, {
    digits: true,
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  const query = phone ? { phone } : { email };

  await Otp.deleteMany(query);

  await Otp.create({
    ...query,
    otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes validity
  });

  if (email) {
    await sendOtpEmail(email, otp);
    console.log(`OTP sent to email ${email}: ${otp}`);
  } else {
    // Development only for phone
    console.log(`OTP for phone ${phone}: ${otp}`);
  }

  return {
    message: "OTP sent successfully",
  };
};

const verifyOtp = async ({ phone, email }, otp, role = "CUSTOMER") => {
  if (!phone && !email) {
    throw new Error("Phone number or email is required");
  }

  const query = phone ? { phone, otp } : { email, otp };
  const otpRecord = await Otp.findOne(query);

  if (!otpRecord) {
    throw new Error("Invalid OTP");
  }

  if (otpRecord.expiresAt < new Date()) {
    await Otp.deleteOne({ _id: otpRecord._id });
    throw new Error("OTP expired");
  }

  const userQuery = phone ? { phone } : { email };
  let user = await User.findOne(userQuery);

  if (!user) {
    user = await User.create({
      ...userQuery,
      role: role || "CUSTOMER",
    });
  } else {
    // If a specific role was requested for login (e.g., ADMIN panel)
    // and the user exists but does not have that role, deny access.
    if (role && user.role !== role) {
      throw new Error(`Access denied. This account does not have ${role} privileges.`);
    }
  }

  await Otp.deleteOne({ _id: otpRecord._id });

  const token = generateToken(user);

  return {
    token,
    user,
  };
};

const getCurrentUser = async (userId) => {
  const user = await User.findById(userId).select("-__v");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

module.exports = {
  sendOtp,
  verifyOtp,
  getCurrentUser
};