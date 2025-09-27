import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IAdmin extends Document {
  email: string;
  password?: string; // Make password optional
}

const AdminSchema: Schema<IAdmin> = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Check if the model already exists before defining it
const Admin: Model<IAdmin> = models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);

export default Admin;
