
import React from 'react'
import { Link, Route } from 'react-router-dom'
import AuthInterface from '../../utils/AuthInterface'
import "./Nav.css";

const Nav = () => (
  <nav className='navbar navbar-inverse navbar-top'>
    <div className='container-fluid'>
      <div className='navbar-header'>
        <Link to='/' className='navbar-brand'>
          Coding BootCamp FC ⚽️
        </Link>
      </div>
      {
        AuthInterface.isLoggedIn() ? (
          <Route render={ (props) => (
              
            <div
              className='navbar-brand pull-right'
              style={{ cursor: 'pointer' }}
              onClick={ () => AuthInterface.logout(props.history) }
            >
              Logout, { AuthInterface.getUser().username }
            </div>

          )} />
        ) : null
      }
    </div>
  </nav>
)

export default Nav
