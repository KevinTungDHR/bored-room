import React from "react";
import { motion } from "framer-motion";
import bull_light from '../../assets/images/bull_light_purp.png';
import bull_purp from '../../assets/images/bull_purp.png';
import bull_logo from '../../assets/images/bull_logo.png';
import { GiBull } from 'react-icons/gi';

export const Card = ({card, setChosenCard, index, type}) => {
  if (!card && index === 5) return <div className='blank-square'><GiBull className="gi-bull-icon" /></div>
  if (!card && type.value === 'selected') return <div></div>
  if (!card) return <div className='blank-square'></div>
  const bullLight = <img src={bull_light} height="70px" width="70px" />
  
  return ( 
    <motion.div
      animate={{ x: [-1240, 0] }}
      transition={{ duration: 1 }}
      className="card"> 
          <div className="card-number">{card.value}</div>
          <div className="top-card">
            <p>{card.value}</p>
            <div className="small-bulls-container">
              {[...Array(card.bulls)].map((i, idx) => {
                return <img key={idx} className="small-bull" src={bull_purp} height="10px" width="10px" />
              })}
            </div>
            <p>{card.value}</p>
          </div>

          {bullLight}
          <div className="card-bottom">
              <p>{card.value}</p>
              <div className="small-bulls-container">
                {[...Array(card.bulls)].map((i, idx) => {
                  return <img key={idx} className="small-bull" src={bull_purp} height="10px" width="10px" />
                })}
              </div>
              <p>{card.value}</p>
          </div>
      </motion.div>
  )
}
