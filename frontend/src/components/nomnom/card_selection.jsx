import React from 'react';
import { Card } from './card';
import { motion } from 'framer-motion';

// assets.players.each.chosenCard = {value: , bulls: } (i.e. card)
// entities.users

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
            {cards[0].map((card, i) => {
                if (i % 2 !== 0) {
                    return <Card card={card} key={ i } />
                }
            })}
        </div>
    )
}

export default CardSelection;