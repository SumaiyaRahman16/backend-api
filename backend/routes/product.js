const router = require('express').Router();
const { verifyToken, verifyTokenAndAuthorization ,verifyTokenAndAdmin} = require('./verifyToken');
const CryptoJS = require("crypto-js");
const User = require('../models/User');
const Product = require('../models/Product');


router.post("/", verifyTokenAndAdmin, async (req, res) => {
    const newProduct = new Product(req.body);
    try {
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(500).json(err);
    }
});
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json(err);
    }
});
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/find/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/", async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
        let products;
        if (qNew) {
            products = await Product.find().sort({ createdAt: -1 }).limit(5);
        } else if (qCategory) {
            products = await Product.find({
                categories: {
                    $in: [qCategory],
                },
            });
        } else {
            products = await Product.find();
        }
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json(err);
    }
});


// router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
//  if(req.body.password){
//     req.body.password = CryptoJS.AES.encrypt(
//         req.body.password,
//         process.env.PASSWORD_SECRET
//     ).toString();
//  }
//   try{
//      const updatedUser = await User.findByIdAndUpdate(req.params.id, {
//          $set: req.body
//      }, { new: true });
//      res.status(200).json(updatedUser);
//  } catch (err) {
//      res.status(500).json(err);
//  }
// });

// router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
//   try{
//      await User.findByIdAndDelete(req.params.id);
//      res.status(200).json("User has been deleted...");
//  } catch (err) {
//      res.status(500).json(err);
//  }
// });

// router.get("/", verifyTokenAndAdmin, async (req, res) => {
//   try{
//      const users = await User.find();
//      res.status(200).json(users);
//  } catch (err) {
//      res.status(500).json(err);
//  }
// });

// //get user stats
// router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
//     const date = new Date();
//     const lastYear = new Date(date.setFullYear(date.getFullYear() -1));

//     try{
//         const data = await User.aggregate([
//             { $match: { createdAt: { $gte: lastYear } } },
//             {
//                 $project: {
//                     month: { $month: "$createdAt" },
//                 },
//             },
//             {
//                 $group: {
//                     _id: "$month",
//                     total: { $sum: 1 },
//                 },
//             },
//         ]);
//         res.status(200).json(data);
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

module.exports = router;