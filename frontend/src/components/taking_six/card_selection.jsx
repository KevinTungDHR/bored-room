import React from 'react';
import { Card } from './card';

const CardSelection = ({cards, setIsAnimating, allUsers}) => {

    function onStart() {
        setIsAnimating(true)
    }

    function onEnd() {
        setIsAnimating(false)
    }

    if (!cards[0]) return null;
    return (
        <div 
            animate={{ x: 200, y: 200 }}
            onAnimationStart={onStart}
            onAnimationEnd={onEnd}
            className='selected-cards-container'>
            {cards.map((card, i) => {
                return (
                    <div key={i}>
                        <Card card={card[1]} />
                        <div>{allUsers.find(player => player._id === card[0]).handle}</div>
                    </div>
                )
            })}
        </div>
    )
}

export default CardSelection;