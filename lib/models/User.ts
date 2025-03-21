import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUser extends mongoose.Document {
  userId: string;
  email: string;
  name?: string;
  password?: string;
  image?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  wishlist: string[];
  orders: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// Function to generate sequential number with leading zeros
function generateSequentialNumber() {
  return Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
}

// Function to generate readable userId
function generateUserId() {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2); // Last 2 digits of year
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const sequential = generateSequentialNumber();

  // Format: WM-YYMMDD-XXXX (e.g., WM-240215-0001)
  return `BSM-${year}${month}${day}-${sequential}`;
}

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    default: generateUserId,
  },
  email: { type: String, required: true, unique: true },
  name: { type: String },
  password: { type: String, select: false },
  image: { type: String },
  phone: { type: String },
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
  wishlist: { type: [String], default: [] },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Create a compound index for userId to ensure uniqueness

userSchema.pre('save', async function (this: IUser, next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string,
) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export default User;
