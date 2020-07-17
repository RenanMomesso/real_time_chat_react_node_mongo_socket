const express = require('express')
const router = express.Router()

const {requireSign, adminMiddleware} = require('../controllers/auth')
const {read, update} = require('../controllers/user')

//para conseguir ler o perfil, tem um midleware para proteger a rota, este midleware faz a comparação do token que esta acessando a rota, com o usuario que vai ser lido, então por exemplo, o usuario só consegue ler o seu proprio perfil, pois o seu token bate com o token do usuario e id que é seu
router.get('/user/:id', requireSign, read)

//aqui vamos atualizar o usuario
//nao precisa de :id pois o requireSign já esta buscando o usuario pelo Token.
router.put('/user/update/', requireSign, update)
router.put('/admin/update/', requireSign, adminMiddleware, update)


module.exports = router;