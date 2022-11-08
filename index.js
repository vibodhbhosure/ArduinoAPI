const express = require("express");
var firebase = require("firebase/compat/app");
require("firebase/compat/database"); 

const app = express();

const firebaseConfig = {
    apiKey: "AIzaSyAkGsc6urg6wEkV2MmpwKMp208fRlrlPLI",
    authDomain: "arduinogasproject.firebaseapp.com",
    databaseURL: "https://arduinogasproject-default-rtdb.firebaseio.com",
    projectId: "arduinogasproject",
    storageBucket: "arduinogasproject.appspot.com",
    messagingSenderId: "888584033864",
    appId: "1:888584033864:web:04a4de04c524533e296a7d"
  };
  
const fireDB = firebase.initializeApp(firebaseConfig)
let Todo =  fireDB.database(); 

app.get("/", (req, res) => {
    res.sendFile(__dirname+"/index.html");
});

app.get("/getData", (req, res) => {
    
    var co2 = [];
    var dust = [];
    var epoch = [];
    var eth = [];
    var h2 = [];
    var hum = [];
    var lat = [];
    var lon = [];
    var mq135 = [];
    var o3 = [];
    var temp = [];
    var voc = [];

    Todo.ref("Todo").once("value")
    .then((snapshot) => {
    const data = snapshot.val();
    Object.entries(data).forEach((element) => {
        co2.push(element[1].co2);
        dust.push(element[1].dust);
        epoch.push(element[1].epoch);
        h2.push(element[1].h2);
        eth.push(element[1].eth);
        hum.push(element[1].hum);
        lat.push(element[1].lat);
        lon.push(element[1].lon);
        mq135.push(element[1].mq135);
        o3.push(element[1].o3);
        temp.push(element[1].temp);
        voc.push(element[1].voc);
    });

    const datatoSend = {
        co2:co2.map(Number),
        dust:dust.map(Number),
        epoch:epoch,
        h2:h2.map(Number),
        eht:eth.map(Number),
        hum:hum.map(Number),
        lat:lat.slice(-1)[0],
        lon:lon.slice(-1)[0],
        mq135:mq135.map(Number),
        o3:o3.map(Number),
        temp:temp.map(Number),
        voc:voc.map(Number)
    }
    res.send(datatoSend);
});
});

app.listen(process.env.PORT || 4000, () => {
    console.log("Server is running at port 4000");
});