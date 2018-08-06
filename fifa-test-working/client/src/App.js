
import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
// import Conversations from './pages/Conversations'
import Dashboard from './pages/Dashboard'
import Auth from './pages/Auth'
import NoMatch from './pages/NoMatch'
import Nav from './components/Nav'
import PrivateRoute from './utils/PrivateRoute'

const App = () => (
  <Router>
    <div>
      <Nav />
      <Switch>
        <Route exact path='/login' component={ Auth } />
        <PrivateRoute exact path='/' component={ Dashboard } />
        <Route component={ NoMatch } />
      </Switch>
    </div>
  </Router>
)

export default App
