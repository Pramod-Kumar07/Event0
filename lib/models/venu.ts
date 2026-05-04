import { InferSchemaType, Model, model, models, Schema } from "mongoose";

const venuSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Enter venu name."],
      unique: true,
    },
    address: {
      type: String,
      required: [true, "Enter venu address."],
    },
    state: {
      type: String,
      required: [true, "Enter venu state."],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export type Venu = InferSchemaType<typeof venuSchema>;

const Venu = (models.venu as Model<Venu>) || model<Venu>("venu", venuSchema);
export { venuSchema };
export default Venu;
