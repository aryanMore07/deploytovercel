const express = require('express');
const lodash = require('lodash');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require("multer");
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
const themeSchema = {
  title:String,
  thumbnail:[],
  description:String,
  price:String,
  url:String,
  companyDetails:String,
  type:String
}

const Info =  mongoose.model("companyInfo",companySchema);
const Theme = mongoose.model("theme",themeSchema);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})

const upload = multer({storage:storage});

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");


app.get("/",function(req,res){
  Theme.find({},function(err,items){
    res.render("index",{array:items});
  });

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
const array = [];
app.post("/posttheme",upload.single("thumbnail"),function(req,res){
  const themeTitle = req.body.title;
  const thumbnailNames = req.file.originalname;
  const description = req.body.description;
  const price = req.body.price;
  const websiteUrl = req.body.url;
  const details = req.body.details;
  const type = req.body.type;


  const theme = new Theme({
    title:themeTitle,
    thumbnail:thumbnailNames,
    description:description,
    price:price,
    url:websiteUrl,
    companyDetails:details,
    type:type
  });

  theme.save().then(()=>{console.log("sent")});
  res.redirect("/");
});

app.get("/themeForm",function(req,res){
  Theme.find({},function(err,items){
    res.render("themeForm",{items:items});
  });
});

app.post("/delete",function(req,res){
  const id = req.body.id;
  Theme.findOneAndDelete({_id:id},function(err,item){
    if(err){
      console.log("cannot find the id in the your database.");
    }else{
      console.log("successfully deleted.");
      res.redirect("themeForm");
    }
  });
});


app.get("/services",function(req,res){
  res.render("services");
});

app.get("/contactus",function(req,res){
  res.render("contactus");
});

app.get("/aboutus",function(req,res){
  res.render("aboutus");
});

app.post("/customsearch",function(req,res){
  let custom  = lodash.capitalize(req.body.search);
  let bool = false;
  Theme.find({},function(err,array){
    for(let i=0;i<array.length;i++){
      if(array[i].type == custom){
      bool = true;
      break;
      }
    }
  });

    Theme.find({},function(err,array){

        res.render("customsearch",{array:array,custom:custom});


    });

});






app.get("/mongod356",function(req,res){
  Info.find({},function(err,item){
    res.send(item);
  });
});

app.listen(process.env.PORT||3000,function(){
  console.log("I am listening");
});
