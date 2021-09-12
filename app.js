const express = require('express');
const lodash = require('lodash');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

mongoose.connect("mongodb+srv://Admin-Shubham:11816921@cluster0.bm81x.mongodb.net/interndb");
let success = "false";
const companySchema = {
  email:String,
  name:String,
  companyName:String,
  product:String,
  details:String,
  template:String
}

const Info =  mongoose.model("companyInfo",companySchema);

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");


app.get("/",function(req,res){
  res.render("index");
});

app.get("/form",function(req,res){
  const title = req.body.title;
  res.render("form",{title:title});

});

app.post("/form",function(req,res){
  const title = req.body.title;
  res.render("form",{title:title});

});
app.post("/companyInfo",function(req,res){
   const email = req.body.email;
   const name = req.body.name;
   const cname = req.body.cname;
   const product = req.body.product;
   const details = req.body.details;
   const template = req.body.template;

   const info = new Info({
     email:email,
     name:name,
     comapanyName:cname,
     product:product,
     details:details,
     template:template
   });

   info.save().then(()=>{console.log("sent")}
  );
});

app.get("/mongod356",function(req,res){
  Info.find({},function(err,item){
    res.send(item);
  });
});

app.listen(process.env.PORT||3000,function(){
  console.log("I am listening");
});
