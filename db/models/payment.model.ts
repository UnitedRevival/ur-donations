import mongoose from 'mongoose';

export interface Payment {
  amount: number;
  anonymous?: boolean;
  donationType: string;
  dateCreated: Date | number;
}

const PaymentSchema = new mongoose.Schema<Payment>({
  amount: { type: Number, required: true },
  anonymous: { type: Boolean, required: true, default: false },
  donationType: { type: String, required: true },
  dateCreated: { type: Date, required: true, default: () => Date.now() },
});

let existingModel = mongoose.models.Payment<Payment>;

const PaymentModel =
  existingModel || mongoose.model<Payment>('Payment', PaymentSchema);
export default PaymentModel;
