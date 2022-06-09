import React from 'react';
import { AiFillTrophy } from 'react-icons/ai';

const TeamGameEnd = ({ blueUsers, redUsers, blueTeam, redTeam, assets }) => {
    const displayPlayers = () => {
        const [winnerScore, loserScore] = assets.winner === 'Blue Team' ? [assets.bluePoints, assets.redPoints] : [assets.redPoints, assets.bluePoints]
        const redTeamHash = redTeam.reduce((obj, cur) => Object.assign(obj, { [cur._id]: cur }), {});
        const blueTeamHash = blueTeam.reduce((obj, cur) => Object.assign(obj, { [cur._id]: cur }), {});
        const [winHash, loseHash] = assets.winner === 'Blue Team' ? [blueTeamHash, redTeamHash] : [redTeamHash, blueTeamHash]
        const [winningTeam, losingTeam] = assets.winner  === 'Blue Team' ? [blueUsers, redUsers] : [redUsers, blueUsers]

        return (
            <div>
                <div className='endgame-header'>
                    <h1>{assets.winner} Wins!!!</h1>
                    <div className='winner-score'>
                        <span>{winnerScore}</span>
                        <AiFillTrophy className="ai-trophy-icon" />
                    </div>
                </div>
               <div className='endgame-score-container'>
                <div>Winners</div>
                  <div className='team-final-score'>
                      <table>
                          <tr>
                              <th>Name</th>
                              <th>Score</th>
                              <th>Elo Rating</th>
                          </tr>

                          {winningTeam.map((player, i) => {
                              return (
                                  <tr>
                                      <td>{player.handle}</td>
                                      <td>{winnerScore}</td>
                                      <td>{winHash[player._id].endingElo}</td>
                                  </tr>
                              )
                          })}
                      </table>
                  </div>
                  <div>Losers</div>
                  <div className='team-final-score'>
                      <table>
                          <tr>
                              <th>Name</th>
                              <th>Score</th>
                              <th>Elo Rating</th>
                          </tr>

                          {losingTeam.map((player, i) => {
                              return (
                                  <tr>
                                      <td>{player.handle}</td>
                                      <td>{loserScore}</td>
                                      <td>{loseHash[player._id].endingElo}</td>
                                  </tr>
                              )
                          })}
                      </table>
                  </div>
               </div>
            </div>
        )
    }

    return (
        
        <div>
            {displayPlayers()}
        </div>
    )
}

export default TeamGameEnd;
