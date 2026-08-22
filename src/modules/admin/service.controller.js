const serviceService =
  require("./services.service");

const createService = async (
  req,
  res,
  next
) => {
  try {
    const service =
      await serviceService.createService(
        req.body
      );

    return res.status(201).json({
      success: true,
      message:
        "Service created successfully",
      data: {
        service,
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
    const result =
      await serviceService.getServices({
        page: req.query.page,
        limit: req.query.limit,
        search: req.query.search,
        category: req.query.category,
        isActive: req.query.isActive,
      });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getServiceById = async (
  req,
  res,
  next
) => {
  try {
    const service =
      await serviceService.getServiceById(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      data: {
        service,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateService = async (
  req,
  res,
  next
) => {
  try {
    const service =
      await serviceService.updateService(
        req.params.id,
        req.body
      );

    return res.status(200).json({
      success: true,
      message:
        "Service updated successfully",
      data: {
        service,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateServiceStatus =
  async (req, res, next) => {
    try {
      const service =
        await serviceService.updateServiceStatus(
          req.params.id,
          req.body.isActive
        );

      return res.status(200).json({
        success: true,
        message:
          "Service status updated successfully",
        data: {
          service,
        },
      });
    } catch (error) {
      next(error);
    }
  };

module.exports = {
  createService,
  getServices,
  getServiceById,
  updateService,
  updateServiceStatus,
};