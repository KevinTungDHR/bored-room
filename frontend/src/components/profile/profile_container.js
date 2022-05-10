import { connect } from 'react-redux';

import Profile from './profile';

const mapStateToProps = state => ({
    // handle: state.user
});

export default connect(
    mapStateToProps,
)(Profile);