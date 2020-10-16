const express = require('express');

const bodyParser = require('body-parser');
const Insta = require('instamojo-nodejs');


Insta.setKeys(process.env.API_KEY,process.env.AUTH_KEY);
Insta.isSandboxMode(true);


const app=express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const PORT = process.env.PORT||3000;



app.get('/', (req,res)=>{
    res.sendFile(__dirname+"/main.html")
})

app.get('/donate',(req,res)=>{
  res.sendFile(__dirname+'/index.html');
})

app.get('/check', (req,res)=>{
    res.sendFile(__dirname+"/check.html")
})
app.get('/success',(req,res)=>{
  res.sendFile(__dirname+'/success.html');
})

app.post('/pay', (req,res)=>{

var name= req.body.name;
var email= req.body.email;
var amount = req.body.amount;
console.log(name);
console.log(email);
console.log(amount);

var data = new Insta.PaymentData();

const REDIRECT_URL = "http://localhost:3000/success";

data.setRedirectUrl(REDIRECT_URL);
data.send_email = "True";
data.purpose = "Donation for Poor";

  data.amount = amount;
  data.name = name;
  data.email = email; // REQUIRED

  Insta.createPayment(data, function (error, response) {
    if (error) {
      // some error
    } else {
      console.log(response);
      // Payment redirection link at response.payment_request.longurl
      res.redirect('check');
    }
  });

});


app.post('/donate', (req,res)=>{
    res.redirect('donate');
})



app.listen(PORT,()=>{
    console.log(`App is runnning on ${PORT}`);
})
