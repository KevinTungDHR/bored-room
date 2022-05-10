import { connect } from "react-redux";
import Room from "./room";

const mapState = (state, ownProps) => {
  return {
    roomCode: ownProps.match.params.code
  }
}

export default connect(mapState, null)(Room);