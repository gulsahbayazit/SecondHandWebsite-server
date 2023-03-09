const router = require("express").Router();
const Product = require("../models/Product.model");
const User = require("../models/User.model");
const fileUploader = require("../config/cloudinary.config");
const mongoose = require("mongoose");

router.post("/upload", fileUploader.single("imageUrl"), (req, res, next) => {
  console.log(req.file);

  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }

  res.json({ imageUrl: req.file.path });
});

router.post("/add-product", (req, res, next) => {
  const {
    title,
    category,
    condition,
    price,
    description,
    postcode,
    address,
    userName,
    imageUrl,
    userId,
  } = req.body;

  console.log(req.body);

  Product.create({
    title,
    category,
    condition,
    price,
    description,
    imageUrl,
    postcode,
    address,
    userName,
    user: userId,
  })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

router.get("/profile", (req, res, next) => {
  Product.find({ userName: req.payload.userName })

    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

router.get("/products", (req, res, next) => {
  Product.find()
    .then((allProducts) => res.json(allProducts))
    .catch((err) => res.json(err));
});

router.get("/products/:productId", (req, res, next) => {
  const { productId } = req.params;

  Product.findById(productId)
    .populate("user")
    .then((product) => {
      console.log(product);
      res.status(200).json(product);
    })
    .catch((error) => res.json(error));
});

//Update Product by Id
router.put("/products/:productId", (req, res, next) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }
  Product.findByIdAndUpdate(productId, req.body, { new: true })
    .then((updateProduct) => res.json(updateProduct))
    .catch((error) => res.json(error));
});
//Delete Product by Id
router.delete("/products/:productId", (req, res, next) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Product.findByIdAndRemove(productId)
    .then(() =>
      res.json({ message: `Product with ${productId} is deleted successfully` })
    )
    .catch((error) => res.json(error));
});
//Buy Product by Id

router.post("/purchase", async (req, res) => {
  const { user, price, buyerName, id } = req.body;
  console.log(user);
  User.findOne({ userName: buyerName })
    .then((buyer) => {
      if (buyer == null) {
        return res.status(400).json({ message: "user not exist" });
      } else {
        let buyerid = buyer._id;
        console.log(buyerid.bu);
        if (buyer.totalPoints <= price) {
          return res.status(400).json({ message: "no enough points" });
        } else {
          User.findByIdAndUpdate(buyerid, {
            totalPoints: buyer.totalPoints - price,
          })
            .then(() => {
              let userid = user._id;
              User.findByIdAndUpdate(userid, {
                totalPoints: user.totalPoints + price,
              })
                .then(() => {
                  Product.findByIdAndRemove(id)
                    .then(() =>
                      res.json({
                        message: `Product with ${id} is deleted successfully`,
                      })
                    )
                    .catch((error) => console.log(error));
                })
                .catch((error) => console.log(error));
            })
            .catch((error) => console.log(error));
        }
      }
    })
    .catch((error) => console.log(error));
});

module.exports = router;
