const express = require('express');
const lodash = require('lodash');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require("multer");
const app = express();
const nodemail = require('nodemailer');
const open = require('open');

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

const advertisement = {
  head:String,
  description:String,
  duration:String,
  textColor:String,
  color:String
}

const Info =  mongoose.model("companyInfo",companySchema);
const Theme = mongoose.model("theme",themeSchema);
const Ads = mongoose.model("ad",advertisement);

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
    Ads.find({},function(err,obj){
      res.render("index",{array:items,arr:obj});
    });

  });


});

app.get("/form",function(req,res){
  const title = req.body.title;

  res.render("form",{title:title});

});

app.post("/form",function(req,res){

  const select = req.body.select;
  const view = req.body.view;

  if(select!==undefined){
     res.render("form",{title:select});
  }

  if(view!==undefined){
     res.redirect(view);
  }

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

app.post("/postAdd",function(req,res){
  const title = req.body.title;
  const desc = req.body.description;
  const duration = req.body.duration;
  let color = req.body.color;
  let textColor = req.body.textColor;
  if(color.length==0){
    color="#FFC069";
  }
  if(textColor.length==0){
    color="#000000";
  }
  const add = new Ads({
    head:title,
    description:desc,
    duration:duration,
    textColor:textColor,
    color:color
  });

  add.save().then(()=>{console.log("sent");}
 );
 res.redirect("/");
});
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

app.get("/addForm",function(req,res){
  Ads.find({},function(err,obj){
      res.render("addForm",{obj:obj});

  });
});

app.get("/themeForm",function(req,res){

  try{
    Theme.find({},function(err,items){

      res.render("themeForm",{items:items});
    });
  }catch(e){
    console.log("something went wrong while finding themes");
  }
});

app.post("/delete",function(req,res){
  const id = req.body.id;
  try{
    Theme.findOneAndDelete({_id:id},function(err,item){
      if(err){
        console.log("cannot find the id in the your database.");
      }else{
        console.log("successfully deleted.");
        res.redirect("themeForm");
      }
    });
  }catch(e){
    console.log("somethinf went wrong while searching for your id");
  }
});

app.post("/deleteAd",function(req,res){
  const id = req.body.id;
 try{
   Ads.findOneAndDelete({_id:id},function(err,item){
     if(err){
       console.log("cannot find the id in the your database.");
     }else{
       console.log("successfully deleted.");
       res.redirect("addForm");
     }
   });
 }catch(e){
   console.log("something went wrong while deleting an Ad");
 }
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

app.post("/sub-menu",function(req,res){
  let custom  = req.body.value;
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

app.listen(process.env.PORT||8000,function(){
  console.log("I am listening");
});
