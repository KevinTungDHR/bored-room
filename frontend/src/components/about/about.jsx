import React from 'react';
import peter from '../../assets/images/peter.png';
import kevin from '../../assets/images/Kevin.png';
import sean from '../../assets/images/sean.png';
import github from '../../assets/images/github.png';
import linkedin from '../../assets/images/linkedin.png';
import angellist from '../../assets/images/angellist.png';

const AboutDevelopers = () => {
    return (
        <div className='about-outer-div'>
            <div className='about-header'>
                <h1>About the Developers</h1>
            </div>

            <div className='bios-container'>
                <div className='bio'>
                    <img className='headshot' src={peter} />
                    <span className='name'>Peter Kim</span>
                    <span className='role'>Backend Lead</span>
                    <p className='bio-description'>Peter is a problem-solver at heart who loves to dive into complex logic, learn new frameworks, and fix challenging bugs. He has a passion for backend development and understands its role and influence in the context of the whole stack.</p>
                    <div className='connect-links'>
                        <span>Connect: </span>
                        <a href='https://github.com/Peterkim88'><img src={github} /></a>
                        <a href='https://www.linkedin.com/in/peter-kim-898aa223a/'><img className='linkedin' src={linkedin} /></a>
                        <a href=''><img className='angellist' src={angellist} /></a>
                    </div>
                </div>
                <div className='bio'>
                    <img className='headshot' src={kevin} />
                    <span className='name'>Kevin Tung</span>
                    <span className='role'>Project Manager/Team Lead</span>
                    <p className='bio-description'>Jack-of-all-trades...master of many. Kevin is a go-getter who loves to work across the entire codebase, combining his knack for strategic-thinking, deep technical prowess, and natural leadership ability to achieve success.</p>
                    <div className='connect-links'>
                        <span>Connect: </span>
                        <a href='https://github.com/KevinTungDHR'><img src={github} /></a>
                        <a href='https://www.linkedin.com/in/kevintungdev/'><img className='linkedin' src={linkedin} /></a>
                        <a href=''><img className='angellist' src={angellist} /></a>
                    </div>
                </div>
                <div className='bio'>
                    <img className='headshot' src={sean} />
                    <span className='name'>Sean O'Dea</span>
                    <span className='role'>Frontend Lead</span>
                    <p className='bio-description'>An inquisitive learner, critical thinker, and creativer doer. Sean loves to learn new technologies, apply his skills judiciously, and exercise his creative mind to build excellent products.</p>
                    <br />
                    <div className='connect-links'>
                        <span>Connect: </span>
                        <a href='https://github.com/sodea1'><img src={github} /></a>
                        <a href='https://www.linkedin.com/in/seanodea1/'><img className='linkedin' src={linkedin} /></a>
                        <a href='https://angel.co/u/sean-o-dea-4'><img className='angellist' src={angellist} /></a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutDevelopers;