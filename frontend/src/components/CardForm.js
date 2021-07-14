import React, { useState } from 'react';
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';
import {Button, TextField} from '@material-ui/core';

function CardForm() {
  const [number, setNumber] = useState('')
  const [name, setName] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [focus, setFocus] = useState('')

  

  return (
    <div className="card-form">
      <Cards
        name={name}
        number={number}
        expiry={expiry}
        cvc={cvv}
        focused={focus}
      />
      <div className="form-container">
        <TextField className="form-item" variant="outlined"
          size="small"
          label="Card Number"
          placeholder="Card Number"
          onFocus={() => {setFocus('number')}}
          onChange={(e) => {setNumber(e.target.value)}}
        />
        <TextField className="form-item" variant="outlined"
          label="Cardholder Name"
          size="small"
          placeholder="Cardholder Name"
          onFocus={() => {setFocus('name')}}
          onChange={(e) => {setName(e.target.value)}}
        />

        <div className="form-item">
          <TextField variant="outlined" type="date" size="small"
            label="Expiry Date"
            onFocus={() => {setFocus('expiry')}}
          />
          <TextField variant="outlined" type="number"
            size="small"
            placeholder="CVV"
            label="CVC"
            onFocus={() => {setFocus('cvc')}}
            onChange={(e) => {setCvv(e.target.value)}}
          />
        </div>

        <Button className="form-item" variant="contained"
          color="primary" onClick={console.log("submit clicked")}>
            Submit
        </Button>
      </div>
    </div>
  );
}

export default CardForm;
