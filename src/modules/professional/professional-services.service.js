const Professional =
  require("../../models/professional");

const ProfessionalService =
  require("../../models/professionalServices");

const Service =
  require("../../models/service");

const addService = async (
  userId,
  serviceId
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

  if (professional.status !== "ACTIVE") {
    throw new Error(
      "Professional account is not active"
    );
  }

  const service =
    await Service.findOne({
      _id: serviceId,
      isActive: true,
    });

  if (!service) {
    throw new Error("Service not found");
  }

  const existing =
    await ProfessionalService.findOne({
      professional: professional._id,
      service: serviceId,
    });

  if (existing) {
    if (existing.isActive) {
      throw new Error(
        "Service already added"
      );
    }

    existing.isActive = true;
    await existing.save();

    return existing;
  }

  return ProfessionalService.create({
    professional: professional._id,
    service: serviceId,
  });
};

const getServices = async (userId) => {
  const professional =
    await Professional.findOne({
      user: userId,
    });

  if (!professional) {
    throw new Error(
      "Professional profile not found"
    );
  }

  return ProfessionalService.find({
    professional: professional._id,
    isActive: true,
  }).populate(
    "service",
    "name description image price duration"
  );
};

const removeService = async (
  userId,
  serviceId
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

  const professionalService =
    await ProfessionalService.findOne({
      professional: professional._id,
      service: serviceId,
      isActive: true,
    });

  if (!professionalService) {
    throw new Error(
      "Professional does not provide this service"
    );
  }

  professionalService.isActive = false;

  await professionalService.save();

  return professionalService;
};

module.exports = {
  addService,
  getServices,
  removeService,
};