import { InferSchemaType, model, Model, models, Schema } from "mongoose";

const eventSchema = new Schema({
  artist: String,
  venu: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: "Venu",
  },
  description: String,
  date: Date,
  slug: {
    type: String,
    unique: true,
    index: true,
    required: true,
  },
});

export type Event = InferSchemaType<typeof eventSchema>;

const Event =
  (models.event as Model<Event>) || model<Event>("event", eventSchema);
export { eventSchema };
export default Event;
