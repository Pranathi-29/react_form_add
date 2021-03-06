const express = require("express");
const app = express();
const port = 5000;
const fs = require('fs');
const util = require("util");
const isEmpty = require('lodash.isempty');
const bodyParser = require('body-parser');


//flash
const session = require('express-session');
const flash = require('connect-flash');

const readFileAsync = util.promisify(fs.readFile);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
var t;


app.use(session({
    secret: 'happy dog',
    saveUninitialized: true,
    resave: true
}));

app.use(flash());

const BASE_DATA_PATH = "D:\\ps\\React forms\\up\\punjab-mdms-data\\data\\pb"
const path = require("path");


function getMasterFilePath(tenant, module, master) {
    // TODO: will come from the starting metaData

    return path.join(BASE_DATA_PATH, module, master + '.json');
}

async function getMasterData(tenant, module, master) {

    let data = await readFileAsync(getMasterFilePath(tenant, module, master), 'utf8');
    // console.log(JSON.parse(data)["tenants"]);
    return JSON.parse(data)["tenants"];

}



async function updateMasterData(tenant, module, master, updatedTenant) {

    let data = await readFileAsync(getMasterFilePath(tenant, module, master), 'utf8');

    let currentData = JSON.parse(data);
    console.log(currentData);

    var index = -1;

    for (var i in currentData.tenants) {
        if (currentData.tenants[i].code == updatedTenant.code) {
            index = i;
            break;
        }
    }


    if (index == -1) {
        currentData.tenants.push(updatedTenant);
    } else {
        currentData.tenants[index] = updatedTenant
    }

    let newContent = JSON.stringify(currentData);

    fs.writeFile(getMasterFilePath(tenant, module, master), newContent, 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
    const lol = await readFileAsync(getMasterFilePath(tenant, module, master), 'utf8');
    return JSON.parse(JSON.stringify(lol))["tenants"];

}

async function deleteRecord(tenant, module, master, records) {

    let data = await readFileAsync(getMasterFilePath(tenant, module, master), 'utf8');

    let currentData = JSON.parse(data);
    console.log(currentData);

    var index = -1;
    for (var i in records) {
        for (var j in currentData.tenants) {
            if (currentData.tenants[j].code == records[i].code) {
                index = i;
                currentData.tenants.splice(j, 1);
                break;
            }
        }

    }



    let newContent = JSON.stringify(currentData);

    fs.writeFile(getMasterFilePath(tenant, module, master), newContent, 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
    const lol = await readFileAsync(getMasterFilePath(tenant, module, master), 'utf8');
    return JSON.parse(JSON.stringify(lol))["tenants"];
}


app.get("/", (req, res) => {
    res.send("Hello guysss");
    console.log("Good job.Keep moving!");
});

app.get("/masters/:tenant/:module/:master", async (req, res) => {

    let p = req.params;

    let data = await getMasterData(p.tenant, p.module, p.master);
    res.send(data);
});

app.post("/masters/:tenant/:module/:master/add", async (req, res) => {

    let p = req.params;
    var newTenant = req.body.body;
    if (isEmpty(newTenant)) {
        console.log('Empty Object');
    }

    console.log(newTenant);
    let a = await updateMasterData(p.tenant, p.module, p.master, newTenant);
    console.log(a);

    //res.send(req.flash('success', 'Form submitted successfully'));

    res.send(a);
})

app.post("/masters/:tenant/:module/:master/update", async (req, res) => {
    let p = req.params;
    var newTenant = req.body.body;

    if (isEmpty(newTenant)) {
        console.log('Empty Object');
    }
    console.log(newTenant);

    let u = await updateMasterData(p.tenant, p.module, p.master, newTenant);
    console.log(u);
    res.send(u);

})

app.post("/masters/:tenant/:module/:master/delete", async (req, res) => {
    let p = req.params;
    var delTenants = req.body.body;

    if (isEmpty(delTenants)) {
        console.log('Empty Object');
    }
    console.log(delTenants);

    let d = await deleteRecord(p.tenant, p.module, p.master, delTenants);
    console.log(d);
    res.send(d);

})



app.listen(port, () => console.log("App running on port 5000"));