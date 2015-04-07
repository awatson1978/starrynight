Schemas = {};

Schemas.Customer = new SimpleSchema({
  FirstName: {
    type: String,
    label: "First Name",
    max: 64
  },
  LastName: {
    type: String,
    label: "Last Name",
    max: 64
  },
  FullName: {
    type: String,
    label: "Full Name",
    max: 128
  },
  Company: {
    type: String,
    label: "Company",
    max: 64
  },
  Address: {
    type: String,
    label: "Address",
    max: 256
  },
  City: {
    type: String,
    label: "City",
    max: 64
  },
  State: {
    type: String,
    label: "State",
    max: 64
  },
  State: {
    type: String,
    label: "State",
    max: 64
  },
  Zip: {
    type: String,
    label: "Zip",
    regEx: /(^\d{5}$)|(^\d{5}-\d{4}$)/
  },
  Phone: {
    type: String,
    label: "Phone",
    regEx: /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/i
  },
  Fax: {
    type: String,
    label: "Fax",
    regEx: /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/i,
    optional: true    
  },
  Email: {
    type: String,
    label: "Email",
    regEx: /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/
  },
  Web: {
    type: String,
    label: "Web",
    regEx: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
  },
  Notes: {
    type: String,
    label: "Notes",
    max: 1024,
    optional: true
  }
});
