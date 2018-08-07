
import React, { Component } from 'react'
import AuthInterface from '../../utils/AuthInterface'
import DeleteBtn from '../../components/DeleteBtn'
import { Input, FormBtn } from '../../components/Form'
import API from '../../utils/API'

class TeamList extends Component {

  state = {
    teams: {}
  }

  playTeam(args) {
    const user = AuthInterface.getUser()
    const oppenentUserId = args.target.id;
    API.playMatch(user.id, oppenentUserId).then(res => {
        const teams = this.state.teams;
        teams[oppenentUserId] = res.data.won? 1 : -1
        this.setState({ teams: teams })
        var score = 0;
        var matches = 0;
        for (var key in teams) {
          matches++;
          var won = teams[key]
          if (won == 1) {
            score += 1
          }
        }
        this.props.updateMatch(score, matches, res.data.won)
    })
  }

  render() {
    const { users } = this.props;
    const userMe = AuthInterface.getUser();
    
    let getButton = (user) => {
      let button;
      if (!this.state.teams[user.id]) {
        button = (<FormBtn id={user.id}
                    onClick={this.playTeam.bind(this)}
                  >
                    Play Match!
                  </FormBtn>)
      }
      else if (this.state.teams[user.id] == 1) {
        button = (<div>You Won!</div>)
      }
      else if (this.state.teams[user.id] == -1) {
        button = (<div>You Lost!</div>)
      }
      return button;
    }

    return (
      <div>
        {
          users.length ? (
            <div style={{ overflow: 'none' }}>
              {
                users.map( user => {
                  if (user.id == userMe.id) return;
                  return (
                    <div key={ user.id }  className='row'>
                        <div className='text-left col-md-10 col-md-offset-1'
                              style={{ paddingTop: 2, paddingBottom: 2, marginTop: 2, marginBottom: 2, borderRadius: 10 }}>
                              <strong>{ user.username }</strong>
                              {getButton(user)}
                        </div>
                    </div>
                  )}
                )
              }
            </div>
          ) : (
            <h2 className='text-center alert alert-warning'>
              No Other Teams to Play
            </h2>
          )
        }
      </div>
    )
  }
}

export default TeamList
