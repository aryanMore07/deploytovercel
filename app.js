const express = require('express');
const lodash = require('lodash');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require("multer");
const app = express();
const nodemail = require('nodemailer');
const open = require('open');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const router = express.Router();
const mongodb= require('mongodb');
const mongoClient = mongodb.MongoClient
const binary = mongodb.Binary;

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

const advertisement = {
  head:String,
  description:String,
  duration:String,
  textColor:String,
  color:String
}

const Info =  mongoose.model("companyInfo",companySchema);
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
app.use(fileUpload())


app.get("/", (req, res) => {
  mongoClient.connect('mongodb+srv://Admin-Shubham:11816921@cluster0.bm81x.mongodb.net/', { useNewUrlParser: true }, (err, client) => {
        let db = client.db('interndb')
        let collection = db.collection('themes')
        collection.find({}).toArray((err, doc) => {
            Ads.find({},function(err,obj){
              res.render("index",{array:doc,arr:obj});
            });
          })        
      })
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
app.post("/posttheme", (req, res) => {
  let file = { title: req.body.title, thumbnail: binary(req.files.thumbnail.data), description: req.body.description,price: req.body.price,url: req.body.url,companyDetails: req.body.companyDetails,type: req.body.type }
  insertFile(file, res)
})
function insertFile(file, res) {
  mongoClient.connect('mongodb+srv://Admin-Shubham:11816921@cluster0.bm81x.mongodb.net', { useNewUrlParser: true }, (err, client) => {
        let db = client.db('interndb')
        let collection = db.collection('themes')
        try {
              collection.insertOne(file)
              console.log('File Inserted')
          }
          catch (err) {
              console.log('Error while inserting:', err)
          }
          res.redirect('/')
  })
}

app.get("/addForm",function(req,res){
  Ads.find({},function(err,obj){
      res.render("addForm",{obj:obj});

  });
});

app.get("/themeForm", async function(req,res){
  mongoClient.connect('mongodb+srv://Admin-Shubham:11816921@cluster0.bm81x.mongodb.net', { useNewUrlParser: true }, (err, client) => {
        let db = client.db('interndb')
        let collection = db.collection('themes')
        collection.find({}).toArray((err, doc) => {
            if (err) {
                console.log('err in finding doc:', err)
            }
            else {
                res.render("themeForm",{array:doc});
            }
        })
       })
});

app.post("/delete",function(req,res){
  mongoClient.connect('mongodb+srv://Admin-Shubham:11816921@cluster0.bm81x.mongodb.net/', { useNewUrlParser: true }, (err, client) => {
    let db = client.db('interndb')
    let collection = db.collection('themes')
    const url =req.body.url;
  try{
    collection.deleteOne({url:url},function(err,item){
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
})
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

app.get("/ourproducts",function(req,res){
  res.render("ourproducts");
});

app.post("/customsearch",function(req,res){
  let custom  = lodash.capitalize(req.body.search);
  let bool = false;
  mongoClient.connect('mongodb+srv://Admin-Shubham:11816921@cluster0.bm81x.mongodb.net/', { useNewUrlParser: true }, (err, client) => {
    let db = client.db('interndb')
    let collection = db.collection('themes')
    collection.find({}).toArray((err, doc) => {
      res.render("customsearch",{array:doc,custom:custom});
  })
  })
});

app.post("/sub-menu",function(req,res){
  let custom  = req.body.value;
  let bool = false;
  mongoClient.connect('mongodb+srv://Admin-Shubham:11816921@cluster0.bm81x.mongodb.net/', { useNewUrlParser: true }, (err, client) => {
    let db = client.db('interndb')
    let collection = db.collection('themes')
    collection.find({}).toArray((err, doc) => {
      res.render("customsearch",{array:doc,custom:custom});
  });
  })
});

app.get("/mongod356",function(req,res){
  Info.find({},function(err,item){
    res.send(item);
  });
});

app.listen(process.env.PORT||8000,function(){
  console.log("I am listening");
});
