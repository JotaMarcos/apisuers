class HomeController{

    async index(req, res){
        res.send("API Users Running!");
    }

}

module.exports = new HomeController();