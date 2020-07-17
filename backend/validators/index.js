exports.userSignupValidator = (req, res, next) => {
    req
      .check("name", "Name is required")
      .notEmpty()
      req.check("name")
      .isLength({ min: 3, max: 25 })
      .withMessage("Nome deve conter entre 3 e 20 letras");
    req
      .check("email", "Email deve conter entre 3 e 32 caracteres")
      .matches(/.+\@.+\..+/)
      .withMessage("Email must contain @")
      .isLength({
        min: 4,
        max: 32,
      });
    req.check("password", "Password is required").notEmpty();
    req
      .check("password")
      .isLength({ min: 4 })
      .withMessage("Password must contain at least 6 characters")
      .matches(/\d/)
      .withMessage("Password must contain a number");
    const errors = req.validationErrors();
    if (errors) {
      const firstError = errors.map((error) => error.msg)[0];
      return res.status(400).json({ error: firstError });
    }
    next();
  };

  exports.userSigninValidator = (req,res,next) => {
 
    req
      .check("email", "Email deve conter entre 3 e 32 caracteres")
      .matches(/.+\@.+\..+/)
      .withMessage("Email must contain @")
      .isLength({
        min: 4,
        max: 32,
      });
    req.check("password", "Password is required").notEmpty();
    req
      .check("password")
      .isLength({ min: 4 })
      .withMessage("Password must contain at least 6 characters")
      .matches(/\d/)
      
      .withMessage("Password must contain a number");
    const errors = req.validationErrors();
    if (errors) {
      const firstError = errors.map((error) => error.msg)[0];
      return res.status(400).json({ error: firstError });
    }
    next();
  };


  exports.forgotPasswordValidator = (req,res,next) => {
    req.check('email', "Email deve conter entre 3 e 32 caracteres")
    .notEmpty()
    .matches(/.+\@.+\..+/)
    .withMessage("Email must contain @")
    .isLength({
      min: 4,
      max: 32,
    });
    const errors = req.validationErrors()
    if(errors){
      const firstError = errors.map(error => error.msg)[0];
      return res.status(400).json({error:firstError})
    }
    next()
  }

  exports.resetPasswordValidator = (req,res,next) => {
    req.check('newPassword').notEmpty().isLength({
      min:5,
      max:32
    })
    .withMessage('Password deve conter entre 5 a 32 digitos')
    const errors = req.validationErrors()
    if(errors){
      const firstError = errors.map(error => error.msg)[0];
      return res.status(400).json({error:firstError})
    }
    next()
  }