const knex = require('../database/connection')
const bcrypt = require('bcrypt')

class userModel {

    async findAll() {
      try {
        const result = await knex.select(['id_user','email','name','role']).table('users')
        return result
      } catch (error) {
        console.log(error)
        return []
      }
    }

    async findById(id) {
      try {
        const result = await knex.select(['id_user','email','name','role']).where({id_user: id}).table('users')
        
        if(result.length > 0) {
          return result[0]
        } else {
          return undefined
        }
        
      } catch (error) {
        console.log(error)
        return undefined
      }
    }

     async create(email, password,  name) {

       try {

        const hash = await bcrypt.hash(password, 12)

        await knex.insert({ email, password: hash,  name, role: 0}).table('users')
       } catch (error) {
           console.log(error)
       }

     }

     async findEmail(email){
       try {
        const result = await knex.select('*').from('users').where({email: email})

        if(result.length > 0) {
          return true
        } else {
          return false
        }

       } catch (error) {
         console.log(error)
         return false
       }
     }

     async update(id, email, name, role) {
      
      const user = await this.findById(id)

      if(user != undefined) {

        const editUser = {}

        if(email != undefined) {
          if(email != user.email) {
            const result = await this.findEmail(email)
            if(result == false) {
              editUser.email = email
            } else {
              return { status: false, erro: 'O e-mail já está cadastrado!' }
            }
          }
        }

        if(name != undefined) {
          editUser.name = name
        }

        if(role != undefined) {
          editUser.role = role
        }

        try {
          await knex.update(editUser).where({id_user: id}).tables('users')
          return { status: true }
        } catch (error) {
          return { status: false, erro: error }
          
        }


      } else {
        return { status: false, erro: 'Usuário não existe!' }
      }


     }


}


module.exports = new userModel()