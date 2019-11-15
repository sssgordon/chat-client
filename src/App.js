import React, { Component } from "react";
import superagent from "superagent";

export default class App extends Component {
  state = {
    messages: [],
    value: ""
  };
  // where do we connect to the stream?
  // if it's in the render method -> then it's gonna connect many times
  // we want it to connect 1 time -> componentDidMount
  //BUT we want the stream to be accessible in the full app, not just in the componentDidMount function; so we write it separately as the class' own property
  stream = new EventSource("http://localhost:4000/stream"); // EventSource is built in in JS; argument is where we connect to the stream

  componentDidMount = () => {
    this.stream.onmessage = event => {
      // catch the stream messages that is sent to the client
      const { data } = event; // each event has an ID and data

      const parsed = JSON.parse(data); // this turns JS string (it was '['','']') to JSON data (['',''] to be mapped)

      if (Array.isArray(parsed)) {
        // Array.isArray(arg) checks if the arg is an array
        // we do this because the data can be an array (old msgs) or a string (new msgs)
        this.setState({ messages: parsed });
      } else {
        const messages = [...this.state.messages, parsed];
        this.setState({ messages }); // remember? setState has to take an argument of the state OBJECT, and it sets the property whichever you puts into the state object as argument
      }

      console.log("data test: ", data);
    };
  };

  onChange = event => {
    const { value } = event.target;
    this.setState({ value }); // changes the value in the state
  };

  onSubmit = event => {
    event.preventDefault(); // page won't reload after submitting form

    const { value } = this.state;

    const url = "http://localhost:4000/message";

    superagent
      .post(url)
      .send({ message: value }) // the send ALWAYS takes an object, which will be the body of the request -> message="value"
      .then(res => console.log("response test", res));

    this.setState({ value: "" }); //NOT WORKING!
  };

  reset = () => {
    this.setState({ value: "" });
  };

  render() {
    const list = this.state.messages.map((message, index) => (
      <p key={index}>{message}</p>
    )); // get the list of messages from the state
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
