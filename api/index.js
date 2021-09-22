var express = require('express');
var r = express.Router();

// load pre-trained model
const model_cls = require('./sdk/cls_model.js'); // cls

// Bot Setting
const TelegramBot = require('node-telegram-bot-api');
const token = '1972720869:AAGJiyg_WdkXlve2a9gnz7DPV-OigX_65ow'
const bot = new TelegramBot(token, {polling: true});

state = 0;
// Main Menu bot
bot.onText(/\/start/, (msg) => { 
    bot.sendMessage(
        msg.chat.id,
        `hello ${msg.chat.first_name}, welcome...\n
        click /menu to main menu`
    );   
    state = 0;
});

// input requires i and r
bot.onText(/\/menu/, (msg) => { 
    bot.sendMessage(
        msg.chat.id,
        `masukan nilai s|k contohnya 27|300`
    );   
    state = 1;
});

bot.on('message', (msg) => {
    if(state == 1){
        s = msg.text.split("|");
        model.predict(
            [
                parseFloat(s[0]), //string to float
                parseFloat(s[1])
            ]
        ).then ((jres1)=>{
            console.log(jres1);
            
            cls_model.classify([parseFloat(s[0]), parseFloat(s[1]), parseFloat(jres1[0]), parseFloat(jres1[1])]).then((jres2)=>{
             bot.sendMessage(
                msg.chat.id,
                `nilai v yang diprediksi adalah ${jres1[0]} volt `
            ); 
            bot.sendMessage(
                msg.chat.id,
                `nilai p yang diprediksi adalah ${jres1[1]} watt `    
            );
            bot.sendMessage(
                msg.chat.id,
                `Klasifikasi Tegangan ${jres2}`
            ); 
                state = 0;
            }))
        })
    }else{
        bot.sendMessage(
            msg.chat.id,
            `Please Click /start`
        );
        state = 0;
    }
})

// routers
r.get('/prediction/:i/:r', function(req, res, next) {    
    model.predict(
        [
            parseFloat(req.params.s), // string to float
            parseFloat(req.params.k)
        ]   
    ).then((jres)=>{
        res.json(jres);
    })
});

// routers
r.get('/classify/:i/:r', function(req, res, next) {    
    model.predict(
        [
            parseFloat(req.params.s), // string to float
            parseFloat(req.params.k)
        ]   
    ).then((jres)=>{
        cls_model.classify(
            [
                parseFloat(req.params.s), // string to float
                parseFloat(req.params.k),
                parseFloat(jres[0]),
                parseFloat(jres[1])
            ]  
        ).then((jres_)=>{
            res.json({jres, jres_})
        })
    })
});

module.exports = r;
