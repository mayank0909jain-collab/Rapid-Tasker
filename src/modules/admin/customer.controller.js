const customerService =
  require("./customer.service");

const getCustomers = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await customerService.getCustomers({
        page: req.query.page,
        limit: req.query.limit,
        search: req.query.search,
        status: req.query.status,
      });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getCustomerById = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await customerService.getCustomerById(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateCustomerStatus = async (
  req,
  res,
  next
) => {
  try {
    const customer =
      await customerService.updateCustomerStatus(
        req.params.id,
        req.body.status
      );

    return res.status(200).json({
      success: true,
      message:
        "Customer status updated successfully",
      data: {
        customer,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCustomers,
  getCustomerById,
  updateCustomerStatus,
};