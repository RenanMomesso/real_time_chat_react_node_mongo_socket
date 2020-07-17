const User = require("../models/user");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const sgMail = require("@sendgrid/mail");
const _ = require("lodash");
const { OAuth2Client } = require("google-auth-library");
const fetch = require("node-fetch");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//metodo para criar usuario, porém sem sendgrid

// exports.signup = (req, res) => {
//         // console.log('REQ BODY ON SIGNUP', req.body);
//         const { name, email, password } = req.body;

//         User.findOne({ email }).exec((err, user) => {
//             if (user) {
//                 return res.status(400).json({
//                     error: 'Email is taken'
//                 });
//             }
//         });

//         let newUser = new User({ name, email, password });

//         newUser.save((err, success) => {
//             if (err) {
//                 console.log('SIGNUP ERROR', err);
//                 return res.status(400).json({
//                     error: err
//                 });
//             }
//             console.log("SUCESS"+success)
//             console.log("newUser"+newUser)
//             res.json({
//                 message: 'Signup success! Please signin'
//             });
//         });
//     };

exports.signup = (req, res) => {
  // pegar as informações no site, no input com req.body
  const { name, email, password } = req.body;

  // procurar no banco de dados o priemir que bater a informação email com o email colocado
  User.findOne({ email }).exec((err, user) => {
    if (user) {
      res.status(400).json({
        error: "Email já existe",
      });
    }
    //criar variavel para gravar o token, ele recebe 3 parametros, 1º é oq ele pegar, 2º é um código qlqr, e o 3º data de expiração
    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      { expiresIn: "10m" }
    );

    //criar variavel de mandar email, pode ser usado para qlqr tipo de enviador de email
    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "E-mail de ativação da página Auth_MERN",
      html: `
            <h1>Por favor, clique no link para ativar a sua conta</h1>
            <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
           
            <hr/>
            <p>Este email contem informações precisas</p>
            <p>${process.env.CLIENT_URL}</p>
            `,
    };

    //metodo do sendgrid para enviar email
    sgMail
      .send(emailData)
      .then((sent) => {
        // console.log('EMAIL SENT: ', sent)
        return res.json({
          message: `Email enviado para ${email}. Por favor siga as intruções para acessar sua conta`,
        });
      })
      .catch((err) => {
        return res.json({
          message: err.message,
        });
      });
  });
};

//ativação da conta por meio do link
// pegar o token que será gerado na página pelo corpo !

exports.accountActivation = (req, res) => {
  const { token } = req.body;
  //se houver token, fazer a verificação, jwt.verify que recebe 2 parametros, 1º o token gerado pelo user,email,password e o segundo  é o process.env.JWT_ACCOUNT_ACTIVATION, q tem parte no token que verifica se o token está certo, se estiver então grava o usuario no banco de dados
  if (token) {
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
      if (err) {
        console.log("JWT VERIFY IN ACCOUNT ACTIVATION ERROR", err);
        return res.status(401).json({
          error: "Expired link. Sign up again",
        });
      }
      const { name, email, password } = jwt.decode(token);

      const user = new User({ name, email, password });
      user.save((err, user) => {
        if (err) {
          console.log("Error saving user in database", err);
          return res.status(401).json({
            error: "Error saving user in database. Sign up again",
          });
        }
        return res.json({
          message: "Cadastro realizado com sucesso. Faça o login",
        });
      });
    });
  } else {
    res.json({
      message: "Something went wrong, pelase try again.",
    });
  }
};

exports.signin = (req, res) => {
  //pegar o email e senha
  //verificar se existe este email no banco de dados
  //se existir, verificar a senha, se a senha é compativel com o email
  //criar token

  const { email, password } = req.body;

  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "Usuário não existe, por favor crie um.",
      });
    }
    //authenticação ( verificar se password bate com usuario)
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: "Email ou senha incorretos",
      });
    }
    //se senha bater com email, então criar token
    //qndo fazemos userfindone e coloca o callback err e user, o user vai estar com todos dados do usuario, e qndo qremos por exemplo o id, pegamos pelo user.id
    // gerar o token, precisa de 3 parametros, oq qremos enviar, o segredo e a data de expiração
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    //pegar alguns dados do user, que esta no callback ainda
    const { _id, name, email, role } = user;
    //retornar estas informações como json, para dar fetch dps
    return res.json({
      token,
      user: { _id, name, email, role },
    });
  });
};

//este midleware vai verificar o token e se este bater, prosseguir com a operaçção,
exports.requireSign = expressJwt({
  secret: process.env.JWT_SECRET,
});

// verificar se é admin, para conseguir usar algumas funções, precisa ser admin para conseguir prosseguir
exports.adminMiddleware = (req, res, next) => {
  console.log(req.user._id);
  User.findById({ _id: req.user._id }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    if (user.role !== "AdministradordaPagina99999910201231981293123198239") {
      return res.status(400).json({
        error: "Admin resources only",
      });
    }
    req.profile = user;
    next();
  });
};

