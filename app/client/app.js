import css from './app.scss';

import React from 'react';
import ReactDom from 'react-dom';
import request from 'superagent-bluebird-promise';

class GetUrlComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: ""
    }
  }

  render() {
    return <div>
      <input value={this.state.value} placeholder="Enter Url" onChange={(e) => this.setState({url: e.target.value})} />
      <button onClick={() => this.props.onSubmit(this.state.url)}>Go!</button>
      {this.props.loading && <span className="loading">Loading....</span>}
    </div>;
  }
}

class ResultSection extends React.Component {
  render() {
    const errors = this.props.result.errors || [];
    const warnings = this.props.result.warnings || [];
    return <section className={`result result-${this.props.result.status}`}>
      <h2>{this.props.title}</h2> - <h3>{this.props.result.status}</h3>
      {this.props.children}
      {errors.length > 0 && <div>
        <h4>Errors:</h4>
        <ul className="result-errors">{errors.map((error, index) => <li key={index}>{error}</li>)}</ul>
      </div>}

      {warnings.length > 0 && <div>
        <h4>Warnings:</h4>
        <ul className="result-warnings">{warnings.map((error, index) => <li key={index}>{error}</li>)}</ul>
      </div>}
    </section>
  }
}

class Results extends React.Component {
  render() {
    return <div>
      <ResultSection title="AMP" result={this.props.results.amp} />
      <ResultSection title="Headers" result={this.props.results.headers} />
      <ResultSection title="Structured Data" result={this.props.results.structured} />
      <ResultSection title="Facebook OG Tags" result={this.props.results.og} />
      <ResultSection title="SEO Rules" result={this.props.results.seo} />
    </div>;
  }
}

class HomeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      loading: false
    };
  }

  loadRules(url) {
     request.post("/api/validate.json", {url: url})
            .then(results => this.setState({results: results}));
  }

  processUrl(url) {
    if(this.state.loading)
      return;

    this.setState({
      loading: true
    }, () => this.loadRules(url));
  }

  render() {
    return this.state.results ? <Results results={this.state.results} /> : <GetUrlComponent onSubmit={(url) => this.processUrl(url)} loading={this.state.loading}/> ;
  }
}

ReactDom.render(<HomeComponent/>, global.document.getElementById('container'));
