const express = require("express");
const router = express.Router();

router.get("/babycode", (req, res)=> {
    res.render("listings/index.ejs");
})

module.exports = router;