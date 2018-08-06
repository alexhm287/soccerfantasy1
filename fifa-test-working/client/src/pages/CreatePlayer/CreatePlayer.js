
import React, { Component } from 'react'
import { Col, Row, Container } from '../../components/Grid'
import { List, ListItem } from '../../components/List'
import { Input, FormBtn } from '../../components/Form'
import ErrorDisplay from '../../components/ErrorDisplay'
import API from '../../utils/API'
import "./CreatePlayer.css"

class NewPlayer extends Component {

  state = {
    name: '',
    errors: []
  }

  dismissError = idx => {
    const { errors } = this.state

    errors.splice(idx, 1)

    this.setState({ errors })
  }

  handleInputChange = event => {
    const { name, value } = event.target
    this.setState({
      [name]: value
    })
  }

  handleFormSubmit = (event, history) => {
    event.preventDefault()
    const { name } = this.state
    console.log("Creating player with name: " + name);
    if ( !name ) return

    API.createPlayer({ name })
      .then( res => {
        console.log(res);
        const { errors } = res.data

        if ( errors ) {
          console.log(errors);
          return this.setState({ errors })
        }
        this.props.updatePlayers()
      //  history.push('/')
      })
      .catch(console.error)
  }

  render() {
    const { name, errors } = this.state
    const { history } = this.props

    return (
      <Container fluid>
        <Row>
          <Col size='md-4'>
                <div>
                  <div style={{ marginBottom: 25 }}>
                    <h3>Create Player</h3>
                    <Input
                      value={ name }
                      onChange={ this.handleInputChange }
                      onKeyDown={ event => (event.keyCode === 13) && this.handleFormSubmit(event, history) }
                      name='name'
                      placeholder='Player Name (required)'
                    />
                  </div>
                  <div>
                    <FormBtn
                      disabled={ !name }
                      onClick={ event => this.handleFormSubmit(event, history) }
                    >
                      Create
                    </FormBtn>
                  </div>
                </div>
            </Col>
        </Row>
        <ErrorDisplay errors={ errors } dismiss={ this.dismissError } />
      </Container>
    )
  }

}

export default NewPlayer
