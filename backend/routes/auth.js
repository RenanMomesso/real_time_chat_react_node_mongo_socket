const express = require("express");
const router = express.Router();
const { signup, accountActivation, signin, forgotPassword,facebookLogin, resetPassword, googleLogin } = require("../controllers/auth");

const {
  userSignupValidator,
  userSigninValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require("../validators");

router.post("/signup", userSignupValidator, signup);
router.post("/signin", userSigninValidator, signin);
router.post("/account-activation", accountActivation);
//forgot password reset route 
router.put('/forgot-password',forgotPasswordValidator, forgotPassword)
router.put('/reset-password',resetPasswordValidator, resetPassword)
//login with facebook and google
router.post('/google-login', googleLogin)
router.post('/facebook-login', facebookLogin)



module.exports = router;
