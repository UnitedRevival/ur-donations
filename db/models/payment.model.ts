import mongoose from 'mongoose';

export interface Payment {
  amount: number;
  anonymous?: boolean;
  donationType: string;
  dateCreated: Date | number;
  name?: string;
  email?: string;
  referenceId?: string; // For tracking invoice IDs, subscription IDs etc.
}

const PaymentSchema = new mongoose.Schema<Payment>({
  amount: { type: Number, required: true },
  anonymous: { type: Boolean, required: true, default: false },
  donationType: { type: String, required: true },
  dateCreated: { type: Date, required: true, default: () => Date.now() },
  name: { type: String, required: false },
  email: { type: String, required: false },
  referenceId: { type: String, required: false }, // For tracking invoice IDs
});

let existingModel = mongoose.models.Payment<Payment>;

const PaymentModel =
  existingModel || mongoose.model<Payment>('Payment', PaymentSchema);
export default PaymentModel;
