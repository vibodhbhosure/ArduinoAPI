const functions = require("firebase-functions");
const express = require("express");
const firebase = require("firebase/compat/app");
// var bodyParser = require('body-parser');
require("firebase/compat/database");
var cors = require('cors')

const app = express();
app.use(cors())
// app.use(bodyParser.urlencoded({extended: true}));

const firebaseConfig = {
    apiKey: "AIzaSyAkGsc6urg6wEkV2MmpwKMp208fRlrlPLI",
    authDomain: "arduinogasproject.firebaseapp.com",
    databaseURL: "https://arduinogasproject-default-rtdb.firebaseio.com",
    storageBucket: "arduinogasproject.appspot.com",
    projectId: "arduinogasproject",
    messagingSenderId: "888584033864",
    appId: "1:888584033864:web:04a4de04c524533e296a7d",
};

const fireDB = firebase.initializeApp(firebaseConfig);
const Todo = fireDB.database();

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/api/:apiKey/getData", (req, res) => {

    const apiAuth = req.params.apiKey;

    if (apiAuth != "KeyA20222023") {
        res.sendFile(__dirname + "/failure.html");
    }

    let co2 = [];
    let dust = [];
    let epoch = [];
    let eth = [];
    let h2 = [];
    let hum = [];
    let lat = [];
    let lon = [];
    let mq135 = [];
    let o3 = [];
    let temp = [];
    let voc = [];

    Todo.ref("Todo").once("value")
        .then((snapshot) => {
            const data = snapshot.val();
            Object.entries(data).forEach((element) => {
                co2.push(element[1].co2);
                dust.push(element[1].dust);
                epoch.push(element[1].epoch);
                h2.push(element[1].h2);
                eth.push(element[1].eth);
                hum.push(element[1].humidity);
                lat.push(element[1].lat);
                lon.push(element[1].lon);
                mq135.push(element[1].mq135);
                o3.push(element[1].o3);
                temp.push(element[1].temp);
                voc.push(element[1].voc);
            });

            let newEpoch = [];

            epoch.forEach((item, index) => {
                item = Number(item);
                item += 19800;
                var date = new Date(item * 1000);
                var hours = date.getHours();
                var minutes = "0" + date.getMinutes();
                var seconds = "0" + date.getSeconds();
                item = date + "-" + hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);
                newEpoch[index] = item;
            });

            const datatoSend = {
                co2: co2.map(Number),
                dust: dust.map(Number),
                epoch: newEpoch,
                h2: h2.map(Number),
                eth: eth.map(Number),
                hum: hum.map(Number),
                lat: lat.slice(-1)[0],
                lon: lon.slice(-1)[0],
                mq135: mq135.map(Number),
                o3: o3.map(Number),
                temp: temp.map(Number),
                voc: voc.map(Number)
            }
            res.status(200).send(datatoSend);
        });
});

app.get("/api/:apiKey/getData/:unix/adjustTime/:adjustTime", (req, res) => {
    const adjustTime = Number(req.params.adjustTime);
    const unixTime = Number(req.params.unix);
    const apiAuth = req.params.apiKey;

    const adjustUnixTimeUp = unixTime + 60 * adjustTime;
    const adjustUnixTimeDown = unixTime - 60 * adjustTime;

    if (apiAuth != "KeyA20222023") {
        res.sendFile(__dirname + "/failure.html");
    }

    let co2 = [];
    let dust = [];
    let epoch = [];
    let eth = [];
    let h2 = [];
    let hum = [];
    let lat = [];
    let lon = [];
    let mq135 = [];
    let o3 = [];
    let temp = [];
    let voc = [];
    let indexArr = [];

    let Newco2 = [];
    let Newdust = [];
    let Newepoch = [];
    let Neweth = [];
    let Newh2 = [];
    let Newhum = [];
    let Newlat = [];
    let Newlon = [];
    let Newmq135 = [];
    let Newo3 = [];
    let Newtemp = [];
    let Newvoc = [];

    Todo.ref("Todo").once("value")
        .then((snapshot) => {
            const data = snapshot.val();
            Object.entries(data).forEach((element) => {
                co2.push(element[1].co2);
                dust.push(element[1].dust);
                epoch.push(element[1].epoch);
                h2.push(element[1].h2);
                eth.push(element[1].eth);
                hum.push(element[1].humidity);
                lat.push(element[1].lat);
                lon.push(element[1].lon);
                mq135.push(element[1].mq135);
                o3.push(element[1].o3);
                temp.push(element[1].temp);
                voc.push(element[1].voc);
            });


            epoch.forEach((item, index) => {
                item = Number(item);
                if (item >= adjustUnixTimeDown && item <= adjustUnixTimeUp) {
                    indexArr.push(index);
                }
            });

            indexArr.forEach((item) => {
                Newco2.push(co2[item]);
                Newdust.push(dust[item]);
                Newepoch.push(epoch[item]);
                Newh2.push(h2[item]);
                Neweth.push(eth[item]);
                Newhum.push(hum[item]);
                Newlat.push(lat[item]);
                Newlon.push(lon[item]);
                Newmq135.push(mq135[item]);
                Newo3.push(o3[item]);
                Newtemp.push(temp[item]);
                Newvoc.push(voc[item]);
            });

            let newEpoch = [];

            Newepoch.forEach((item, index) => {
                item = Number(item);
                item += 19800;
                var date = new Date(item * 1000);
                var hours = date.getHours();
                var minutes = "0" + date.getMinutes();
                var seconds = "0" + date.getSeconds();
                item = date + "-" + hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);
                newEpoch[index] = item;
            });

            const datatoSend = {
                co2: Newco2.map(Number),
                dust: Newdust.map(Number),
                epoch: newEpoch,
                h2: Newh2.map(Number),
                eth: Neweth.map(Number),
                hum: Newhum.map(Number),
                lat: Newlat.slice(-1)[0],
                lon: Newlon.slice(-1)[0],
                mq135: Newmq135.map(Number),
                o3: Newo3.map(Number),
                temp: Newtemp.map(Number),
                voc: Newvoc.map(Number)
            }
            res.status(200).send(datatoSend);
        });
});


