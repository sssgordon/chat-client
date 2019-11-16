import React, { Component } from "react";
import superagent from "superagent";
import { Link } from "react-router-dom";
import { url } from "./constants";

//gotta change url to
export default class Rooms extends Component {
  state = {
    rooms: [], // what message has arrived
    value: "" // what message is someone writing right now
  };
  // where do we connect to the stream?
  // if it's in the render method -> then it's gonna connect many times
  // we want it to connect 1 time -> componentDidMount
  //BUT we want the stream to be accessible in the full app, not just in the componentDidMount function; so we write it separately as the class' own property (doesn't need const)
  stream = new EventSource(`${url}/stream`); // EventSource is built in in JS; argument is where we connect to the stream

  componentDidMount = () => {
    // something that happens one time should be put here: showing messages
    this.stream.onmessage = event => {
      // the onmessage property catches the stream data that is sent to the client (what was passed to stream.send in the backend)
      const { data } = event; // each event has an ID and data

      const parsed = JSON.parse(data); // this turns serialized JS string (it was '['','']') back to JSON data (['',''] to be mapped)

      if (Array.isArray(parsed)) {
        // Array.isArray(arg) checks if the arg is an array
        // we do this because the data can be an array (all old msgs) or a string (a single msg)
        this.setState({ rooms: parsed }); // if it is an array we assume it contains all the messages
      } else {
        const rooms = [...this.state.rooms, parsed]; // if it is a string, we add it to the old msgs
        this.setState({ rooms }); // remember? setState has to take an argument of the state OBJECT, and it sets the property whichever you puts into the state object as argument
      }

      console.log("data test: ", data);
    };
  };

  onChange = event => {
    const { value } = event.target;
    this.setState({ value }); // changes the value in the state
  };

  onSubmit = event => {
    event.preventDefault(); // so the page won't reload after submitting form

    const { value } = this.state;

    const postUrl = `${url}/room`;

    superagent
      .post(postUrl)
      .send({ name: value }) // the send ALWAYS takes an object, which will be the body of the request -> message="value"
      .then(res => console.log("response test", res));

    this.setState({ value: "" }); //NOT WORKING! solved -> must include value attribute in input JSX element; see below
  };

  reset = () => {
    this.setState({ value: "" });
  };

  render() {
    const list = this.state.rooms.map((name, index) => (
      <p key={index}>
        <Link to={`/room/${name}`}>{name}</Link>
      </p>
    )); // get the list of rooms from the state
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <input
            type="text"
            onChange={this.onChange}
            value={this.state.value} // !!! This sets the input display to be like the state; this makes it a fully controlled form
          />
          <button type="button" onClick={this.reset}>
            Reset
          </button>
          <button>Submit</button>
        </form>
        {list}
      </div>
    );
  }
}
