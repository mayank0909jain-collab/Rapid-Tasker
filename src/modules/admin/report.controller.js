const Booking =
  require("../../models/booking");

const User =
  require("../../models/User");

const Service =
  require("../../models/Service");

const getOverviewReport = async (
  req,
  res,
  next
) => {
  try {
    const [
      totalCustomers,
      totalProfessionals,
      totalServices,
      totalBookings,
      completedBookings,
      cancelledBookings,
      revenueResult,
    ] = await Promise.all([
      User.countDocuments({
        role: "CUSTOMER",
      }),

      User.countDocuments({
        role: "PROFESSIONAL",
      }),

      Service.countDocuments({
        isActive: true,
      }),

      Booking.countDocuments(),

      Booking.countDocuments({
        status: "COMPLETED",
      }),

      Booking.countDocuments({
        status: "CANCELLED",
      }),

      Booking.aggregate([
        {
          $match: {
            status: "COMPLETED",
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$price",
            },
          },
        },
      ]),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        customers: totalCustomers,
        professionals:
          totalProfessionals,
        services: totalServices,
        bookings: {
          total: totalBookings,
          completed:
            completedBookings,
          cancelled:
            cancelledBookings,
        },
        revenue:
          revenueResult[0]
            ?.totalRevenue || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getRevenueReport = async (
  req,
  res,
  next
) => {
  try {
    const revenue =
      await Booking.aggregate([
        {
          $match: {
            status: "COMPLETED",
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$bookingDate",
              },
            },

            revenue: {
              $sum: "$price",
            },

            bookings: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ]);

    return res.status(200).json({
      success: true,
      data: {
        revenue,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getTopServicesReport = async (
  req,
  res,
  next
) => {
  try {
    const services =
      await Booking.aggregate([
        {
          $match: {
            status: "COMPLETED",
          },
        },

        {
          $group: {
            _id: "$service",
            bookings: {
              $sum: 1,
            },

            revenue: {
              $sum: "$price",
            },
          },
        },

        {
          $sort: {
            bookings: -1,
          },
        },

        {
          $limit: 10,
        },

        {
          $lookup: {
            from: "services",
            localField: "_id",
            foreignField: "_id",
            as: "service",
          },
        },

        {
          $unwind: {
            path: "$service",
            preserveNullAndEmptyArrays:
              true,
          },
        },

        {
          $project: {
            _id: 0,

            serviceId: "$_id",

            serviceName:
              "$service.name",

            bookings: 1,

            revenue: 1,
          },
        },
      ]);

    return res.status(200).json({
      success: true,
      data: {
        services,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOverviewReport,
  getRevenueReport,
  getTopServicesReport,
};