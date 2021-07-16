import React, { useState, useEffect } from 'react';
import axios from 'axios';
import url from '../constants/url';
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';
import { Button, TextField, MenuItem } from '@material-ui/core';


function CardForm() {
  const [number, setNumber] = useState('')
  const [name, setName] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [focus, setFocus] = useState('')

  const [nameErr, setNameErr] = useState('')
  const [numErr, setNumErr] = useState('')
  const [expErr, setExpErr] = useState('')
  const [cvcErr, setCvcErr] = useState('')

  const [saved, setSaved] = useState([])
  const [selected, setSelected] = useState(null)

  
  async function getData() {
    axios.get(`${url}/cards`)
    .then((resp) => {
      setSaved(resp.data);
    })
    .catch((err) => {
      console.log('Something went wrong');
      window.alert('Error occured while loading data');
    });
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
      if (err.response.status === 303) {
        window.alert(err.response.data);
      } else if (err.response.status === 400) {
        window.alert(err.response.data);
      } else {
        window.alert('Error while sending data');
      }
    })
    .then(() => {
      getData();
    });
  }
  
  useEffect(() => {
    getData();
  },[]);

  function validate() {
    clearErrros();
    const nameRe = /.*[0-9].*$/;
    if (nameRe.test(name))
      setNameErr("Please enter a valid name")

    const nRe = /^([0-9]{16})$/;
    if (! nRe.test(number))
      setNumErr("Card number is a 16 digit number")
    
    const cRe = /^[1-9][0-9]{2,3}$/;
    if (! cRe.test(cvc))
      setCvcErr("Please enter number of 3 or 4 digits")

    const exRe = /^(0[1-9]|1[0-2])\/?((0[1-9])|([1-9][0-9]))$/;
    if (! exRe.test(expiry))
      setExpErr("Please enter a valid date (mm/YY)")
    
    // Different error for empty input
    if (name === "")
      setNameErr("Name is required")
    if (number === "")
      setNumErr("Number is required")
    if (expiry === "")
      setExpErr("Expiry date is required")
    if (cvc === "")
      setCvcErr("CVC is required")
    
    return checkErros();
  }

  function clearErrros() {
    setNameErr('')
    setNumErr('')
    setExpErr('')
    setCvcErr('')
  }

  function checkErros() {
    return (nameErr !== "" || numErr !== ""
      || expErr !== "" || cvcErr !== "")
  }

  async function handleSubmit() {
    // validate from inputs
    let valid = validate();    
    if (valid) {
      await sendData();
    }
  }

  function handleSelect(e) {
    e.preventDefault();
    let card = e.target.value;
    setSelected(card);
    if (card === null) {
      setName('');
      setNumber('');
      setExpiry('');
      setCvc('');
    } else {
      setName(card.name);
      setNumber(card.number);
      setExpiry(card.expiry);
      setCvc(card.cvc);
    }
    setNameErr('');
    setNumErr('');
    setExpErr('');
    setCvcErr('');
  }

  function handleChange(e) {
    const { id, value } = e.target;
    setSelected(null);
    switch (id) {
      case "name":
        setName(value)
        break;
      case "number":
        setNumber(value)
        break;
      case "expiry":
        setExpiry(value)
        break;
      case "cvc":
        setCvc(value)
        break;
      default:
        break;
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
        <TextField
          select
          label="Saved Cards"
          InputLabelProps={{shrink: true}}
          className="form-item"
          size="small"
          variant="outlined"
          value={selected}
          onChange={handleSelect}
        >
          <MenuItem value={null}>None</MenuItem>
          {saved.map((obj, i) => <MenuItem value={obj}>{obj.name.toUpperCase() + " " + obj.number}</MenuItem>)}
        </TextField>

        <TextField className="form-item" variant="outlined"
          id="number"
          size="small"
          value={number}
          label="Card Number"
          InputLabelProps={{shrink: true}}
          inputProps={{ maxLength: 16 }}
          onFocus={() => {setFocus('number')}}
          onChange={handleChange}
          error={numErr !== ""}
          helperText={numErr}
        />

        <TextField className="form-item" variant="outlined"
          id="name"
          value={name}
          label="Cardholder Name"
          InputLabelProps={{shrink: true}}
          size="small"
          onFocus={() => {setFocus('name')}}
          onChange={handleChange}
          error={nameErr !== ""}
          helperText={nameErr}
        />

        <div className="form-item">
          <div>
            <TextField
              id="expiry"
              value={expiry}
              label="Expiry Date"
              InputLabelProps={{shrink: true}}
              placeholder="mm/yy"
              inputProps={{ maxLength: 5}}
              variant="outlined"
              size="small"
              onFocus={() => {setFocus('expiry')}}
              onChange={handleChange}
              error={expErr !== ""}
              helperText={expErr}
            />
          </div>
          <div>
            <TextField variant="outlined"
              id="cvc"
              size="small"
              value={cvc}
              label="CVC"
              InputLabelProps={{shrink: true}}
              inputProps={{ maxLength: 4}}
              onFocus={() => {setFocus('cvc')}}
              onChange={handleChange}
              error={cvcErr !== ""}
              helperText={cvcErr}
            />
          </div>
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
