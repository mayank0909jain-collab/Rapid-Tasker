const professionalService =
  require("./professional.service");

const getProfessionals = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await professionalService.getProfessionals(
        {
          page: req.query.page,
          limit: req.query.limit,
          search: req.query.search,
          status: req.query.status,
          kycStatus:
            req.query.kycStatus,
        }
      );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getProfessionalById = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await professionalService.getProfessionalById(
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

const updateProfessionalStatus =
  async (req, res, next) => {
    try {
      const professional =
        await professionalService.updateProfessionalStatus(
          req.params.id,
          req.body.status
        );

      return res.status(200).json({
        success: true,
        message:
          "Professional status updated successfully",
        data: {
          professional,
        },
      });
    } catch (error) {
      next(error);
    }
  };

const updateKycStatus =
  async (req, res, next) => {
    try {
      const document =
        await professionalService.updateKycStatus(
          req.params.id,
          req.body.status,
          req.body.rejectionReason
        );

      return res.status(200).json({
        success: true,
        message:
          "KYC status updated successfully",
        data: {
          document,
        },
      });
    } catch (error) {
      next(error);
    }
  };

module.exports = {
  getProfessionals,
  getProfessionalById,
  updateProfessionalStatus,
  updateKycStatus,
};