var express = require('express');
var r = express.Router();

// load pre-trained model
const cls_model = require('./sdk/cls_model.js'); // cls

// Bot Setting
const TelegramBot = require('node-telegram-bot-api');
const token = '2023612436:AAEmK7CTNAM8zv3JsvEkjxV0BbUZKiumDdA'
const bot = new TelegramBot(token, {polling: true});

state = 0;
// Main Menu bot
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(
        msg.chat.id,
        `hello ${msg.chat.first_name}, welcome...\n
        click /classify`
    );   
    state = 0;
});

// input requires i and r
bot.onText(/\/classify/, (msg) => { 
    bot.sendMessage(
        msg.chat.id,
        `masukan nilai s|k contohnya 30|700`
    );   
    state = 1;
});

bot.on('message', (msg) => {
    if(state == 1){
        s = msg.text.split("|");
        cls_model.classify(
            [
                parseFloat(s[0]), // string to float
                parseFloat(s[1])
            ]
        ).then((jres1)=>{
          console.log(jres1);
            cls_model.classify([parseFloat(s[0]), parseFloat(s[1]), parseFloat(jres1[0])]).then((jres2)=>{
             bot.sendMessage(
                msg.chat.id,
                `Keadaan pompa yang diprediksi adalah ${jres1[0]}`
            ); 
            
            bot.sendMessage(
                msg.chat.id,
                `Klasifikasi keadaan pompa ${jres2}`
            ); 
            state = 0;
          })
       })
    }else{
         bot.sendMessage(
                msg.chat.id,
                `please click /start `    
             );
        state = 0;
    }
})

// routers
r.get('/classify/:s/:k', function(req, res, next) {    
   cls_model.classify(
        [
            parseFloat(req.params.s), // string to float
            parseFloat(req.params.k)   
        ]     
 ).then((jres)=>{
       res.json(jres);
       cls_model.classify(
           [
                parseFloat(req.params.s), // string to float
                parseFloat(req.params.k),
                parseFloat(jres[0])
           ]
           
       ).then((jres_)=>{
           res.json(jres_)
       
       })
   })
});


module.exports = r;
