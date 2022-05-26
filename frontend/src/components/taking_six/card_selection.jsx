import React from 'react';
import { Card } from './card';

const CardSelection = ({cards, setIsAnimating}) => {

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
                return <Card card={card[1]} key={ i } />
            })}
        </div>
    )
}

export default CardSelection;