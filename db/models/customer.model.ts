import mongoose from 'mongoose';

export interface Customer {
  dateCreated?: Date | number;
  name?: string;
  email?: string;
  stripeCustomer: string;
  activeSubscriptions?: string[]; // Array of active subscription IDs
  subscriptionHistory?: {
    subscriptionId: string;
    status: string;
    createdAt: Date | number;
    canceledAt?: Date | number;
  }[];
  metadata?: {
    [key: string]: any;
  };
}

const CustomerSchema = new mongoose.Schema<Customer>({
  dateCreated: { type: Date, required: true, default: () => Date.now() },
  name: { type: String, required: false },
  email: { type: String, required: false },
  stripeCustomer: { type: String, required: true },
  activeSubscriptions: { type: [String], required: false, default: [] },
  subscriptionHistory: {
    type: [{
      subscriptionId: { type: String, required: true },
      status: { type: String, required: true },
      createdAt: { type: Date, required: true, default: () => Date.now() },
      canceledAt: { type: Date, required: false }
    }],
    required: false,
    default: []
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    required: false,
    default: {}
  }
});

let existingModel = mongoose.models.Customer<Customer>;

const CustomerModel =
  existingModel || mongoose.model<Customer>('Customer', CustomerSchema);
export default CustomerModel;
