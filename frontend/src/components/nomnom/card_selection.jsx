import React from 'react';
import { Card } from './card';

// assets.players.each.chosenCard = {value: , bulls: } (i.e. card)
// entities.users

const CardSelection = ({players}) => {
    return (
        <div className='selected-cards-container'>
            {players.map((player, i) => <Card card={player.chosenCard} type={{value: 'selected'}} key={i} />)}
        </div>
    )
}

export default CardSelection;