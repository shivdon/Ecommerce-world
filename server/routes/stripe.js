const express = require('express')
const router = express.Router();

const {authCheck} = require("../middlewares/auth")

const {createPaymentsInteg} = require("../controllers/stripe")

router.post("/create-payment-integration", authCheck, createPaymentsInteg)


module.exports = router