const router = require('express').Router();
const { verifyToken, verifyTokenAndAuthorization ,verifyTokenAndAdmin} = require('./verifyToken');
const CryptoJS = require("crypto-js");
const User = require('../models/User');
const Order = require('../models/Order');


router.post("/",verifyToken,async (req, res) => {
    const newOrder = new Order(req.body);
    try {
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
});
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
});
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Order has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
});


router.get("/find/:userid", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const Orders = await Order.find({ userId: req.params.userid });
        res.status(200).json(Order);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const Orders = await Order.find();
        res.status(200).json(Orders);
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

router.get("/income", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() -1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() -1));

    try{
        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: previousMonth } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount",
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" },
                },
            },
        ]);
        res.status(200).json(income);
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router;