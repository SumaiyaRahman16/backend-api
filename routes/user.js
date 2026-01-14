const router = require('express').Router();

router.get('/profile', (req, res) => {
    res.send("user test profile route");
});

module.exports = router;