const kycService =
  require("./kyc.service");

const uploadDocument = async (
  req,
  res,
  next
) => {
  try {
    const document =
      await kycService.uploadDocument(
        req.user.userId,
        req.body
      );

    res.status(201).json({
      success: true,
      message:
        "KYC document uploaded successfully",
      data: {
        document,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getDocuments = async (
  req,
  res,
  next
) => {
  try {
    const documents =
      await kycService.getDocuments(
        req.user.userId
      );

    res.status(200).json({
      success: true,
      data: {
        documents,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
};