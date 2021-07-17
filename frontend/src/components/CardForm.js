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

  const [saved, setSaved] = useState([])
  const [selected, setSelected] = useState(null)

  const [errors, setErrors] = useState({
    name: "",
    number: "",
    cvc: "",
    expiry: ""
  })
  
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
    let data = {
      name: name,
      number: number,
      expiry: expiry,
      cvc: cvc
    }
    axios.post(`${url}/cards`, {
      data: data
    })
    .then((resp) => {
      window.alert('Successfully Saved Card Details');
      getData()
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
  }
  
  // fetch data when page first loads
  useEffect(() => {
    getData();
  },[]);

  // input validation on input change
  useEffect(() => {
    validate();
  },[name,number,expiry,cvc,setErrors])

  // Auto-format the input for expiry date
  useEffect(() => {
    if (expiry !== "") {
      let parts = expiry.match(/[0-9]{1,2}/g);
      setExpiry(parts.join('/'))
    }
  },[expiry])

  // Auto-format the input for card number
  useEffect(() => {
    if (number !== "") {
      let parts = number.match(/[0-9]{1,4}/g);
      setNumber(parts.join(' '));
    }
  },[number])


  function validate() {
    let err = {name:"",number:"", expiry:"", cvc:""}

    const nameRe = /.*[0-9].*$/;
    if (nameRe.test(name))
      err.name = "Please enter a valid name"

    const nRe = /^([0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4})$/;
    if (! nRe.test(number))
      err.number = "Card number is a 16 digit number"
    
    const cRe = /^[1-9][0-9]{2,3}$/;
    if (! cRe.test(cvc))
      err.cvc = "Please enter number of 3 or 4 digits"

    const exRe = /^(0[1-9]|1[0-2])\/((0[1-9])|([1-9][0-9]))$/;
    if (! exRe.test(expiry))
      err.expiry = "Please enter a valid date (mm/YY)"
    
    // Do not check for empty values during onChange
    if (name === "")
      err.name = ""
    if (number === "")
      err.number = ""
    if (expiry === "")
      err.expiry = ""
    if (cvc === "")
      err.cvc = ""
    
    setErrors(err)
    return Object.values(err).every(x => x === "")
  }

  async function handleSubmit() {
    // input validation
    let valid = validate();

    // check for empty values only while submitting
    let err = {
      name: errors.name,
      number: errors.number,
      expiry: errors.expiry,
      cvc: errors.cvc
    }
    if (name === "")
      err.name = "Name is required"
    if (number === "")
      err.number = "Number is required"
    if (expiry === "")
      err.expiry = "Expiry date is required"
    if (cvc === "")
      err.cvc = "CVC is required"


    const empty = Object.values(err).every(x => x === "")
    if (!empty) {
      setErrors(err);
    }

    if (valid && empty) {
      await sendData();
    }
    // else {
    //   console.log('invalid');
    // }
  }

  function handleSelect(e) {
    e.preventDefault();
    let card = e.target.value;
    setSelected(card);
    // clear form if no selection
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
          value={selected === null ? '' : selected}
          onChange={handleSelect}
        >
          <MenuItem value={null}>None</MenuItem>
          {saved.map((obj, i) => <MenuItem key={i} value={obj}>{obj.name.toUpperCase() + " " + obj.number}</MenuItem>)}
        </TextField>

        <TextField className="form-item" variant="outlined"
          id="number"
          size="small"
          value={number}
          label="Card Number"
          InputLabelProps={{shrink: true}}
          inputProps={{ maxLength: 19 }}
          onFocus={() => {setFocus('number')}}
          onChange={handleChange}
          error={errors.number !== ""}
          helperText={errors.number}
        />

        <TextField className="form-item" variant="outlined"
          id="name"
          value={name}
          label="Cardholder Name"
          InputLabelProps={{shrink: true}}
          size="small"
          onFocus={() => {setFocus('name')}}
          onChange={handleChange}
          error={errors.name !== ""}
          helperText={errors.name}
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
              error={errors.expiry !== ""}
              helperText={errors.expiry}
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
              error={errors.cvc !== ""}
              helperText={errors.cvc}
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
