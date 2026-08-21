const Service = require("../../models/Service");

const createService = async (data) => {
  const {
    category,
    name,
    description,
    image,
    price,
    duration,
  } = data;

  const service = await Service.create({
    category,
    name,
    description,
    image,
    price,
    duration,
  });

  return service;
};

const getServices = async (categoryId) => {
  const filter = {
    isActive: true,
  };

  if (categoryId) {
    filter.category = categoryId;
  }

  return Service.find(filter)
    .populate("category", "name")
    .sort({ createdAt: -1 });
};

const getServiceById = async (serviceId) => {
  const service = await Service.findOne({
    _id: serviceId,
    isActive: true,
  }).populate("category", "name");

  if (!service) {
    throw new Error("Service not found");
  }

  return service;
};

const updateService = async (serviceId, data) => {
  const service = await Service.findByIdAndUpdate(
    serviceId,
    data,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!service) {
    throw new Error("Service not found");
  }

  return service;
};

const deleteService = async (serviceId) => {
  const service = await Service.findByIdAndUpdate(
    serviceId,
    {
      isActive: false,
    },
    {
      new: true,
    }
  );

  if (!service) {
    throw new Error("Service not found");
  }

  return service;
};

module.exports = {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
};