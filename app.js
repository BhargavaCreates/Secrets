require('dotenv').config()
const express    = require('express'),
      ejs        = require('ejs'),
      bodyParser = require('body-parser'),
      mongoose   = require('mongoose'),
      encrypt    = require('mongoose-encryption');

var   md5        = require('md5');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true,useUnifiedTopology:true});

var userSchema = new mongoose.Schema({
    email: String,
    password: String
})


var User = mongoose.model('User', userSchema);

app.get("/",function(req,res){
    res.render("home")
})

app.get("/login",function(req,res){
    res.render("login")
})

app.get("/register",function(req,res){
    res.render("register")
})

app.get("/submit",function(req,res){
    res.render("submit"); 
})


app.post("/register",function(req,res){
    User.create({
        email: req.body.username,
        password: md5(req.body.password)
    },function(err){
        if(err){
            console.log(err);
        } else {
            res.render("secrets")
        }
    }
)
});

app.post("/login",function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email:username},function(err,foundUser){
        if(err){
            console.log(err);
        } else {
            if(foundUser){
                if(foundUser.password === md5(password)){
                    res.render("secrets");
                }
            }
        }
    })

})



app.listen(3000,function(){
    console.log("The server is up and running @port:3000 !")
})