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
    this.list_display = ["name", "code", "emailId", "city.districtName"];

    this.pages_in_pagination = 20;
    this.list_per_page = 10;
  }


  get_queryset(page_number, list_per_page, queryset) {


    axios.get("/masters/pb/tenant/tenants").then(response => {


      this.set_queryset(response.data);
      
      console.log("You is amazee!");

    });

    return queryset;


  }

  form_submit(form) {
    let tenant = form.formData;

    if (form.edit) {
      console.log("This is a edit", tenant)
      this.state.queryset.splice(this.state.queryset.indexOf(this.state.object), 1, tenant);

      //var ind=this.state.queryset.indexOf(this.state.object);
      //console.log(ind);
      this.response_change(tenant);
    }
    else {

      this.response_add(tenant);
    }
  }


  response_add(d) {
    console.log(d);
    axios.post("/masters/pb/tenant/tenants/add", {
      headers: {
        'Content-Type': 'application/json'
      },
      body: d
    }).then(response => {


      this.set_queryset(response.data);

      console.log(typeof (response.data));
      console.log(response.data);

    });

    this.setState({
      object: null,
      queryset: this.get_queryset(this.state.page_number, this.list_per_page, this.state.queryset)
    });
  }

  response_change(d) {
    console.log(d);
    axios.post("/masters/pb/tenant/tenants/update", {
      headers: {
        'Content-Type': 'application/json'
      },
      body: d
    }).then(response => {


      this.set_queryset(response.data);

      console.log(typeof (response.data));
      console.log(response.data);

    });
    this.setState({
      object: null,
      queryset: this.get_queryset(this.state.page_number, this.list_per_page, this.state.queryset)
    });
  }

  get_actions() {
    return {
      "delete": (selected_objects) => {

        for (let object of selected_objects) {
          axios.post("/masters/pb/tenant/tenants/delete", {
            headers: {
              'Content-Type': 'application/json'
            },
            body: object
          }).then(response => {

           
            this.set_queryset(response.data);
            console.log(typeof (response.data));
            console.log(response.data);
           
          })

        }
        this.set_queryset(this.get_queryset());
        
      }
    }

  }
  get_form(object = null) {
    let schema = {
      "$schema": "http://json-schema.org/schema#",
      "type": "object",
      "properties": {
        "code": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "emailId": {
          "type": "string"
        },


        "city": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "districtCode": {
              "type": "string"
            },
            "districtName": {
              "type": "string"
            },
            "code": {
              "type": "string"
            }
          },
          "required": [
            "code",
            "districtCode",
            "districtName",
            "name"
          ]
        }
      }
    };

    if (!object) {
      return <Form schema={schema} onSubmit={this.form_submit.bind(this)} />;
    } else {
      console.log("return form with data", object);
      return <Form schema={schema} formData={object} onSubmit={this.form_submit.bind(this)} />;
    }
  }



}