import React, { Fragment, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { login } from '../../actions/auth'
import { setAlert } from '../../actions/alert'
import PropTypes from 'prop-types'
// import axios from 'axios'

// Use Of React Hook
const Login = ({ setAlert, login, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  // Object DeStructuring
  const { email, password } = formData

  // Form Values Are Populated From onChange Method
  const onChange = e => {
    // copy of formData will be replaced by key's targeted value
    // setFormData call will update the state with new value
    return setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = async e => {
    e.preventDefault()
    if (email == null || password == null) {
      setAlert('Invalid Email Password Combination', 'danger')
    } else {
      login(email, password)
      //   const newUser = {
      //     // same as {name: name, email: email, password: password}
      //     name,
      //     email,
      //     password
      //   }
      try {
        // const config = {
        //   headers: {
        //     'Content-Type': 'application/json'
        //   }
        // }
        // const body = JSON.stringify(newUser)
        // const res = await axios.post('/api/users', body, config)
        // console.log(res.data)
        console.log(formData)
      } catch (err) {
        console.log(err.response.data)
      }
    }
  }

if(isAuthenticated){
  return <Redirect to="/dashboard" />
}
  
  return (
    <Fragment>
      <h1 className='large text-primary'>Sign Up</h1>
      <p className='lead'>
        <i className='fas fa-user' /> Create Your Account
      </p>
      <form className='form' onSubmit={e => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            minLength='6'
            value={password}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <input type='submit' className='btn btn-primary' value='Login' />
      </form>
      <p className='my-1'>
        Dpn't have an account? <Link to='/register'>Sign Up</Link>
      </p>
    </Fragment>
  )
}

Login.propTypes = {
  setAlert: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
})


export default connect(
  mapStateToProps,
  { setAlert, login }
)(Login)
