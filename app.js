
var bodyParser   = require('body-parser'),
MongoClient      = require('mongodb').MongoClient,
methodoverride   = require("method-override"),
expressSanitizer = require("express-sanitizer"),
mongoose         = require('mongoose'),
config           = require('config'),
express          = require('express'),
app              = express(),
jwt              = require("jsonwebtoken");

//Connection string 
const url=process.env.MONGO_URL || "mongodb://localhost:27017/test";




//Db connection
mongoose.connect('mongodb+srv://kapil123:kapil123@cluster0.wjkqg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
}
) 
  .then(() => console.log('Connected to MongoDB successfully....'))
  .catch(err => console.error('Could not connect to MongoDB....'));

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodoverride("_method"));



// Mongoose/Model Config

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

// Restful ROUTE
app.get("/", function(req, res) {
    res.redirect("/blogs");
});

app.get("/blogs", function (req, res) {
    Blog.find({}, function(err, blogs) {
        if(err) 
        {
            console.log("ERROR!");
        }
        else 
        {
            res.render("index", { blogs:blogs });
        }
    });
});
app.get("/blogs/login",  (req, res) => {

    res.render("login");

});
app.get("/blogs/register",  (req, res) => {

    res.render("registration");

});


// new route
app.get("/blogs/new", function(req, res) {
    res.render('new');
});
// create route 
app.post("/blogs", function(req,res)  {
    // creat blog
    console.log(req.body);
    
    console.log("============");
    console.log(req.body);


        Blog.create(req.body.blog, function(err, newBlog) {
        if(err) {
            console.log("new");
        }
        else {
            res.redirect("/blogs");
        }
    });
});

// Show route
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if(err) {
            res.redirect("/blogs");
        }
        else {
            
            res.render("show", {blog: foundBlog});
            
        }
    });
});

// EDIT ROUTE
app.get("/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if(err) {
            res.redirect("/blogs");
        }
        else {
            res.render("edit",  {blog: foundBlog});
        }
    });
    
});

//  Update Route
app.put("/blogs/:id", function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
        if(err) {
            res.redirect("/blogs");
        }
        else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// delete  route

app.delete("/blogs/:id", function(req, res) {
    // Delete blog
    Blog.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            res.redirect("/blogs");
        }
        else {
            res.redirect("/blogs");
        }
    });
});


// app.post("/blogs/login", (req, res) => {
//     const user = {
//         id:1,
//         username: 'title',
//         email:'abhay@gmail'
//     }
//     jwt.sign({user}, 'secretekey', (err, token) =>
//     {
//         res.json({
//             token
//         })
//     })
// });





let port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Express server started at port  : ${port}`);
});







