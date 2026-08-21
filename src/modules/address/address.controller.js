const addressService = require("./address.service");

const createAddress = async (req, res, next) => {
  try {
    const address = await addressService.createAddress(
      req.user.userId,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Address created successfully",
      data: {
        address,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAddresses = async (req, res, next) => {
  try {
    const addresses = await addressService.getAddresses(
      req.user.userId
    );

    res.status(200).json({
      success: true,
      data: {
        addresses,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAddressById = async (req, res, next) => {
  try {
    const address = await addressService.getAddressById(
      req.user.userId,
      req.params.id
    );

    res.status(200).json({
      success: true,
      data: {
        address,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateAddress = async (req, res, next) => {
  try {
    const address = await addressService.updateAddress(
      req.user.userId,
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: {
        address,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteAddress = async (req, res, next) => {
  try {
    await addressService.deleteAddress(
      req.user.userId,
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
};