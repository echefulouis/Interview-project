// Imported the modules
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var http = require('http');
var https= require('https');
const { render } = require('ejs');

//Initialized the Express app
var app = express();


//Collecting data from the body 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


// Setup path to find my rendered pages in the 'public' Folder
app.use(express.static(path.join(__dirname,'public')))

//Setup the home route
app.get('/',function(req,res){
        res.render("index.ejs");
});

app.post('/search',function(req,res){
    var search=req.body.search;
    console.log(search);

    var api='https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch='+search;
    console.log(api);
    https
      .get(api,function(resp){
          let data="";
          resp.on('data',chunk=>{
              data+=chunk;
          });

          resp.on("end",()=>{
              let search_data=JSON.parse(data).query.search;
              console.log(search_data);

              res.render('search.ejs',{search_data:search_data});
          });
      })
      .on("error",err=>{
          console.log('Error: '+err.message);
          res.redirect('/');
      });
});

//Listens to this port
app.listen(3000);
console.log('Server is running on port 3000');