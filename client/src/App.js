import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    seenValues: [],
    values: [],
    value: ''
  };

  componentDidMount() {
    this.fetchValues();
    this.fetchSeenValues();
  }

  async fetchValues() {
    const values = await axios.get('/api/values/current');
    this.setState({
      values: values.data
    });
  }

  async fetchSeenValues() {
    const seenValues = await axios.get('api/values/all');
    this.setState({
      seenValues: seenValues.data
    });
  }

  handleSubmit = async e => {
    e.preventDefault();
    await axios.post('/api/values', {
      value: this.state.value
    });
    this.setState({ value: '' });
  };

  renderValues() {
    if (!Object.keys(this.state.values).length) {
      return <div>No values yet!</div>;
    }

    const entries = [];
    for (let key in this.state.values) {
      entries.push(
        <li key={key}>
          For index {key} I calculated {this.state.values[key]}
        </li>
      );
    }

    return <ul>{entries}</ul>;
  }

  renderSeenValues() {
    return this.state.seenValues
      .map(({ number }) => {
        return number;
      })
      .join(', ');
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Fib Calculator</h1>
        </header>>
        <div>
          <form onSubmit={this.handleSubmit}>
            <label>Enter your value:</label>
            <input
              value={this.state.value}
              onChange={ev => this.setState({ value: ev.target.value })}
            />
            <button>Submit</button>
          </form>

          <h3>Values I have seen:</h3>
          {this.renderSeenValues()}

          <h3>Calculated Values:</h3>
          {this.renderValues()}
        </div>
      </div>
    );
  }
}

export default App;
