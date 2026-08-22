const Complaint =
  require("../../models/complaint");

const getComplaints = async ({
  page = 1,
  limit = 20,
  status,
}) => {
  page = Number(page);
  limit = Number(limit);

  const filter = {};

  if (status) {
    filter.status = status;
  }

  const skip = (page - 1) * limit;

  const [
    complaints,
    total,
  ] = await Promise.all([
    Complaint.find(filter)
      .populate(
        "customer",
        "name phone email"
      )
      .populate(
        "professional",
        "name phone email"
      )
      .populate(
        "booking",
        "bookingDate price status"
      )
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit),

    Complaint.countDocuments(filter),
  ]);

  return {
    complaints,

    pagination: {
      page,
      limit,
      total,
      totalPages:
        Math.ceil(total / limit),
    },
  };
};

const getComplaintById = async (
  complaintId
) => {
  const complaint =
    await Complaint.findById(
      complaintId
    )
      .populate(
        "customer",
        "name phone email"
      )
      .populate(
        "professional",
        "name phone email"
      )
      .populate(
        "booking"
      )
      .populate(
        "resolvedBy",
        "name role"
      );

  if (!complaint) {
    throw new Error(
      "Complaint not found"
    );
  }

  return complaint;
};

const updateComplaint = async (
  complaintId,
  adminId,
  status,
  resolution
) => {
  const complaint =
    await Complaint.findById(
      complaintId
    );

  if (!complaint) {
    throw new Error(
      "Complaint not found"
    );
  }

  const allowedStatuses = [
    "OPEN",
    "IN_PROGRESS",
    "RESOLVED",
    "CLOSED",
  ];

  if (
    !allowedStatuses.includes(status)
  ) {
    throw new Error(
      "Invalid complaint status"
    );
  }

  complaint.status = status;

  if (resolution !== undefined) {
    complaint.resolution =
      resolution;
  }

  if (
    status === "RESOLVED" ||
    status === "CLOSED"
  ) {
    complaint.resolvedBy = adminId;
  }

  await complaint.save();

  return complaint;
};

module.exports = {
  getComplaints,
  getComplaintById,
  updateComplaint,
};