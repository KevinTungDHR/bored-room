import React from 'react';
import { AiFillTrophy } from 'react-icons/ai';

const GameEnd = ({ allPlayers, allUsers }) => {
    const displayPlayers = (players, users) => {
        const allPlayers = {};
        players.forEach((player) => allPlayers[player._id] = player.score)
        const winnerId = Object.keys(allPlayers).reduce(function(a, b) { return allPlayers[a] > allPlayers[b] ? a : b })
        const loserIds = Object.keys(allPlayers).filter((key) => key !== winnerId );
        const winnerScore = allPlayers[winnerId];
        const winner = users.filter(user => user._id === winnerId);
        const winnerElo = winner[0].eloRating.takingSix;

        let winnerHandle; 

        users.forEach((user) => {
            if (user._id === winnerId) {
                winnerHandle = user.handle;
            } 
        })
        
        return (
            <div>
                <div className='endgame-header'>
                    <h1>{winnerHandle} Wins!!!</h1>
                    <div className='winner-score'>
                        <span>{winnerScore}</span>
                        <AiFillTrophy className="ai-trophy-icon" />
                    </div>
                    <div>Elo Rating: {winnerElo}</div>
                </div>

                {/* AllPlayers.score, ._id */}
                {/* allUsers.eloRating.takingSix, .handle, ._id */}
                <div className='final-score'>
                    <table>
                        <tr>
                            <th>Place</th>
                            <th>Name</th>
                            <th>Score</th>
                            <th>Elo Rating</th>
                        </tr>

                        {players.map((player, i) => {
                            const currId = player._id;
                            const playerScore = player.score;
                            const nextUser = users.filter(user => user._id === currId);
                            return (
                                <tr>
                                    <td>{i + 1}</td>
                                    <td>{nextUser[0].handle}</td>
                                    <td>{playerScore}</td>
                                    <td>{nextUser[0].eloRating.takingSix}</td>
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
            {displayPlayers(allPlayers, allUsers)}
        </div>
    )
}

export default GameEnd;
