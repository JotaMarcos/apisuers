const jwt = require('jsonwebtoken')
const secret = 'adfdagfhaerw3rrfgaffg23vgasfdgasf33r245251'

module.exports = function(req, res, next){

    const authToken = req.headers['authorization']

    if(authToken != undefined || ''){
        const bearer = authToken.split(' ')
        const token = bearer[1] //0 - usuário comum e 1 - usuário Admin

        try {
            
            const decoded = jwt.verify(token, secret)

            // console.log(decoded)
            // next()
            if(decoded.role == 1) {
                next()
            } else {
                res.status(403)
                res.send('Você não tem permissão de acesso!')
                return
            }

        } catch (error) {
            res.status(403)
            res.send('Você não está autenticado!')
            return
        }

    } else {
        res.status(403)
        res.send('Você não está autenticado ou não possuí permissão de acesso!')
        return
    }
    
}




























