const { Schema, model } = require("mongoose");

const transferSchema = new Schema(
  {
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    fee: {
      type: Number,
      required: true,
    },
    netto: {
      type: Number,
      required: true,
    },
    brutto: {
        type: Number,
        required: true,
      },
    description: String,
    createdDate: Number,
    processed: {
      type: Boolean,
      required: true,
    }
  },
  { timestamps: true }
);

const Transfer = model("Transfer", transferSchema);

module.exports = Transfer;