exports.forgotPassword = (req, res) => {
  const { email } = req.body;
  User.findOne({ email: email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with that email doesn't exist",
      });
    }
    //se existir email, pegar token, enviar para o email
    const token = jwt.sign(
      { _id: user._id, name: user.name },
      process.env.JWT_RESET_PASSWORD,
      {
        expiresIn: "20m",
      }
    );
    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Por favor, clique neste link para resetar sua conta",
      html: `
            <h1>Por favor, clique no link para ativar a sua conta</h1>
            <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
           
            <hr/>
            <p>Este email contem informações precisas</p>
            <p>${process.env.CLIENT_URL}</p>
            `,
    };

    return user.updateOne({ resetPasswordLink: token }, (err, success) => {
      console.log(success);
      if (err) {
        return res.status(400).json({
          error: "database onnection error in update user password",
        });
      } else {
        sgMail
          .send(emailData)
          .then((sent) => {
            // console.log('EMAIL SENT: ', sent)
            return res.json({
              message: `Email enviado para ${email}. Por favor siga as intruções para acessar sua conta`,
            });
          })
          .catch((err) => {
            return res.json({
              message: err.message,
            });
          });
      }
    });
  });
};

exports.resetPassword = (req, res) => {
  //primeiro --- pegar o resetPasswrdLink, e a nova senha que estão na tela
  // o resetPasswordLink é o mesmo que o token, e está na tela pois foi enviado no email
  const { resetPasswordLink, newPassword } = req.body;
  // console.log(resetPasswordLink)
  // console.log(newPassword)
  //se existir resetPasswordLink, decodificar ele, usando o processo de resetar senha
  if (resetPasswordLink) {
    jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function (
      err,
      decoded
    ) {
      if (err) {
        return res.status(400).json({
          error: "Link expirado. Tente denovo",
        });
      }
      //se nao der erros, encontre o usuario onde o resetPassowrdLink bate com o resetPasswordLink
      User.findOne({ resetPasswordLink }, (err, user) => {
        // console.log(user)
        if (err || !user) {
          return res.status(400).json({
            error: "Something went wrong, try later",
          });
        }
        // atualizar campos
        const updatedFields = {
          password: newPassword,
          resetPassowrdLink: "",
        };
        // o lodash = _, recebe dois parametros, o primeiro tudo q vai ficar igual, e o segundo tudo que ira mudar
        user = _.extend(user, updatedFields);
        //apos mudar, salvar no banco de dados

        user.save((err, result) => {
          // console.log("result",result)
          if (err) {
            return res.status(400).json({
              error: "Expired link, try again",
            });
          }
          res.json({
            message: "Great! Now you can log in with your new password",
          });
        });
      });
    });
  }
};

//pegar o cliente da página
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
exports.googleLogin = (req, res) => {
  const { idToken } = req.body;
  //idToken recebido pelo react, qndo vc clicka login
  client
    .verifyIdToken({ idToken: idToken, audience: process.env.GOOGLE_CLIENT_ID })
    .then((response) => {
      console.log("OAuth client", client);
      console.log("response ", response);
      //desestruturar email_verified, name, email do response.payload que vem do google!!!
      const { email_verified, name, email } = response.payload;
      if (email_verified) {
        User.findOne({ email }).exec((err, user) => {
          if (user) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
              expiresIn: "7d",
            });
            const { _id, email, name, role } = user;
            return res.json({
              token,
              user: {
                _id,
                name,
                email,
                role,
              },
            });
          } else {
            let password = email + process.env.JWT_SECRET;
            user = new User({ name, email, password });
            user.save((err, data) => {
              console.log("DATA", data);
              if (err) {
                console.log("ERROR ON GOOGLE LOGIN USER SAVE", err);
                return res.status(400).json({
                  error: "User signup failed with google",
                });
              }
              const token = jwt.sign(
                { _id: data._id },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
              );
              const { _id, name, email, role } = data;
              return res.json({
                token,
                user: { _id, name, email, role },
              });
            });
          }
        });
      } else {
        return res.status(400).json({
          error: "User signup failed with google",
        });
      }
    });
};

exports.facebookLogin = (req, res) => {
  console.log('FACEBOOK LOGIN REQ BODY', req.body);
  const { userID, accessToken } = req.body;

  const url = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`;

  return (
      fetch(url, {
          method: 'GET'
      })
          .then(response => response.json())
          // .then(response => console.log(response))
          .then(response => {
              const { email, name } = response;
              User.findOne({ email }).exec((err, user) => {
                  if (user) {
                      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
                      const { _id, email, name, role } = user;
                      return res.json({
                          token,
                          user: { _id, email, name, role }
                      });
                  } else {
                      let password = email + process.env.JWT_SECRET;
                      user = new User({ name, email, password });
                      user.save((err, data) => {
                          if (err) {
                              console.log('ERROR FACEBOOK LOGIN ON USER SAVE', err);
                              return res.status(400).json({
                                  error: 'User signup failed with facebook'
                              });
                          }
                          const token = jwt.sign({ _id: data._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
                          const { _id, email, name, role } = data;
                          return res.json({
                              token,
                              user: { _id, email, name, role }
                          });
                      });
                  }
              });
          })
          .catch(error => {
              res.json({
                  error: 'Facebook login failed. Try later'
              });
          })
  );
}
