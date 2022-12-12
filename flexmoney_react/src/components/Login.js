import React, { useState } from 'react'
import Form from 'react-bootstrap/Form';
import axios from 'axios'; 

function GetShift(k){
    if(k===1){
        return "6-7AM"
    }
    else if(k===2){
        return "7-8AM"
    }
    else if(k==3){
        return "8-9AM"
    }
    return "5-6PM";
}

function refreshPage() {
    window.location.reload(false);
}

function Login(){
    const [mailId,setMailId] = useState('');
    const [login,setLogin] = useState(false);
    const [dt,setDt] = useState({});
    const [shift,setShift] = useState('');
    function setResult(s){
        document.getElementById('rechargeerror').innerHTML = s;
    }
    const handleClick = () =>{
        if(mailId){
            axios.get('/backendapi/users/'+mailId+'/recharge')
            .then((resp)=>{
                console.log(resp.data);
                setDt(resp.data);
                setLogin(true);
                setResult('');
            })
            .catch((err)=>{
                setResult('Email nor registered<a href=\'/sign-up\'>Signup</a>');
            });
        }
        else{
            setResult('EmailId required') 
        }
    }
    function handlemailChange(e){
        setMailId(e.target.value);
    }
 
    function shiftHandler(e){
      if(e.target.value==='No subscription'){
        setShift('');
      }
      else{
        setShift(e.target.value);
      }
    }

    function addSub(){
      if(shift===''){
        document.getElementById('suberror').innerHTML = 'Shift required';
        return null;
      }
      axios.post('/backendapi/users/'+mailId+'/recharge',{Shift: shift})
      .then((resp)=>{
          console.log(resp.data);
          if(resp.data.Expire === false){
              document.getElementById('suberror').innerHTML = 'Transaction successfully <a href=\'/sign-in\'>Home</a>'
          }
      })
      .catch((err)=>{
        document.getElementById('suberror').innerHTML = 'Transaction Failed';
      });
    }

    return (
        <div>{login===false ? ( <div>
        <h3 className="signupTitle">Sign In</h3>
        <div className="mb-3">
          <input
            type="email"
            onChange={handlemailChange}
            value={mailId}
            className="form-control"
            placeholder="Enter email"
          />
        </div>
        <div className="d-grid">
          <button type="submit" className="btn btn-primary" onClick={handleClick}>
            Submit
          </button>
        </div>
        <div id='rechargeerror'></div>
      </div>) :
        //user logged in UI
      (<div>
        <h3 className="signupTitle">Hi, {dt.User.FullName}</h3>
        {/* user didn't had subscription ui */}
        {dt.Expire === false ? (<div className='Paymentdetails'>
            Total Amount paid so far {dt.User.AmountPaid}<br/>
            Shift {GetShift(dt.Subscription.Shift)}<br/>
            Thanks for being an active subscriber<br/>
            Expire Date: {dt.Subscription.ExpirationDate}<br/>
            <button className="btn btn-primary mb" onClick={refreshPage}>
                Back to Home
          </button>
        </div>)
        // user subscribed
         :(<div  className='Paymentdetails'>
            Your are not Subscribed to any Yoga Class this month<br/>
            Total Amount paid so far {dt.User.AmountPaid}<br/>
            <Form.Select aria-label="Default select example" onChange={shiftHandler} value={shift}>
              <option>No subscription</option>
              <option value="1">6-7AM</option>
              <option value="2">7-8AM</option>
              <option value="3">8-9AM</option>
              <option value="4">5-6PM</option>
            </Form.Select>
            <button className="btn btn-primary mb" onClick={addSub}>
                Subscribe & pay 500 &#8377; 
          </button>
          <div id='suberror'></div>
        </div>)
         }
      </div>)
    }
    </div>)
}

export default Login;
