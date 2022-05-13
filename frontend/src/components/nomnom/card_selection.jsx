import React from 'react';
import { Card } from './card';

// assets.players.each.chosenCard = {value: , bulls: } (i.e. card)
// entities.users

const CardSelection = ({cards}) => {
    if (!cards[0]) return null;
    return (
        <div className='selected-cards-container'>
            {cards[0].map((card, i) => {
                if (i % 2 !== 0) {
                    return <Card card={card} key = { i } />
                }
            })}
        </div>
    )
}

export default CardSelection;