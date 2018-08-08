import React, { Component } from 'react'
import { Col, Row, Container } from '../../components/Grid'
import "./Welcome.css"
import { Input, FormBtn } from '../../components/Form'
import Jumbotron from '../../components/Jumbotron'

const Welcome = () => (
    <div className='welcome'>
    <Container fluid>
    <Row>
    <Col size='sm-12'>
    <FormBtn
    onClick={ this.handleFormSubmit }
    >
    Enter
    </FormBtn>

    
    </Col>
    </Row>
    </Container>
    </div>
)

export default Welcome;