"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceType = exports.BookingStatus = void 0;
var BookingStatus;
(function (BookingStatus) {
    BookingStatus["PENDING"] = "PENDING";
    BookingStatus["CONFIRMED"] = "CONFIRMED";
    BookingStatus["FAILED"] = "FAILED";
    BookingStatus["CANCELLED"] = "CANCELLED";
    BookingStatus["COMPLETED"] = "COMPLETED";
})(BookingStatus || (exports.BookingStatus = BookingStatus = {}));
var PriceType;
(function (PriceType) {
    PriceType["FIXED"] = "FIXED";
    PriceType["PER_UNIT"] = "PER_UNIT";
})(PriceType || (exports.PriceType = PriceType = {}));
//# sourceMappingURL=booking.enums.js.map