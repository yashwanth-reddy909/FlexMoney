import React,{useState} from 'react'
import Form from 'react-bootstrap/Form';
import axios from 'axios'; 
import validator from 'validator';

const DefaultState = {
    FullName: '',
    Age: '',
    EmailId: '', 
    Shift: ''
}


function SignUp(){
    const [inputField , setInputField] = useState(DefaultState);
    const inputsHandler = (e) =>{
        setInputField( prev => ({...prev, [e.target.name]: e.target.value}) )
    }
    const shiftHandler = (e) =>{
        if(e.target.value === 'No subscription'){
            setInputField( prev => ({...prev, Shift: ''}) )
        }
        else{
            setInputField( prev => ({...prev, Shift: e.target.value}) )
        }
    }
    function setResult(s){
        document.getElementById('SignUpResult').innerHTML = s;
    }
    const handleSubmit=()=>{
        console.log(inputField);
        let {Shift, ...k} = inputField;
        if(Shift!==''){
          k = {...k,Shift: Shift}
        }
        if(!inputField.FullName || !inputField.EmailId || inputField.Age===null){
            setResult('Some required fields are empty');
            return null;
        }
        if(inputField.Age<18 || inputField.Age>65){
            setResult('Age should be in between 18 to 65');
            return null;
        }
        if(!validator.isEmail(inputField.EmailId)){
          setResult('Email should be valid');
          return null;
        }
        axios.post('/backendapi/users',k)
        .then((resp)=>{
            setResult('Subscribed successfully<a href=\'/sign-in\'>Check your subscription</a>');
        })
        .catch((err)=>{
            document.getElementById('SignUpResult').innerHTML = 'Email already exists try signin';
        });
    }
    return (
      <div>
        <h3 className="signupTitle">Sign Up</h3>
        <div className="mb-3">
          <input
            type="text"
            name="FullName"
            className="form-control"
            placeholder="* First name"
            onChange={inputsHandler}
            value={inputField.FullName}
          />
        </div>
        <div className="mb-3">
          <input
            type="email"
            name="EmailId"
            className="form-control"
            placeholder="* Enter email"
            value={inputField.EmailId}
            onChange={inputsHandler}
          />
        </div>
        <div className="mb-3">
          <input
            type="number"
            name="Age"
            className="form-control"
            placeholder="* Enter age"
            value={inputField.Age}
            onChange={inputsHandler}
          />
        </div>
        <div className="selectShift">
        <Form.Select aria-label="Default select example" onChange={shiftHandler} value={inputField.Shift}>
            <option>No subscription</option>
            <option value="1">6-7AM</option>
            <option value="2">7-8AM</option>
            <option value="3">8-9AM</option>
            <option value="4">5-6PM</option>
        </Form.Select>
        <div className="shifttext">
        <Form.Text className="text-muted">
          By selecting this you need to pay 500 rupees
        </Form.Text>
        </div>
        </div>
        <div className="d-grid" >
          <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
            Sign Up {inputField.Shift === '' ? '' :  <span>& pay 500 &#8377;</span>}
          </button>
        </div>
        <div id='SignUpResult' ></div>
        <p className="forgot-password text-right">
          Already registered <a href="/sign-in">sign in?</a>
        </p>
      </div>
    )
};

export default SignUp