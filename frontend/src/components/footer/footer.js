import React from 'react';
import styles from '../../stylesheets/footer/footer.module.scss';

class Footer extends React.Component {

    render() {
        return (
            <div className={styles.container}>
                <div className='footer-title'>
                   
                </div>

                <div className='footer-sections'>
                    <div className='footer-explore'>
                        <ul>
                        </ul>
                    </div>
                    <div className='footer-maps'>
                        <ul>
                        </ul>
                    </div>
                    <div className='footer-company'>
                        <ul>
                        </ul>
                    </div>
                    <div className='footer-community'>
                        <ul className='flex-center'>
                            
                        </ul>
                    </div>
                </div>

                <div className='footer-icons'>
                    <div>
                        <div className='foot-left'>
                            
                        </div>
                    </div>

                    <div>
                        <div className='foot-mid'>

                        </div>
                    </div>
                    <div>
                        
                    </div>
                </div>

            </div>
        )
    }
}

export default Footer;