import React, { useState } from 'react';
import axios from 'axios';
import url from '../constants/url';
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';

import { Button, TextField } from '@material-ui/core';


function CardForm() {
  const [number, setNumber] = useState('')
  const [name, setName] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [focus, setFocus] = useState('')
  const [errors, setErrors] = useState({
    name: "",
    number: "",
    cvc: "",
    expiry: ""
  })

  function validate() {
    let err = {}
    console.log("validate- ", name, number, expiry, cvc)
    err.name = name === "" ? "Name is required" : ""

    err.number  = ""
    if (number === "") {
      err.number = "Card Number is required"
    } else {
      const nRe = /^([0-9]{16})$/;
      if (! nRe.test(number))
        err.number = "Card number is a 16 digit number"
    }
    
    err.cvc = ""
    if (cvc === "") {
      err.cvc = "CVC is required"
    } else {
      const cRe = /^[1-9][0-9]{2,3}$/;
      if (! cRe.test(cvc))
        err.cvc = "Please enter number of 3 or 4 digits"
    }

    err.expiry = ""
    if (expiry === "") {
      err.expiry = "Expiry date is required"
    } else {
      const exRe = /^(0[1-9]|1[0-2])\/?((0[1-9])|([1-9][0-9]))$/;
      if (! exRe.test(expiry))
        err.expiry = "Please enter a valid date (mm/YY)"
    }
    
  
    setErrors(err)
    return Object.values(err).every(x => x === "")

  }

  async function sendData() {
    let body = {
      name: name,
      number: number,
      expiry: expiry,
      cvc: cvc
    }
    axios.post(`${url}/cards`, {
      data: body
    })
    .then((resp) => {
      window.alert('Successfully Saved Card Details');
    })
    .catch((err) => {
      console.log(err);
      window.alert('Error while sending data');
    });
  }

  async function handleSubmit() {
    // console.log("handle submit = ", name, number, expiry, cvc);

    // validate
    let valid = validate();
    if (valid) {
      await sendData();
    } else {
      console.log("unsuccessful")
    }
  }

  return (
    <div className="card-form">
      <div className="card-display">
        <Cards
          name={name}
          number={number}
          expiry={expiry}
          cvc={cvc}
          focused={focus}
        />
      </div>
      <div className="form-container">
        <TextField className="form-item" variant="outlined"
          id="number"
          size="small"
          label="Card Number"
          placeholder="Card Number"
          onFocus={() => {setFocus('number')}}
          onChange={(e) => {setNumber(e.target.value)}}
          error={errors.number !== ""}
          helperText={errors.number}
        />
        <TextField className="form-item" variant="outlined"
          id="name"
          label="Cardholder Name"
          size="small"
          placeholder="Cardholder Name"
          onFocus={() => {setFocus('name')}}
          onChange={(e) => {setName(e.target.value)}}
          error={errors.name !== ""}
          helperText={errors.name}
        />

        <div className="form-item">
          <TextField
            id="expiry"
            label="Expiry Date"
            variant="outlined" type="string"
            size="small"
            placeholder="mm/yy"
            onFocus={() => {setFocus('expiry')}}
            onChange={(e) => {setExpiry(e.target.value)}}
            error={errors.expiry !== ""}
            helperText={errors.expiry}
          />
          <TextField variant="outlined" type="number"
            id="cvc"
            size="small"
            placeholder="cvc"
            label="CVC"
            onFocus={() => {setFocus('cvc')}}
            onChange={(e) => {setCvc(e.target.value)}}
            error={errors.cvc !== ""}
            helperText={errors.cvc}
          />
        </div>
        <Button variant="contained"
          className="form-item"
          color="primary" onClick={handleSubmit}
        >
          Submit
        </Button>
      </div>
        
    </div>
  );
}

export default CardForm;
