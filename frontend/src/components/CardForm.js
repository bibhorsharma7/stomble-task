import React, { useState } from 'react';
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


  function setErr() {
    let err = {}
    err.name = name === "" ? "Name is required" : ""
    err.number = number.length < 16 ? "Card number should be atleast 16 digits" : ""
    err.cvc = ""
    if (cvc.length < 3 || cvc.length > 4)
      err.cvc = "cvc must be 3 or 4 digits"
    err.expiry = expiry === "" ? "Expiry date is required" : ""  
  
    setErrors(err)
  }

  function validate() {
    return Object.values(errors).every(x => x === "")
  }

  function handleChange(e) {
    const { id, value } = e.target
    switch (id) {
      case "name":
        setName(value);
        break;
      case "number":
        setNumber(value);
        break;
      case "expiry":
        setExpiry(value);
        break;
      case "cvc":
        setCvc(value);
        break;      
    }
    setErr()
  }

  function handleSubmit(e) {
    // validate
    if (validate()){
      // make api post call
      console.log('valid')
    } else {
      console.log('invalid')
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
          onChange={handleChange}
          error={errors.number === "" ? false : true}
          helperText={errors.number}
        />
        <TextField className="form-item" variant="outlined"
          id="name"
          label="Cardholder Name"
          size="small"
          placeholder="Cardholder Name"
          onFocus={() => {setFocus('name')}}
          onChange={handleChange}
          error={errors.name === "" ? false : true}
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
            onChange={handleChange}
            {...(errors.expiry !== "" && {error:true, helperText:errors.expiry})}
          />
          <TextField variant="outlined" type="number"
            id="cvc"
            size="small"
            placeholder="cvc"
            label="CVC"
            onFocus={() => {setFocus('cvc')}}
            onChange={handleChange}
            {...(errors.cvc !== "" && {error:true, helperText:errors.cvc})}
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
