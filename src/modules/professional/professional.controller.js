const professionalService =
  require("./professional.service");

const getProfile = async (
  req,
  res,
  next
) => {
  try {
    const professional =
      await professionalService.getProfile(
        req.user.userId
      );

    res.status(200).json({
      success: true,
      data: {
        professional,
      },
    });
  } catch (error) {
    next(error);
  }
};

const createProfile = async (
  req,
  res,
  next
) => {
  try {
    const professional =
      await professionalService.createProfile(
        req.user.userId,
        req.body
      );

    res.status(201).json({
      success: true,
      message:
        "Professional profile created successfully",
      data: {
        professional,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (
  req,
  res,
  next
) => {
  try {
    const professional =
      await professionalService.updateProfile(
        req.user.userId,
        req.body
      );

    res.status(200).json({
      success: true,
      message:
        "Professional profile updated successfully",
      data: {
        professional,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  createProfile,
  updateProfile,
};