app.get("/api/:apiKey/getData/:unix/To/:toTime", (req, res) => {
    const toTime = Number(req.params.toTime);
    const fromTime = Number(req.params.unix);
    const apiAuth = req.params.apiKey;



    if (apiAuth != "KeyA20222023") {
        res.sendFile(__dirname + "/failure.html");
    }

    let co2 = [];
    let dust = [];
    let epoch = [];
    let eth = [];
    let h2 = [];
    let hum = [];
    let lat = [];
    let lon = [];
    let mq135 = [];
    let o3 = [];
    let temp = [];
    let voc = [];
    let indexArr = [];

    let Newco2 = [];
    let Newdust = [];
    let Newepoch = [];
    let Neweth = [];
    let Newh2 = [];
    let Newhum = [];
    let Newlat = [];
    let Newlon = [];
    let Newmq135 = [];
    let Newo3 = [];
    let Newtemp = [];
    let Newvoc = [];

    Todo.ref("Todo").once("value")
        .then((snapshot) => {
            const data = snapshot.val();
            Object.entries(data).forEach((element) => {
                co2.push(element[1].co2);
                dust.push(element[1].dust);
                epoch.push(element[1].epoch);
                h2.push(element[1].h2);
                eth.push(element[1].eth);
                hum.push(element[1].humidity);
                lat.push(element[1].lat);
                lon.push(element[1].lon);
                mq135.push(element[1].mq135);
                o3.push(element[1].o3);
                temp.push(element[1].temp);
                voc.push(element[1].voc);
            });

            epoch.forEach((item, index) => {
                item = Number(item);
                if (item >= fromTime && item <= toTime) {
                    indexArr.push(index);
                }
            });

            indexArr.forEach((item) => {
                Newco2.push(co2[item]);
                Newdust.push(dust[item]);
                Newepoch.push(epoch[item]);
                Newh2.push(h2[item]);
                Neweth.push(eth[item]);
                Newhum.push(hum[item]);
                Newlat.push(lat[item]);
                Newlon.push(lon[item]);
                Newmq135.push(mq135[item]);
                Newo3.push(o3[item]);
                Newtemp.push(temp[item]);
                Newvoc.push(voc[item]);
            });

            let newEpoch = [];

            Newepoch.forEach((item, index) => {
                item = Number(item);
                item += 19800;
                var date = new Date(item * 1000);
                var hours = date.getHours();
                var minutes = "0" + date.getMinutes();
                var seconds = "0" + date.getSeconds();
                item = date + "-" + hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);
                newEpoch[index] = item;
            });

            const datatoSend = {
                co2: Newco2.map(Number),
                dust: Newdust.map(Number),
                epoch: newEpoch,
                h2: Newh2.map(Number),
                eth: Neweth.map(Number),
                hum: Newhum.map(Number),
                lat: Newlat.slice(-1)[0],
                lon: Newlon.slice(-1)[0],
                mq135: Newmq135.map(Number),
                o3: Newo3.map(Number),
                temp: Newtemp.map(Number),
                voc: Newvoc.map(Number)
            }
            res.status(200).send(datatoSend);
        });
});


// app.listen(process.env.PORT || 4000, () => {
//     console.log("Server is running at port 4000");
// });

exports.app = functions.https.onRequest(app)