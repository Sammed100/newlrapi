require("dotenv").config()
const connection = require('./connection');
const express = require('express');
const morgan = require('morgan');
const moment = require('moment-timezone');
const bodyParser = require('body-parser');
var app = express();
const cors = require('cors')
app.use(cors())
app.use(morgan('dev'));
app.use(bodyParser.json())

const PORT = process.env.PORT || 3000;
function getCurrentDateTime() {
  const date = new Date();
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}
app.get('/api',(req,res)=>{
  // const server_getting_request = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss.SSS');
  // console.log(server_getting_request);
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  const server_getting_request = getCurrentDateTime();
  console.log(`Current date and time: ${server_getting_request}`);
const language = req.query.language;
const time_stamp = req.query.time_stamp;
connection.query(`SELECT * FROM data_table WHERE language='${language}' AND TIMESTAMP('${time_stamp}') < time_stamp`, (err, rows) => {
  if (err) {
    console.log(err);
    res.sendStatus(500);
  } else {
    // const server_sending_response = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss.SSS');
    // console.log(server_sending_response);
    const server_sending_response = getCurrentDateTime();
  console.log(`Current date and time: ${server_sending_response}`);
    res.send(rows);
  }
});
    
})
app.post('/api',(req,res)=>{
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
    var data = req.body
    const currentTimestamp = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
    const language = req.query.language
    var Data = [data.id,language,data.operation,currentTimestamp,data.word]
    connection.query(`INSERT INTO data_table(id,language,operation,time_stamp,word) values(?)`,[Data],(err,rows)=>{
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