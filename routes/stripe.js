const router = require("express").Router();
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_KEY);

router.post("/payment", async (req, res) => {
 stripe.changes.create({
   amount: req.body.amount,
   currency: "usd",
   source: req.body.tokenId,
   description: "Test payment from e-commerce app",
 }, (stripeErr, stripeRes) => {
   if (stripeErr) {
     res.status(500).json(stripeErr);
   } else {
     res.status(200).json(stripeRes);
   }
 });
});

module.exports = router;