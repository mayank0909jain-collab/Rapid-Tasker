const Address = require("../../models/address");

const createAddress = async (customerId, data) => {
  const {
    label,
    fullAddress,
    city,
    state,
    pincode,
    landmark,
    latitude,
    longitude,
    isDefault,
  } = data;

  if (isDefault) {
    await Address.updateMany(
      {
        customer: customerId,
        isActive: true,
      },
      {
        isDefault: false,
      }
    );
  }

  const address = await Address.create({
    customer: customerId,
    label,
    fullAddress,
    city,
    state,
    pincode,
    landmark,
    latitude,
    longitude,
    isDefault,
  });

  return address;
};

const getAddresses = async (customerId) => {
  return Address.find({
    customer: customerId,
    isActive: true,
  }).sort({
    isDefault: -1,
    createdAt: -1,
  });
};

const getAddressById = async (customerId, addressId) => {
  const address = await Address.findOne({
    _id: addressId,
    customer: customerId,
    isActive: true,
  });

  if (!address) {
    throw new Error("Address not found");
  }

  return address;
};

const updateAddress = async (
  customerId,
  addressId,
  data
) => {
  const address = await getAddressById(
    customerId,
    addressId
  );

  if (data.isDefault === true) {
    await Address.updateMany(
      {
        customer: customerId,
        isActive: true,
        _id: {
          $ne: addressId,
        },
      },
      {
        isDefault: false,
      }
    );
  }

  const allowedFields = [
    "label",
    "fullAddress",
    "city",
    "state",
    "pincode",
    "landmark",
    "latitude",
    "longitude",
    "isDefault",
  ];

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      address[field] = data[field];
    }
  });

  await address.save();

  return address;
};

const deleteAddress = async (
  customerId,
  addressId
) => {
  const address = await getAddressById(
    customerId,
    addressId
  );

  address.isActive = false;

  await address.save();

  return address;
};

module.exports = {
  createAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
};