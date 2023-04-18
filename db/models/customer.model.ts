import mongoose from 'mongoose';

export interface Customer {
  dateCreated?: Date | number;
  name?: string;
  email?: string;
  stripeCustomer: string;
}

const CustomerSchema = new mongoose.Schema<Customer>({
  dateCreated: { type: Date, required: true, default: () => Date.now() },
  name: { type: String, required: false },
  email: { type: String, required: false },
  stripeCustomer: { type: String, required: true },
});

let existingModel = mongoose.models.Customer<Customer>;

const CustomerModel =
  existingModel || mongoose.model<Customer>('Customer', CustomerSchema);
export default CustomerModel;
