import React from "react";
import { motion, useAnimation } from "framer-motion";
import bull_brown from '../assets/images/bull_brown.png';
import bull_purp from '../assets/images/bull_purp.png';
// import bull_brown from '../assets/images/bull_brown.png';

export const Test = () => {
  const bullBrown = <img src={bull_brown} height="70px" width="70px" />
  const bullPurp = <img className="small-bull" src={bull_purp} height="16px" width="16px" />
  // const bullLightPurp
  return (
    <div className="board-background">
      <div className="hand-container">
        <div>Your hand</div>
        <div className="card-container">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(n => {
            return <div className="card">
              <div className="card-number">99</div>
              <div className="top-card">
                <p>99</p>
                <div className="small-bulls-container">
                  {bullPurp}
                  {bullPurp}
                  {bullPurp}
                  {bullPurp}
                  {bullPurp}
                </div>
                <p>99</p>
              </div>

              {bullBrown}
              <div className="card-bottom">
                <p>99</p>
                <div className="small-bulls-container">
                  {bullPurp}
                  {bullPurp}
                  {bullPurp}
                  {bullPurp}
                  {bullPurp}
                </div>
                <p>99</p>
              </div>
            </div>
          })}
        </div>

      </div>
      
    </div>
  )
}
