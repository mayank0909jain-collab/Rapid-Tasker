const Service =
  require("../../models/Service");

const createService = async (data) => {
  const {
    name,
    description,
    category,
    price,
    duration,
    image,
  } = data;

  if (
    !name ||
    !category ||
    price === undefined ||
    duration === undefined
  ) {
    throw new Error(
      "Name, category, price and duration are required"
    );
  }

  if (Number(price) < 0) {
    throw new Error(
      "Price cannot be negative"
    );
  }

  if (Number(duration) <= 0) {
    throw new Error(
      "Duration must be greater than zero"
    );
  }

  const existing =
    await Service.findOne({
      name: {
        $regex: `^${name.trim()}$`,
        $options: "i",
      },
    });

  if (existing) {
    throw new Error(
      "Service already exists"
    );
  }

  return Service.create({
    name: name.trim(),
    description,
    category,
    price: Number(price),
    duration: Number(duration),
    image,
    isActive: true,
  });
};

const getServices = async ({
  page = 1,
  limit = 20,
  search = "",
  category,
  isActive,
}) => {
  page = Number(page);
  limit = Number(limit);

  const filter = {};

  if (category) {
    filter.category = category;
  }

  if (isActive !== undefined) {
    filter.isActive =
      isActive === "true" ||
      isActive === true;
  }

  if (search.trim()) {
    filter.$or = [
      {
        name: {
          $regex: search.trim(),
          $options: "i",
        },
      },
      {
        category: {
          $regex: search.trim(),
          $options: "i",
        },
      },
    ];
  }

  const skip = (page - 1) * limit;

  const [services, total] =
    await Promise.all([
      Service.find(filter)
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit),

      Service.countDocuments(filter),
    ]);

  return {
    services,

    pagination: {
      page,
      limit,
      total,
      totalPages:
        Math.ceil(total / limit),
    },
  };
};

const getServiceById = async (
  serviceId
) => {
  const service =
    await Service.findById(serviceId);

  if (!service) {
    throw new Error(
      "Service not found"
    );
  }

  return service;
};

const updateService = async (
  serviceId,
  data
) => {
  const service =
    await Service.findById(serviceId);

  if (!service) {
    throw new Error(
      "Service not found"
    );
  }

  const allowedFields = [
    "name",
    "description",
    "category",
    "price",
    "duration",
    "image",
  ];

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      service[field] = data[field];
    }
  }

  if (
    service.price < 0
  ) {
    throw new Error(
      "Price cannot be negative"
    );
  }

  if (
    service.duration <= 0
  ) {
    throw new Error(
      "Duration must be greater than zero"
    );
  }

  await service.save();

  return service;
};

const updateServiceStatus =
  async (
    serviceId,
    isActive
  ) => {
    const service =
      await Service.findById(
        serviceId
      );

    if (!service) {
      throw new Error(
        "Service not found"
      );
    }

    service.isActive =
      Boolean(isActive);

    await service.save();

    return service;
  };

module.exports = {
  createService,
  getServices,
  getServiceById,
  updateService,
  updateServiceStatus,
};