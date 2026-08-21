const serviceService = require("./services.service");

const createService = async (req, res, next) => {
  try {
    const service = await serviceService.createService(req.body);

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: {
        service,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getServices = async (req, res, next) => {
  try {
    const services = await serviceService.getServices(
      req.query.category
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

const getServiceById = async (req, res, next) => {
  try {
    const service = await serviceService.getServiceById(
      req.params.id
    );

    res.status(200).json({
      success: true,
      data: {
        service,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateService = async (req, res, next) => {
  try {
    const service = await serviceService.updateService(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: {
        service,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteService = async (req, res, next) => {
  try {
    const service = await serviceService.deleteService(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Service deactivated successfully",
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
  deleteService,
};