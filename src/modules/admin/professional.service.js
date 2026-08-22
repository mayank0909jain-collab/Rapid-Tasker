const Professional =
  require("../../models/professional");

const KycDocument =
  require("../../models/kycDocument");

const User = require("../../models/user");

const ProfessionalService =
  require("../../models/professionalServices");

const getProfessionals = async ({
  page = 1,
  limit = 20,
  search = "",
  status,
  kycStatus,
}) => {
  page = Number(page);
  limit = Number(limit);

  const skip = (page - 1) * limit;

  const filter = {};

  if (status) {
    filter.status = status;
  }

  if (kycStatus) {
    filter.kycStatus = kycStatus;
  }

  const professionals =
    await Professional.find(filter)
      .populate(
        "user",
        "name phone email status role"
      )
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);

  let filteredProfessionals =
    professionals;

  if (search.trim()) {
    const searchText =
      search.trim().toLowerCase();

    filteredProfessionals =
      professionals.filter(
        (professional) => {
          const user =
            professional.user;

          return (
            user?.name
              ?.toLowerCase()
              .includes(searchText) ||
            user?.phone
              ?.toLowerCase()
              .includes(searchText) ||
            user?.email
              ?.toLowerCase()
              .includes(searchText)
          );
        }
      );
  }

  const total =
    await Professional.countDocuments(
      filter
    );

  return {
    professionals:
      filteredProfessionals,

    pagination: {
      page,
      limit,
      total,
      totalPages:
        Math.ceil(total / limit),
    },
  };
};

const getProfessionalById = async (
  professionalId
) => {
  const professional =
    await Professional.findById(
      professionalId
    ).populate(
      "user",
      "name phone email status role createdAt"
    );

  if (!professional) {
    throw new Error(
      "Professional not found"
    );
  }

  const documents =
    await KycDocument.find({
      professional:
        professional._id,
    }).sort({
      createdAt: -1,
    });

  const services =
    await ProfessionalService.find({
      professional:
        professional._id,
      isActive: true,
    }).populate(
      "service",
      "name description price duration image"
    );

  return {
    professional,
    documents,
    services,
  };
};

const updateProfessionalStatus =
  async (
    professionalId,
    status
  ) => {
    const professional =
      await Professional.findById(
        professionalId
      );

    if (!professional) {
      throw new Error(
        "Professional not found"
      );
    }

    const allowedStatuses = [
      "ACTIVE",
      "SUSPENDED",
      "REJECTED",
    ];

    if (
      !allowedStatuses.includes(status)
    ) {
      throw new Error(
        "Invalid professional status"
      );
    }

    if (status === "ACTIVE") {
      if (
        professional.kycStatus !==
        "APPROVED"
      ) {
        throw new Error(
          "Professional KYC must be approved before activation"
        );
      }
    }

    professional.status = status;

    await professional.save();

    return professional;
  };

const updateKycStatus =
  async (
    documentId,
    status,
    rejectionReason
  ) => {
    if (
      !["APPROVED", "REJECTED"].includes(
        status
      )
    ) {
      throw new Error(
        "Invalid KYC status"
      );
    }

    const document =
      await KycDocument.findById(
        documentId
      );

    if (!document) {
      throw new Error(
        "KYC document not found"
      );
    }

    document.status = status;

    if (status === "REJECTED") {
      document.rejectionReason =
        rejectionReason ||
        "KYC document rejected";
    } else {
      document.rejectionReason =
        undefined;
    }

    await document.save();

    /*
     * Recalculate professional KYC status.
     */
    const documents =
      await KycDocument.find({
        professional:
          document.professional,
      });

    if (
      documents.length > 0 &&
      documents.every(
        (doc) =>
          doc.status === "APPROVED"
      )
    ) {
      await Professional.findByIdAndUpdate(
        document.professional,
        {
          kycStatus: "APPROVED",
        }
      );
    } else if (
      documents.some(
        (doc) =>
          doc.status === "REJECTED"
      )
    ) {
      await Professional.findByIdAndUpdate(
        document.professional,
        {
          kycStatus: "REJECTED",
        }
      );
    } else {
      await Professional.findByIdAndUpdate(
        document.professional,
        {
          kycStatus: "PENDING",
        }
      );
    }

    return document;
  };

module.exports = {
  getProfessionals,
  getProfessionalById,
  updateProfessionalStatus,
  updateKycStatus,
};