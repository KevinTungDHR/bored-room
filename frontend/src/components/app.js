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
import '../stylesheets/app.scss';

const App = () => (
    <div>
        <NavBarContainer />
        <Switch>
            <Route exact path="/" component={MainPage} />
            <AuthRoute exact path="/login" component={LoginFormContainer} />
            <AuthRoute exact path="/register" component={SignupFormContainer} />
            <Route path="/user" component={ProfileContainer} />
            <Route path="/lobby" component={LobbyContainer} />
        </Switch>
        <Footer />
    </div>

);

export default App;