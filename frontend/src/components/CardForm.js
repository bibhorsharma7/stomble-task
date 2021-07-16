import React, { useState, useEffect } from 'react';
import axios from 'axios';
import url from '../constants/url';
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';
import { Button, TextField, Select, MenuItem, InputLabel } from '@material-ui/core';


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

    return checkErros();
  }

  function checkErros() {
    return (nameErr !== "" || numErr !== ""
      || expErr !== "" || cvcErr !== "")
  }

  async function handleSubmit() {
    // check for empty inputs
    
    if (name === "")
      setNameErr("Name is required")
    if (number === "")
      setNumErr("Number is required")
    if (expiry === "")
      setExpErr("Expiry date is required")
    if (cvc === "")
      setCvcErr("CVC is required")

    if (checkErros) {
      // validate from inputs
      let valid = validate();    
      if (valid) {
        await sendData();
      }
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
        validate();
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
        <InputLabel>Select from saved Cards</InputLabel>
        <Select
          label="Saved Cards"
          className="form-item"
          size="small"
          variant="outlined"
          label="Saved Cards"
          value={selected}
          onChange={handleSelect}
        >
          <MenuItem value={null}>None</MenuItem>
          {saved.map((obj, i) => <MenuItem value={obj}>{obj.name.toUpperCase() + " " + obj.number}</MenuItem>)}
        </Select>

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

        {/* <InputLabel>Cardholder Name</InputLabel> */}
        <TextField className="form-item" variant="outlined"
          id="name"
          value={name}
          label="Cardholder Name"
          InputLabelProps={{shrink: true}}
          size="small"
          onFocus={() => {setFocus('name')}}
          onChange={(e) => {setSelected(null); setName(e.target.value)}}
          error={nameErr !== ""}
          helperText={nameErr}
        />

        <div className="form-item">
          <div>
            {/* <InputLabel>Expiry Date</InputLabel> */}
            <TextField
              id="expiry"
              value={expiry}
              label="Expiry Date"
              InputLabelProps={{shrink: true}}
              placeholder="mm/yy"
              inputProps={{ maxLength: 5}}
              variant="outlined" type="string"
              size="small"
              onFocus={() => {setFocus('expiry')}}
              onChange={(e) => {setSelected(null); setExpiry(e.target.value)}}
              error={expErr !== ""}
              helperText={expErr}
            />
          </div>
          <div>
            {/* <InputLabel>CVC</InputLabel> */}
            <TextField variant="outlined"
              id="cvc"
              size="small"
              value={cvc}
              label="CVC"
              InputLabelProps={{shrink: true}}
              inputProps={{ maxLength: 4}}
              onFocus={() => {setFocus('cvc')}}
              onChange={(e) => {setSelected(null); setCvc(e.target.value)}}
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
