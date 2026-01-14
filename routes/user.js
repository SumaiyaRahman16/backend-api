const router = require('express').Router();

router.get("/usertest", (req, res) => {
    res.send("user test profile route");
});

router.post("/create", (req, res) => {
  const username = req.body.username;
  res.send(`User ${username} created successfully`);
});



module.exports = router;