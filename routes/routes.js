const express = require("express")
const app = express()
const router = express.Router()
const HomeController = require("../controllers/homeController")
const UserController = require('../controllers/userController')
const AdminAuth = require('../middleware/adminAuth')

router.get('/', AdminAuth, HomeController.index)
router.post('/user', AdminAuth, UserController.create)
router.get('/user', AdminAuth, UserController.index)
router.get('/user/:id', AdminAuth, UserController.findUser)
router.put('/user', AdminAuth, UserController.edit)
router.delete('/user/:id', AdminAuth, UserController.remove)
router.post('/recoverpassword', UserController.recoverPassword)
router.post('/changepassword', UserController.changePassword)
router.post('/login', UserController.login)



module.exports = router