const { restart } = require('nodemon')
const userModel = require('../models/userModel')

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

}

module.exports = new UserController()
















