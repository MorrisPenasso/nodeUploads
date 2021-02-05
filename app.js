const express = require("express");
const multer = require("multer");
const ejs = require("ejs");
const path = require("path");

//set storage engine
const storage = multer.diskStorage({
    destination: "./public/uploads",
    filename: function(req, file, cb)    {
        cb(null, file.fieldname + "-" + Date.now() +  // set into name of image the name of field on html
        path.extname(file.originalname));
    }
});

//Init Upload
const upload = multer({
    storage: storage,
    limits: { // set limit on upload
        fileSize: 1000000 // on bytes
    },
    fileFilter: function(req, file, cb)  { //when file is selected, apply a filter
        checkFileType(file, cb);
    }
}).single("myImage");

//check file type
function checkFileType(file, cb)    {

    //allowed ext
    const filetypes = /jpeg|jpg|png|gif/;

    //check ext - test if ext of name of file is on filetypes
    const extname = filetypes.test(path.extname(file.originalname).toLocaleLowerCase());

    //check mime
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname) {
        return cb(null, true);
    } else  {
        return cb("Error: Images only")
    }
}

const app = express();

//EJS
app.set("view engine", "ejs");

//load public folder
app.use(express.static("./public"));

app.get("/", (req, res) =>  {
    res.render("index");
})

app.post("/upload", (req, res)  =>  {
    upload(req, res, (err)  =>  { // this return callback from upload, checkFileType ( return cb )
        if(err) {
            res.render("index", { // reload index page and pass a error message
                msg: err
            })
        } else {
            console.log(req.file);
            if (req.file == undefined) {
                res.render("index", {
                    msg: "Error: No file selected!"
                })
            } else  {
                res.render("index", {
                    msg: "File uploaded!",
                    file: "uploads/" + req.file.filename
                })
            }
        }
    });
})

const port = 3000;

app.listen(port, () =>  {console.log("Server started on port: " + port)})