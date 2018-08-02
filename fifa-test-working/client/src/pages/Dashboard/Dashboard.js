
import React, { Component } from 'react'
import API from '../../utils/API'
import io from 'socket.io-client'
import AuthInterface from '../../utils/AuthInterface'
import { Link } from 'react-router-dom'
import { Col, Row, Container } from '../../components/Grid'
import { List, ListItem } from '../../components/List'
import { Input, FormBtn } from '../../components/Form'
import MessageList from '../../components/MessageList'
import CreatePlayer from '../../pages/CreatePlayer'
import PlayerList from '../../components/PlayerList'
import MyPlayerList from '../../components/MyPlayerList'
import TeamList from '../../components/TeamList'
import "./Dashboard.css"

class Dashboard extends Component {
  state = {
      user: {},
      users: [],
      players: [],
      myPlayers: [],
      team: {},
      matchScore: "You havn't played any matches yet!",
      budgetMsg: "Don't know your budget yet."
  };

  componentDidMount() {
    this.updatePlayers()
  }

  addPlayer(playerId) {
    const user = AuthInterface.getUser()
    API.addPlayerToTeam(user.id, playerId).then(res => {
      console.log("Added player to team");
      console.log(res);
      const user = AuthInterface.getUser()
      user.budget = res.data.budget;
      this.updatePlayers()
    })
  }

  updateMatchScore(score, matches) {
    var ms = "You won " + score + " out of " + matches + " matches."
    this.setState({matchScore: ms})
  }

  removePlayer(playerId) {
    const user = AuthInterface.getUser()
    API.removePlayerFromTeam(user.id, playerId).then(res => {
        console.log("Removing player from team");
        this.updatePlayers()
    })
  }

  updatePlayers() {
    console.log("************ Updating state...");
    const user = AuthInterface.getUser()
    if (!user.budget) {
      user.budget = 300000;
    }
    var msg = "Your budget is $" + user.budget;
    this.setState({ budgetMsg: msg })
    console.log(user);
    // Find or create the teams
    API.getMyTeam(user.id).then (res => {
      const team = res.data;
      console.log("Team: ", res);
      if (!team) {
        console.log("Creating team...");
        API.createMyTeam({uid: user.id, title: user.username}).then(res => {
            console.log("Created team");
            this.setState({ team: res.data })
            API.getMyPlayers(user.id).then( res => {
              this.setState({ myPlayers: res.data })
            })
            .catch(console.error)
        })
      }
      else {
        this.setState({ team: res.data })
        API.getMyPlayers(user.id).then( res => {
          console.log("My players: ", res.data)
          this.setState({ myPlayers: res.data })
        })
        .catch(console.error)
      }
    })
    API.getPlayers().then( res => {
      this.setState({ players: res.data })
    })
    .catch(console.error)
    console.log("************ Getting users...");
    API.getUsers().then( res => {
      console.log(res);
      this.setState({ users: res.data.users })
    })
    .catch(console.error)

  }

    render() {
        return (
          <Container fluid>
            <Row>
              {this.state.matchScore}
            </Row>
            <Row>
              {this.state.budgetMsg}
            </Row>
            <Row>
              <CreatePlayer updatePlayers={this.updatePlayers.bind(this)}/>
            </Row>
            <Row>
              <Col size="md-12">
                <h2>Select Players</h2>
                <PlayerList players={this.state.players} addPlayer={this.addPlayer.bind(this)}/>
              </Col>
            </Row>
          <Row>
            <Col size="md-12">
            <h2>My Players</h2>
            <MyPlayerList players={this.state.myPlayers} removePlayer={this.removePlayer.bind(this)}/>
            </Col>
          </Row>
          <Row>
            <Col size="md-6">
              <h2>Play Teams</h2>
              <TeamList users={this.state.users} updateMatch={this.updateMatchScore.bind(this)} />
            </Col>
          </Row>
        </Container>
        );
    }
}

export default Dashboard;
