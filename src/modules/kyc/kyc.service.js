const KycDocument =
  require("../../models/kycDocument");

const Professional =
  require("../../models/professional");

const uploadDocument = async (
  userId,
  data
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

  const document =
    await KycDocument.create({
      professional: professional._id,
      documentType: data.documentType,
      documentUrl: data.documentUrl,
    });

  professional.kycStatus = "PENDING";

  await professional.save();

  return document;
};

const getDocuments = async (userId) => {
  const professional =
    await Professional.findOne({
      user: userId,
    });

  if (!professional) {
    throw new Error(
      "Professional profile not found"
    );
  }

  return KycDocument.find({
    professional: professional._id,
  }).sort({
    createdAt: -1,
  });
};

module.exports = {
  uploadDocument,
  getDocuments,
};