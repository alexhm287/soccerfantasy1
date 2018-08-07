
import React, { Component } from 'react'
import AuthInterface from '../../utils/AuthInterface'
import AddBtn from '../../components/AddBtn'

class PlayerList extends Component {

  addPlayer(args) {
    console.log("Adding player...:", args.target.id);
    const playerId = args.target.id
    this.props.addPlayer(playerId);
  }

  render() {
    const { players } = this.props
    const user = AuthInterface.getUser()

    return (
      <div>
        {
          players.length ? (
            <div style={{ left: '41%', overflow: 'none' }}>
              {
                players.map( player => (
                  <div key={ player.id }  className='row'>
                      <img src={ player.imgUrl }></img>
                      <div className='text-left col-md-7 col-md-offset-1'
                            style={{ paddingTop: 2, paddingBottom: 2, paddingRight: 20, marginTop: 2, marginBottom: 2, borderRadius: 10 }}>
                            <strong style={{ paddingRight: 20 }}>{ player.name }  ({ '$' + (player.strength * 10000)}) </strong>
                            <AddBtn id={player.id} onClick={this.addPlayer.bind(this)}/>
                      </div>
                  </div>
                ))
              }
            </div>
          ) : (
            <h2 className='text-center alert alert-warning'>
              No Players to pick.  Create more players.
            </h2>
          )
        }
      </div>
    )
  }
}

export default PlayerList
