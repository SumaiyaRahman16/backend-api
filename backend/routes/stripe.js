const router = require("express").Router();

// Only initialize Stripe if the key is available
if (process.env.STRIPE_KEY) {
  try {
    const Stripe = require("stripe");
    const stripe = Stripe(process.env.STRIPE_KEY);
    
    // router.post("/payment", async (req, res) => {
    //   try {
    //     const charge = await stripe.charges.create({
    //       amount: req.body.amount,
    //       currency: "usd",
    //       source: req.body.token.id,
    //       description: "Test payment from e-commerce app",
    //     });
    //     res.status(200).json(charge);
    //   } catch (stripeErr) {
    //     console.error("Stripe Error:", stripeErr);
    //     res.status(500).json({ error: "Payment processing failed", details: stripeErr });
    //   }
    // });
    router.post("/payment", async (req, res) => {
  try {
    const charge = await stripe.charges.create({
      amount: req.body.amount,
      currency: "usd",
      source: req.body.token.id,
      // We update the description to reflect the digital asset
      description: `Purchase of DevSnippet: ${req.body.title || 'Code Asset'}`,
      // Metadata is key! It helps you track which user bought what in your Stripe Dashboard
      metadata: {
        snippet_id: req.body.productId,
        user_id: req.body.userId,
        is_digital: "true"
      }
    });
    
    // In a real SaaS, here is where you would update your MongoDB User 
    // to give them access to the code.
    
    res.status(200).json(charge);
  } catch (stripeErr) {
    console.error("Stripe Error:", stripeErr);
    res.status(500).json({ error: "Payment processing failed", details: stripeErr });
  }
});
  } catch (error) {
    console.error("Error initializing Stripe:", error);
    
    // Fallback route when Stripe fails to initialize
    router.post("/payment", (req, res) => {
      res.status(503).json({ 
        error: "Payment service unavailable", 
        message: "Stripe is not properly configured" 
      });
    });
  }
} else {
  console.warn("STRIPE_KEY not found in environment variables. Payment functionality will be disabled.");
  
  // Fallback route when no Stripe key
  router.post("/payment", (req, res) => {
    res.status(503).json({ 
      error: "Payment service unavailable", 
      message: "Stripe key not configured" 
    });
  });
}

module.exports = router;