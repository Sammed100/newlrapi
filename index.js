require("dotenv").config()
const connection = require('./connection');
const express = require('express');
const bodyParser = require('body-parser');
var app = express();
const cors = require('cors')
app.use(cors())
app.use(bodyParser.json())

const PORT = process.env.PORT || 3000;

app.get('/api',(req,res)=>{
const language = req.query.language;
const time_stamp = req.query.time_stamp;
connection.query(`SELECT * FROM ${language} WHERE TIMESTAMP('${time_stamp}') < time_stamp`, (err, rows) => {
  if (err) {
    console.log(err);
    res.sendStatus(500);
  } else {
    res.send(rows);
  }
});
    // res.send("Hi We are Live");
})
app.post('/api',(req,res)=>{
    var data = req.body
    const currentTimestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    const language = req.query.language
    var Data = [data.id,data.operation,currentTimestamp,data.word]
    connection.query(`INSERT INTO ${language}(id,operation,time_stamp,word) values(?)`,[Data],(err,rows)=>{
        if(err){
            console.log(err);
        }else{
            res.send(rows);
        }
    })
})


app.listen(PORT,()=>{
    console.log('express server is running on port 3000');
})