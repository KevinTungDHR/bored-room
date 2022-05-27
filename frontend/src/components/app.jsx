import React from 'react';
import { AuthRoute, ProtectedRoute } from '../util/route_util';
import { Switch, Route } from 'react-router-dom';
import NavBarContainer from './nav/navbar_container';
import LoginFormContainer from './session/login_form_container';
import SignupFormContainer from './session/signup_form_container';
import LobbyContainer from './lobby/lobby_container';
import ProfileContainer from './profile/profile_container';
import MainPage from './main/main_page';
import Footer from './footer/footer';
import Modal from './modal/modal';
import '../stylesheets/app.scss';
import Room from './rooms/room';
import { ProfileMotion } from './profile/profile_motion';
import AboutDevelopers from './about/about';

const App = () => (
    <div>
        <Modal />
        <NavBarContainer />
        <Switch>
            <AuthRoute exact path="/login" component={LoginFormContainer} />
            <AuthRoute exact path="/register" component={SignupFormContainer} />
            <ProtectedRoute path="/rooms/:code" component={Room} />
            <ProtectedRoute path="/profile" component={ProfileContainer} />
            <ProtectedRoute path="/lobby" component={LobbyContainer} />
            <Route exact path="/about" component={AboutDevelopers} />
            <AuthRoute path="/" component={MainPage} />
        </Switch>
        <Footer />
    </div>

);

export default App;