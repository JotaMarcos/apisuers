const { restart } = require('nodemon')
const userModel = require('../models/userModel')
const passwordToken = require('../models/passwordToken')
const jwt = require('jsonwebtoken')

const secret = 'adfdagfhaerw3rrfgaffg23vgasfdgasf33r245251'
const bcrypt = require('bcrypt')

class UserController {

    // Listar todos os usuários
    async index(req, res) {
        
        const users = await userModel.findAll()
        res.json(users)

    }
    
    // Listar um usuário pelo id_user
    async findUser(req, res) {
        const id = req.params.id
        const user = await userModel.findById(id)
        if(user == undefined){
            res.status(404)
            res.json('Usuário não encontrado!')
        } else {
            res.status(200)
            res.json(user)
        }
    }


    // Pega o corpo da requisição e valida o e-mail
    async create(req, res) {

        const {email, password,  name} = req.body

        if(email == undefined || ''){
            res.status(400)
            res.json({ erro: 'O e-mail é inválido!' })
            return
        } 

        await userModel.findEmail(email)

        const emailExists = await userModel.findEmail(email)

        if(emailExists){
            res.status(406)
            res.json({ erro: 'O e-mail já está cadastrado!' })
            return
        }


        await userModel.create(email, password, name)

        res.status(200)
        res.send('Usuário cadastrado com sucesso!')
    }


    async edit(req, res) {
        const {id_user, name, role, email} = req.body
        const result = await userModel.update(id_user, email, name, role)

        if(result != undefined) {
            if(result.status) {
                res.status(200)
                res.send('Edição realizada com sucesso!')
            } else {
                res.status(406)
                //res.send(result.erro)
                res.json(result)
            }
        } else {
            res.status(406)
            res.send('Ocorreu um erro no servidor!')
        }


    }

    async remove(req,res) {
        const id = req.params.id

        const result = await userModel.delete(id)

        if(result.status) {
            res.status(200)
            res.send('Usuário excluído com sucesso!')
        } else {
            res.status(406)
            res.send(result.erro)
            //res.json(result)
        }


    }


    async recoverPassword(req, res) {
        const email = req.body.email
        const result = await passwordToken.create(email)
        if(result.status) {
            res.status(200)
            res.send('' + result.token)
        } else {
            res.status(406)
            res.send(result.erro)
            //res.json(result)
        }
    }

    async changePassword(req, res) {
        const token = req.body.token
        const password = req.body.password

        const isTokenValid = await passwordToken.validate(token)

        if(isTokenValid.status) {

            await userModel.changePassword(password, isTokenValid.token.user_id, isTokenValid.token.token)

            res.status(200)
            res.send('Senha alterada com sucesso!')

        } else {
            res.status(406)
            res.send('Token inválido!')
        }

    }
   

    async login(req, res) {

        const {email, password} = req.body

        const user = await userModel.findByEmail(email)

        if (user != undefined || '') {
            const result = await bcrypt.compare(password, user.password)

            if(result) {
                
                const token = jwt.sign({ email: user.email, role: user.role }, secret)

                res.status(200)
                res.json({token: token})

            } else {

                res.status(406)
                res.send('Senha incorreta!')
                
            }

        } else {

            res.json({status: false})

        }

    }

}

module.exports = new UserController()
















