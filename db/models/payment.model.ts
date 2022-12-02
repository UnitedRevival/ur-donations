import mongoose from 'mongoose';

interface Payment {
  amount: number;
  anonymous?: boolean;
  donationType: string;
  dateCreated?: Date;
}

const PaymentSchema = new mongoose.Schema<Payment>({
  amount: { type: Number, required: true },
  anonymous: { type: Boolean, required: true, default: false },
  donationType: { type: String, required: true },
  dateCreated: { type: Date, required: true, default: () => Date.now() },
});

const PaymentModel =
  mongoose.models.Payment || mongoose.model<Payment>('Payment', PaymentSchema);
export default PaymentModel;
