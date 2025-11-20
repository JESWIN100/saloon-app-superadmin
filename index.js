const express=require('express')
const bodyParser=require('body-parser')
const path=require('path');
const connection = require('./config/connection');
const app=express()

app.use(express.json());

// Parse URL-encoded bodies (for forms)
app.use(express.urlencoded({ extended: true }));
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs')
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({extended:true}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// connection.connect((err) => {
//   if (err) throw err;
//   console.log('Database connected!');
// });


app.use('/',require("./routes/index"))

app.listen(2255,(()=>{
    console.log("Server is running 2255");
    
}))