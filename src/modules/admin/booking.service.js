const Booking = require("../../models/booking");
const BookingStatusHistory = require("../../models/bookingStatusHistory");
const Professional = require("../../models/professional");

const getBookings = async ({
    page = 1,
    limit = 20,
    status,
    professional,
    customer,
    date,
}) => {
    page = Number(page);
    limit = Number(limit);

    if (page < 1) {
        throw new Error("Page must be greater than 0");
    }

    if (limit < 1 || limit > 100) {
        throw new Error("Limit must be between 1 and 100");
    }

    const filter = {};

    if (status) {
        filter.status = status;
    }

    if (professional) {
        filter.professional = professional;
    }

    if (customer) {
        filter.customer = customer;
    }

    if (date) {
        const start = new Date(date);

        if (Number.isNaN(start.getTime())) {
            throw new Error("Invalid booking date");
        }

        start.setHours(0, 0, 0, 0);

        const end = new Date(start);
        end.setDate(end.getDate() + 1);

        filter.bookingDate = {
            $gte: start,
            $lt: end,
        };
    }

    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
        Booking.find(filter)
            .populate(
                "customer",
                "name phone email"
            )
            .populate(
                "professional",
                "name phone email"
            )
            .populate(
                "service",
                "name description price duration image"
            )
            .populate("address")
            .sort({
                bookingDate: -1,
            })
            .skip(skip)
            .limit(limit),

        Booking.countDocuments(filter),
    ]);

    return {
        bookings,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};


const getBookingById = async (bookingId) => {
    const booking = await Booking.findById(
        bookingId
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
            "service",
            "name description price duration image"
        )
        .populate("address");

    if (!booking) {
        throw new Error("Booking not found");
    }

    let history = [];

    if (BookingStatusHistory) {
        history = await BookingStatusHistory.find({
            booking: booking._id,
        })
            .populate(
                "changedBy",
                "name role"
            )
            .sort({
                createdAt: 1,
            });
    }

    return {
        booking,
        history,
    };
};


const assignBooking = async (
    bookingId,
    professionalId,
    adminId
) => {
    /*
     * 1. Find booking
     */
    const booking = await Booking.findById(
        bookingId
    );

    if (!booking) {
        throw new Error("Booking not found");
    }

    /*
     * 2. Check booking status
     *
     * Admin should not assign a professional
     * after the booking has already progressed.
     */
    const allowedStatuses = [
        "PENDING",
        "CONFIRMED",
    ];

    if (
        !allowedStatuses.includes(
            booking.status
        )
    ) {
        throw new Error(
            `Booking cannot be assigned when status is ${booking.status}`
        );
    }

    /*
     * 3. Find Professional profile
     */
    const professional =
        await Professional.findById(
            professionalId
        ).populate(
            "user",
            "name phone email role isActive"
        );

    if (!professional) {
        throw new Error(
            "Professional not found"
        );
    }

    /*
     * 4. Check professional status
     */
    if (
        professional.status !== "ACTIVE"
    ) {
        throw new Error(
            "Professional is not active"
        );
    }

    /*
     * 5. Check KYC
     */
    if (
        professional.kycStatus !==
        "APPROVED"
    ) {
        throw new Error(
            "Professional KYC is not approved"
        );
    }

    /*
     * 6. Check linked User
     */
    if (!professional.user) {
        throw new Error(
            "Professional user account not found"
        );
    }

    if (
        professional.user.role !==
        "PROFESSIONAL"
    ) {
        throw new Error(
            "Linked user is not a professional"
        );
    }

    if (
        professional.user.isActive !== true
    ) {
        throw new Error(
            "Professional user account is inactive"
        );
    }

    /*
     * 7. Assign professional
     *
     * IMPORTANT:
     *
     * Booking.professional references User.
     *
     * Therefore:
     *
     * booking.professional = professional.user._id
     *
     * NOT:
     *
     * booking.professional = professional._id
     */
    booking.professional =
        professional.user._id;

    /*
     * 8. Change booking status
     */
    booking.status = "ASSIGNED";

    /*
     * 9. Save booking
     */
    await booking.save();

    /*
     * 10. Create booking history
     */
    await BookingStatusHistory.create({
        booking: booking._id,
        status: "ASSIGNED",
        changedBy: adminId,
        note:
            "Professional assigned by admin",
    });

    return booking;
};


const cancelBooking = async (
    bookingId,
    adminId,
    reason
) => {
    const booking = await Booking.findById(
        bookingId
    );

    if (!booking) {
        throw new Error("Booking not found");
    }

    /*
     * Admin can cancel only bookings
     * that haven't been completed/rejected/cancelled.
     */
    const cancellableStatuses = [
        "PENDING",
        "CONFIRMED",
        "ASSIGNED",
        "ACCEPTED",
        "ON_THE_WAY",
        "STARTED",
    ];

    if (
        !cancellableStatuses.includes(
            booking.status
        )
    ) {
        throw new Error(
            `Booking cannot be cancelled when status is ${booking.status}`
        );
    }

    booking.status = "CANCELLED";

    booking.cancelledBy = "ADMIN";

    booking.cancellationReason =
        reason?.trim() ||
        "Cancelled by admin";

    await booking.save();

    await BookingStatusHistory.create({
        booking: booking._id,
        status: "CANCELLED",
        changedBy: adminId,
        note:
            reason?.trim() ||
            "Cancelled by admin",
    });

    return booking;
};


module.exports = {
    getBookings,
    getBookingById,
    assignBooking,
    cancelBooking,
};