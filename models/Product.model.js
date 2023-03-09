const { Schema, model } = require("mongoose");

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "title is required."],
    },
    category: {
      type: String,
    },
    condition: {
      type: String,
    },
    price: {
      type: Number,
      required: [true, "Preis is required."],
    },
    description: {
      type: String,
      required: [true, "Description is required."],
    },
    imageUrl: {
      type: String,
      required: [true, "Image is required."],
    },
    postcode: {
      type: Number,
      required: [true, "Image is required."],
    },
    address: {
      type: String,
    },
    userName: {
      type: String,
      required: [true],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Product = model("Product", productSchema);

module.exports = Product;
