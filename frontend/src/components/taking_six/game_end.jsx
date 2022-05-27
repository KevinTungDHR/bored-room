import React from 'react';
import { AiFillTrophy } from 'react-icons/ai';

const GameEnd = ({ allPlayers, allUsers }) => {

    const displayPlayers = (players, users) => {
        console.log(users)
        const allPlayers = {};
        players.forEach((player) => allPlayers[player._id] = player.score)
        const winnerId = Object.keys(allPlayers).reduce(function(a, b) { return allPlayers[a] > allPlayers[b] ? a : b })
        const loserIds = Object.keys(allPlayers).filter((key) => key !== winnerId );
        const winnerScore = allPlayers[winnerId];
        const winner = users.filter(user => user._id === winnerId);
        const winnerElo = winner[0].eloRating.takingSix;

        const loserIdScores = {}; // 

        if (loserIds.length > 0) {
            loserIds.forEach((loserId) => loserIdScores[loserId] = allPlayers[loserId]);
        }

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

                <div className='losers-body'>
                    <div>
                        
                    </div>
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
