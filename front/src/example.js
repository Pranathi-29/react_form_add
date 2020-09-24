import React from "react";
import Admin from "react-crud-admin";
import Form from "react-jsonschema-form";
import axios from "axios";

import "react-crud-admin/css"; //optional css import

export default class Example extends Admin {
  constructor() {
    super();
    this.name = "Tenant";
    this.name_plural = "Tenants";
    this.list_display_links = ["name"];
    this.list_display = ["name","code","emailId", "city.districtName"];
  
    this.pages_in_pagination = 20;
    
  }
  

  get_queryset(page_number, list_per_page, queryset) {
    axios.get("/masters/pb/tenant/tenants").then(response => {
               
        
        this.set_queryset(response.data);
        console.log("You is amazee!");
      
    });    

  return queryset;
   

  }
  
  form_submit(form)
  {
let tenant=form.formData;

if(form.edit)
{
    var ind=this.state.queryset.indexOf(this.state.object);
    this.response_change(ind,tenant["tenants"]);
}
else
{
    
    this.response_add(tenant["tenants"]);
}
  }
 

  response_add(d){
    console.log(d);
    axios.post("/masters/pb/tenant/tenants/add",{
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(d)
    }).then(response => {
             
      
      this.set_queryset(response.data);
      
      console.log(typeof(response.data));
      console.log(response.data);

  });

  this.setState({
    object :null,
    queryset: this.get_queryset(this.state.page_number,this.list_per_page,this.state.queryset)
});
}

response_change(i,d)
{
  this.setState({
                 object :null,
                 queryset: this.get_queryset(this.state.page_number,this.list_per_page,this.state.queryset)
	       });
}

  get_form(object = null) {
    let schema ={
      "$schema": "http://json-schema.org/schema#",
      "type": "object",
      "properties": {
        "tenantId": {
          "type": "string",
          "default":"pb"
        },
        "moduleName": {
          "type": "string",
          "default":"tenant"
        },
        "tenants": {
            "type": "object",
            "properties": {
              "code": {
                "type": "string"
              },
              "name": {
                "type": "string"
              },
              "description": {
                "type": "string"
              },
              "logoId": {
                "type": "string"
              },
              "imageId": {
                "type": "null"
              },
              "domainUrl": {
                "type": "string"
              },
              "type": {
                "type": "string"
              },
              "twitterUrl": {
                "type": "null"
              },
              "facebookUrl": {
                "type": "null"
              },
              "emailId": {
                "type": "string"
              },
              "OfficeTimings": {
                "type": "object",
                "properties": {
                  "Mon - Fri": {
                    "type": "string"
                  }
                },
                "required": [
                  "Mon - Fri"
                ]
              },
              "city": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string"
                  },
                  "localName": {
                    "type": "string"
                  },
                  "districtCode": {
                    "type": "string"
                  },
                  "districtName": {
                    "type": "string"
                  },
                  "districtTenantCode": {
                    "type": "string"
                  },
                  "regionName": {
                    "type": "string"
                  },
                  "ulbGrade": {
                    "type": "string"
                  },
                  "longitude": {
                    "type": "number"
                  },
                  "latitude": {
                    "type": "number"
                  },
                  "shapeFileLocation": {
                    "type": "null"
                  },
                  "captcha": {
                    "type": "null"
                  },
                  "code": {
                    "type": "string"
                  },
                  "regionCode": {
                    "type": "string"
                  },
                  "municipalityName": {
                    "type": "string"
                  },
                  "ddrName": {
                    "type": "string"
                  }
                },
                "required": [
                 
                  "code",
                  "ddrName",
                  "districtCode",
                  "districtName",
                  "districtTenantCode",
                  "latitude",
                  "localName",
                  "longitude",
                  "municipalityName",
                  "name",
                  "regionCode",
                  "regionName",
                  
                  "ulbGrade"
                ]
              },
              "address": {
                "type": "string"
              },
              "contactNumber": {
                "type": "string"
              }
            },
            "required": [
              "OfficeTimings",
              "address",
              "city",
              "code",
              "contactNumber",
              "description",
              "domainUrl",
              "emailId",
              
              
              "logoId",
              "name",
              
              "type"
            ]
          
        }
      },
      "required": [
        "moduleName",
        "tenantId",
        "tenants"
      ]
    };
    
    if (!object) {
      return <Form schema={schema} onSubmit={this.form_submit.bind(this)}/>;
    } else {
      return <Form schema={schema} formData={object} onSubmit={this.form_submit.bind(this)}/>;
    }
  }
 
 
  
}