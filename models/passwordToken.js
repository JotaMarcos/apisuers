const knex = require('../database/connection')
const UserModel = require('./userModel')

class passwordToken {

    async create(email) {

        const user = await UserModel.findByEmail(email)

        if(user !=  undefined) {

            try {

                const token = Date.now()

                await knex.insert({
                    user_id: user.id_user,
                    used: 0,
                    token: token //UUID
                }).table('passwordtokens')

                return {status: true, token: token}

            } catch (error) {
                console.log(error)
                return {status: false, erro: error}
                
            }

        } else {
            return {status: false, erro: 'O e-mail informado não existe no banco de dados!'}
        }

    }

    async validate(token) {
        
        try {
            const result = await knex.select().where({token: token}).table('passwordtokens')

            if (result.length > 0) {
                
                const tk = result[0]
                if(tk.used) {
                    return {status: false}
                } else {
                    return {status: true, token: tk}
                }

            } else {
                return {status: false}
            }


        } catch (error) {
            console.log(error)
            return {status: false}
        }

    }


    async setUsed(token) {
        await knex.update({used: 1}).where({token}).table('passwordtokens')
    }


}






module.exports = new passwordToken()





















