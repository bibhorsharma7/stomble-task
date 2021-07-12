import React, { useState } from 'react';
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';
import {TextField} from '@material-ui/core';

function CardForm() {
  const [number, setNumber] = useState('')
  const [name, setName] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')

  function handleChange(e) {
    setName(e.target.value);
  }

  return (
    <div>
      <h1>Hello there</h1>
      <h2>General Kenobi!</h2>
      <Cards
        name={name}
        number={number}
        expiry={expiry}
        cvv={cvv}
      />
      <TextField placeholder="Cardholder Name" onChange={handleChange} />
    </div>
  );
}

export default CardForm;
