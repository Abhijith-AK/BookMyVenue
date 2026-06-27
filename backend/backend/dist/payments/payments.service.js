"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const razorpay_1 = __importDefault(require("razorpay"));
const payment_entity_1 = require("./payment.entity");
const typeorm_2 = require("typeorm");
const payment_enum_1 = require("./enums/payment.enum");
const crypto = __importStar(require("crypto"));
const bookings_service_1 = require("../bookings/bookings.service");
let PaymentsService = class PaymentsService {
    dataSource;
    paymentRepository;
    bookingService;
    razorpay;
    constructor(dataSource, paymentRepository, bookingService) {
        this.dataSource = dataSource;
        this.paymentRepository = paymentRepository;
        this.bookingService = bookingService;
        this.razorpay = new razorpay_1.default({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
    }
    async createOrder(amount, receipt) {
        return await this.razorpay.orders.create({
            amount: Math.round(amount * 100),
            currency: "INR",
            receipt,
        });
    }
    async createPaymentRecord(bookingId, razorpayOrderId, amount) {
        const paymentRecord = this.paymentRepository.create({
            bookingId,
            razorpayOrderId,
            amount,
            status: payment_enum_1.PaymentStatus.PENDING
        });
        await this.paymentRepository.save(paymentRecord);
        return paymentRecord;
    }
    async verifyPayment(verifyPaymentDto) {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = verifyPaymentDto;
        const paymentRecord = await this.paymentRepository.findOne({ where: { razorpayOrderId: razorpay_order_id } });
        if (!paymentRecord)
            throw new common_1.BadRequestException(`Invalid OrderID ${razorpay_order_id}`);
        if (paymentRecord.status === payment_enum_1.PaymentStatus.PAID) {
            return true;
        }
        if (paymentRecord.status === payment_enum_1.PaymentStatus.FAILED) {
            throw new common_1.BadRequestException("Payment already failed");
        }
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");
        if (expectedSignature !== razorpay_signature) {
            await this.dataSource.transaction(async (manager) => {
                const paymentRepository = manager.getRepository(payment_entity_1.Payment);
                paymentRecord.razorpayPaymentId = razorpay_payment_id;
                paymentRecord.status = payment_enum_1.PaymentStatus.FAILED;
                await this.bookingService.failedBooking(paymentRecord.bookingId, manager);
                await paymentRepository.save(paymentRecord);
            });
            throw new common_1.BadRequestException("Invalid Payment Signature");
        }
        await this.dataSource.transaction(async (manager) => {
            const paymentRepository = manager.getRepository(payment_entity_1.Payment);
            paymentRecord.razorpayPaymentId = razorpay_payment_id;
            paymentRecord.status = payment_enum_1.PaymentStatus.PAID;
            await this.bookingService.confirmedBooking(paymentRecord.bookingId, manager);
            await paymentRepository.save(paymentRecord);
        });
        return true;
    }
    async failedPayment(orderId, user) {
        const paymentRecord = await this.paymentRepository.findOne({ where: { razorpayOrderId: orderId } });
        if (!paymentRecord)
            throw new common_1.BadRequestException(`Invalid Order ${orderId}`);
        const booking = await this.bookingService.getBookingById(paymentRecord.bookingId);
        if (user) {
            if (booking.customerId !== user.id)
                throw new common_1.ForbiddenException();
        }
        if (paymentRecord.status === payment_enum_1.PaymentStatus.FAILED)
            return true;
        if (paymentRecord.status === payment_enum_1.PaymentStatus.PAID)
            throw new common_1.BadRequestException("Payment already completed");
        await this.dataSource.transaction(async (manager) => {
            const paymentRepository = manager.getRepository(payment_entity_1.Payment);
            paymentRecord.status = payment_enum_1.PaymentStatus.FAILED;
            await this.bookingService.failedBooking(paymentRecord.bookingId, manager);
            await paymentRepository.save(paymentRecord);
        });
        return true;
    }
    async refundPayment(bookingId, refundAmount, reason) {
        const payment = await this.paymentRepository.findOne({ where: { bookingId, status: payment_enum_1.PaymentStatus.PAID } });
        if (!payment)
            throw new common_1.NotFoundException("Payment not found!");
        const refund = await this.razorpay.payments.refund(payment.razorpayPaymentId, { amount: Math.round(refundAmount * 100) });
        if (refund.status === "processed" || refund.status === "pending") {
            await this.dataSource.transaction(async (manager) => {
                const paymentRepository = manager.getRepository(payment_entity_1.Payment);
                payment.razorpayRefundId = refund.id;
                payment.refundedAmount = refundAmount;
                payment.status = payment_enum_1.PaymentStatus.REFUNDED;
                await this.bookingService.updateCancelledBooking(payment.bookingId, manager, reason);
                await paymentRepository.save(payment);
            });
        }
        else {
            throw new common_1.ConflictException(`Refund process failed, Try again later.`);
        }
        return refund;
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __param(1, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => bookings_service_1.BookingsService))),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        typeorm_2.Repository,
        bookings_service_1.BookingsService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map