import { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  role: "Client" | "Admin";
  phone: string;
  tokenVersion: number;
  lastLoginAt: Date | null;
  lastLoginIp: string;
  lastLoginUa: string;
  lastLoginAlertAt: Date | null;
  resetToken: string | null;
  resetTokenExpires: Date | null;
  emailNotifications: boolean;
  comparePassword(plainPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, minLength: 2, unique: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /\@[a-zA-Z]+.[a-zA-Z]+$/,
    minLength: 6,
  },
  password: { type: String, required: true, minLength: 6, trim: true },
  role: { type: String, required: true, enum: ["Client", "Admin"], default: "Client" },
  phone: { type: String, required: true, trim: true },
  tokenVersion: { type: Number, default: 0 },
  lastLoginAt: { type: Date, default: null },
  lastLoginIp: { type: String, default: "" },
  lastLoginUa: { type: String, default: "" },
  lastLoginAlertAt: { type: Date, default: null },
  resetToken: { type: String, default: null },
  resetTokenExpires: { type: Date, default: null },
  emailNotifications: { type: Boolean, default: true },
}, {
  timestamps: { createdAt: "createdAt" },
  versionKey: false,
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function (plainPassword: string) {
  return bcrypt.compare(plainPassword, this.password);
};

const User = model<IUser>("User", userSchema);
export default User;
