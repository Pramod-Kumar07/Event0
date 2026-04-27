import {
  model,
  models,
  Schema,
  type InferSchemaType,
  type Model,
} from "mongoose";

export const USER_NAME_PATTERN = /^[A-Za-z]+$/;
export const USER_CONTACT_PATTERN = /^[0-9]{10}$/;

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      validate: {
        validator: (value: string) =>
          value === "" || USER_NAME_PATTERN.test(value),
        message: "Enter a valid first name",
      },
    },
    lastname: {
      type: String,
      trim: true,
      default: "",
      validate: {
        validator: (value: string) =>
          value === "" || USER_NAME_PATTERN.test(value),
        message: "Enter a valid last name",
      },
    },
    contactnumber: {
      type: String,
      trim: true,
      default: "",
      validate: {
        validator: (value: string) =>
          value === "" || USER_CONTACT_PATTERN.test(value),
        message: "Enter a valid 10 digit contact number",
      },
    },
    dob: {
      type: Date,
      required: [true, "Date of birth is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export type User = InferSchemaType<typeof userSchema>;

export type SignInSchema = Pick<User, "email" | "password">;

export type SignUpSchema = {
  firstname: string;
  lastname?: string;
  contactnumber?: string;
  dob: string;
  email: string;
  password: string;
};

const UserModel =
  (models.User as Model<User>) || model<User>("User", userSchema);

export { userSchema };
export default UserModel;
