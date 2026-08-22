const User = require("../../models/user");
const Booking = require("../../models/booking");

const getCustomers = async ({
  page = 1,
  limit = 20,
  search = "",
  status,
}) => {
  page = Number(page);
  limit = Number(limit);

  const skip = (page - 1) * limit;

  const filter = {
    role: "CUSTOMER",
  };

  if (status) {
    filter.status = status;
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
        phone: {
          $regex: search.trim(),
          $options: "i",
        },
      },
      {
        email: {
          $regex: search.trim(),
          $options: "i",
        },
      },
    ];
  }

  const [customers, total] =
    await Promise.all([
      User.find(filter)
        .select(
          "name phone email status role createdAt"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit),

      User.countDocuments(filter),
    ]);

  return {
    customers,
    pagination: {
      page,
      limit,
      total,
      totalPages:
        Math.ceil(total / limit),
    },
  };
};

const getCustomerById = async (
  customerId
) => {
  const customer =
    await User.findOne({
      _id: customerId,
      role: "CUSTOMER",
    }).select(
      "name phone email status role createdAt updatedAt"
    );

  if (!customer) {
    throw new Error(
      "Customer not found"
    );
  }

  const bookings =
    await Booking.countDocuments({
      customer: customerId,
    });

  return {
    customer,
    statistics: {
      totalBookings: bookings,
    },
  };
};

const updateCustomerStatus = async (
  customerId,
  status
) => {
  if (
    !["ACTIVE", "BLOCKED"].includes(status)
  ) {
    throw new Error(
      "Invalid customer status"
    );
  }

  const customer =
    await User.findOne({
      _id: customerId,
      role: "CUSTOMER",
    });

  if (!customer) {
    throw new Error(
      "Customer not found"
    );
  }

  customer.status = status;

  await customer.save();

  return customer;
};

module.exports = {
  getCustomers,
  getCustomerById,
  updateCustomerStatus,
};