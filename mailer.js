
//Подкючение модулей
const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const mailer = require('nodemailer');
const path = require('path')
const app = express() // Создаётся приложение 


// Авторизация  в почте  
const transpoter = mailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})


app.use(bodyParser.urlencoded({extended:true})) 
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname))) //Определяютя статически файлы
app.use(function (req, res, next) {
    res.set({
           'Content-Type': 'application/json',
           'Access-Control-Allow-Origin': '*'
       })
  next();
});



app.get('/main', (req, res)=>{
    res.sendFile(path.join(__dirname, 'index.html'));
})



app.post('/mail', (req, res)=>{ // при Get запросе будет вызываться функцию котора отправляет сообщение 
    if(!req.body) return res.sendStatus( 400)
    console.log(req.body)
    //Настройи для сообщения 
    const messageOption = {
        from: 'trudorit500@gmail.com',
        to: req.body.emaill,
        subject: 'Обмен валюты',
        text: `Здравствуйте, вы записались на обмен валюты ${req.body.value.coinObj.get} RUB на ${req.body.value.coinObj.give} ${req.body.coin}`
    }
    transpoter.sendMail(messageOption, (err)=>{
        if(err) res.sendStatus(400)
        
    })
    res.sendStatus(200)
    
})





const PORT =  process.env.PORT || 3000
app.listen(PORT, ()=>{ // Слушается порт 3000
    
    console.log('Сервер запущен ' + PORT)
})










