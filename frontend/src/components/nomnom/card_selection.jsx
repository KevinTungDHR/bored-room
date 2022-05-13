import React from 'react';
import { Card } from './card';

// assets.players.each.chosenCard = {value: , bulls: } (i.e. card)
// entities.users

const CardSelection = ({cards}) => {
    return (
        <div className='selected-cards-container'>
            {cards.map((card, i) => {
                if (i % 2 !== 0) {
                    return <Card card = {card[1]} key = { i } />
                } else {
                    
                }
            })}
        </div>
    )
}

export default CardSelection;