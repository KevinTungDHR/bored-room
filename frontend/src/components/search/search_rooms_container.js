import { connect } from "react-redux"
import SearchRooms from "./search_rooms";

const mapStateToProps = state => ({
  rooms: Object.values(state.entities.rooms)
})

const mapDispatchToProps = dispatch => ({
  fetchAllRooms: this.props.fetchAllRooms()
})

export default connect(mapStateToProps, mapDispatchToProps)(SearchRooms);