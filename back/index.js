const express=require("express");
const app=express();
const port=5000;
const fs = require('fs');
const util = require("util");
const isEmpty = require('lodash.isempty');

const readFileAsync = util.promisify(fs.readFile);
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
var t;


const BASE_DATA_PATH = "D:\\ps\\React forms\\add\\punjab-mdms-data\\data\\pb"
const path = require("path");


function getMasterFilePath(tenant, module, master) {  
    // TODO: will come from the starting metaData

    return path.join(BASE_DATA_PATH, module, master + '.json');
}

async function getMasterData(tenant, module, master) {

    let data= await readFileAsync(getMasterFilePath(tenant, module, master),'utf8');
    return JSON.parse(data)["tenants"];

}

async function addRecordToMaster(tenant, module, master, record) {

    let data= await readFileAsync(getMasterFilePath(tenant, module, master),'utf8');
    
    let currentData= JSON.parse(data);
   
    currentData.tenants.push(record);
    
    let newContent=JSON.stringify(currentData);
    
    fs.writeFile(getMasterFilePath(tenant, module, master), newContent, 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
    let lol= await readFileAsync(getMasterFilePath(tenant, module, master),'utf8');
    return JSON.parse(JSON.stringify(lol))["tenants"];
    
}

async function updateMasterData(tenant, module, master,index, data) {
     
}



app.get("/",(req,res)=>{
    res.send("Hello guysss");
    console.log("Good job.Keep moving!");
});

app.get("/masters/:tenant/:module/:master",async (req,res)=>{

    let p = req.params;
    
    let data = await getMasterData(p.tenant, p.module, p.master);   
    //console.log(data);
    res.send(data);
});

app.post("/masters/:tenant/:module/:master/add", async(req,res) =>{
      
    let p = req.params;
    let newTenant=req.body;
    if(isEmpty(req.body)) {
        console.log('Empty Object');
    }
    // let newTenant={
    //     "code": "pb.abohar",
    //     "name": "Abohar",
    //     "description": "Abohar",
    //     "logoId": "http://mseva.lgpunjab.gov.in/pb-egov-assets/pb.abohar/logo.png",
    //     "imageId": null,
    //     "domainUrl": "http://lgpunjab.gov.in/eSewa/abohar",
    //     "type": "CITY",
    //     "twitterUrl": null,
    //     "facebookUrl": null,
    //     "emailId": "eomcabh@yahoo.in",
    //     "OfficeTimings": {
    //       "Mon - Fri": "9.00 AM - 5.00 PM"
    //     },
    //     "city": {
    //       "name": "Abohar",
    //       "localName": "Abohar",
    //       "districtCode": "6",
    //       "districtName": "Fazilka",
    //       "districtTenantCode": "pb.fazilka",
    //       "regionName": "Ferozepur Region",
    //       "ulbGrade": "Municipal Corporation",
    //       "longitude": 74.1993,
    //       "latitude": 30.1453,
    //       "shapeFileLocation": null,
    //       "captcha": null,
    //       "code": "601",
    //       "regionCode": "3",
    //       "municipalityName": "Abohar",
    //   "ddrName": "Ferozepur-DDR"
    //     },
    //     "address": "Not available",
    //     "contactNumber": "1634220233"
    //   };
    console.log(newTenant);
    let s=await addRecordToMaster(p.tenant, p.module, p.master,newTenant );
    console.log(s);
    res.send(s);
    
})

app.post("/masters/:tenant/:moduleName/:masterName/update",(req,res)=>{
    // Draft 2
    
})



app.listen(port,()=>console.log("App running on port 5000"));