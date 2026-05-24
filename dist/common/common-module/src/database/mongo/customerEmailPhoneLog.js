import mongoose, { Schema } from 'mongoose';
import { CustomerInfoType } from '../../interfaces/customerEmailPhoneLog.interface';
var customerLogSchema = new Schema({
    customerId: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: Object.values(CustomerInfoType),
        required: true
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    otp: {
        type: Number,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});
export var customerLogModel = mongoose.model('emailphonelogs', customerLogSchema);

//# sourceMappingURL=customerEmailPhoneLog.js.map