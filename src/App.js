import React, { Fragment, Component } from "react";
import { Route } from "react-router-dom";
import Rooms from "./Rooms";
import Room from "./Room";

export default class App extends Component {
  render() {
    return (
      <Fragment>
        <Route path="/" component={Rooms} exact />
        <Route path="/room/:name" component={Room} />
      </Fragment>
    );
  }
}
