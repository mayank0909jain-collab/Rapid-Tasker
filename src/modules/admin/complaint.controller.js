const complaintService =
  require("./complaint.service");

const getComplaints = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await complaintService.getComplaints({
        page: req.query.page,
        limit: req.query.limit,
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

const getComplaintById = async (
  req,
  res,
  next
) => {
  try {
    const complaint =
      await complaintService.getComplaintById(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      data: {
        complaint,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateComplaint = async (
  req,
  res,
  next
) => {
  try {
    const complaint =
      await complaintService.updateComplaint(
        req.params.id,
        req.user.userId,
        req.body.status,
        req.body.resolution
      );

    return res.status(200).json({
      success: true,
      message:
        "Complaint updated successfully",
      data: {
        complaint,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getComplaints,
  getComplaintById,
  updateComplaint,
};