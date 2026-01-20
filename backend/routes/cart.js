const router = require('express').Router();
const { verifyToken, verifyTokenAndAuthorization ,verifyTokenAndAdmin} = require('./verifyToken');
const CryptoJS = require("crypto-js");
const User = require('../models/User');
const Cart = require('../models/Cart');


// CREATE CART
router.post("/", verifyToken, async (req, res) => {
    const newCart = new Cart(req.body);
    try {
        const savedCart = await newCart.save();
        res.status(201).json(savedCart);
    } catch (err) {
        console.error("Create cart error:", err);
        res.status(500).json({ message: "Failed to create cart", error: err.message });
    }
});

// UPDATE CART
router.put("/:id", verifyToken, async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedCart);
    } catch (err) {
        console.error("Update cart error:", err);
        res.status(500).json({ message: "Failed to update cart", error: err.message });
    }
});

// DELETE CART
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("Cart has been deleted...");
    } catch (err) {
        console.error("Delete cart error:", err);
        res.status(500).json({ message: "Failed to delete cart", error: err.message });
    }
});

// GET USER'S CART (Main route for frontend)
router.get("/:userid", verifyToken, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userid });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        res.status(200).json(cart);
    } catch (err) {
        console.error("Get cart error:", err);
        res.status(500).json({ message: "Failed to get cart", error: err.message });
    }
});

// Alternative route (for backward compatibility)
router.get("/find/:userid", verifyToken, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userid });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        res.status(200).json(cart);
    } catch (err) {
        console.error("Find cart error:", err);
        res.status(500).json({ message: "Failed to find cart", error: err.message });
    }
});

router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const carts = await Cart.find();
        res.status(200).json(carts);
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