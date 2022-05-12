import React from "react";

class SearchRooms extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      search: ''
    }
  }

  componentDidMount() {
    this.props.fetchAllRooms()
  }
  
  render() {
    return (
      <div className='flex'>
        <div>Search for a Room</div>
        <div>
          <input className='create-room-input' value={this.state.roomName} onChange={this.handleChange} />
          <input className='create-btn' type="submit" value="Search" />
        </div>
      </div>
    )
  }
}

export default SearchRooms;