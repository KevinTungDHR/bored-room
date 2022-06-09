import React from 'react';
import { AiFillTrophy } from 'react-icons/ai';

const GameEnd = ({ assets, users }) => {
    const displayPlayers = () => {
        const winner = assets.players.find(player => player.color === assets.winner);
        const losers = assets.players.filter(player => player.color !== assets.winner);

        return (
            <div>
                <div className='endgame-header'>
                    <h1>{users[winner._id].handle} Wins!!!</h1>
                    <div className='winner-score'>
                        <AiFillTrophy className="ai-trophy-icon" />
                    </div>
                    <div>Elo Rating: {users[winner._id].eloRating.dontStop}</div>
                </div>

                <div className='final-score'>
                    <table>
                        <tr>
                            <th>Name</th>
                            <th>Elo Rating</th>
                        </tr>

                        <tr>
                            <td>{users[winner._id].handle}</td>
                            <td>{users[winner._id].eloRating.dontStop}</td>
                        </tr>

                        {losers.map((player, i) => {
                            return (
                                <tr>
                                    <td>{users[player._id].handle}</td>
                                    <td>{users[player._id].eloRating.dontStop}</td>
                                </tr>
                            )
                        })}
                    </table>
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

export default GameEnd;
