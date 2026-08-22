const professionalService =
  require("./professional-services.service");

const addService = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await professionalService.addService(
        req.user.userId,
        req.body.serviceId
      );

    res.status(201).json({
      success: true,
      message: "Service added successfully",
      data: {
        service: result,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getServices = async (
  req,
  res,
  next
) => {
  try {
    const services =
      await professionalService.getServices(
        req.user.userId
      );

    res.status(200).json({
      success: true,
      data: {
        services,
      },
    });
  } catch (error) {
    next(error);
  }
};

const removeService = async (
  req,
  res,
  next
) => {
  try {
    await professionalService.removeService(
      req.user.userId,
      req.params.serviceId
    );

    res.status(200).json({
      success: true,
      message: "Service removed successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addService,
  getServices,
  removeService,
};