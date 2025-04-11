const { Schema, model } = require("mongoose");

const userSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        birthdate: { type: Date, required: true },
        phone: { type: String, required: true },
        password: { type: String, required: true },
        street: { type: String, required: true },
        zipCode: { type: String, required: true },
        residence: { type: String, required: true },
        balance: { type: Number, required: true },
        transactions: {
            type: [Schema.Types.ObjectId],
            ref: "Transaction",
        },
    },
    { timestamps: true }
);

const User = model("User", userSchema);

module.exports = User;
