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
    return <div className="url-container">
      <input className="url-input" value={this.state.value} placeholder="Enter Url" onChange={(e) => this.setState({url: e.target.value})} />
      <button className="url-go" onClick={() => this.props.onSubmit(this.state.url)}>Go!</button>
    </div>;
  }
}

class ResultSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false
    }
  }

  render() {
    const errors = this.props.result.errors || [];
    const warnings = this.props.result.warnings || [];
    const expandable = this.props.children || errors.length > 0 || warnings.length > 0;
    return <section className={`result ${this.state.active && 'active'}`}>
      <header className={`result-header ${expandable && "expandable"}`} onClick={() => expandable && this.setState({active: !this.state.active})}>
        <div className="clearfix">
          <h2 className="result-title">{this.props.title}</h2>
          <h3 className={`result-status result-status-${this.props.result.status} ${warnings.length > 0 ? "result-status-WARN" : ""}`}>
            {this.props.result.status}
          </h3>
        </div>
      </header>
      <div className="result-body">
        {this.props.children && <div>{this.props.children}</div>}

        {errors.length > 0 && <div>
          <h4>Errors:</h4>
          <ul className="result-errors">{errors.map((error, index) => <li key={index}>{error}</li>)}</ul>
        </div>}

        {warnings.length > 0 && <div>
          <h4>Warnings:</h4>
          <ul className="result-warnings">{warnings.map((error, index) => <li key={index}>{error}</li>)}</ul>
        </div>}
      </div>
    </section>
  }
}

class Results extends React.Component {
  render() {
    return <div>
      <ResultSection title="AMP" result={this.props.results.amp} />
      <ResultSection title="Headers" result={this.props.results.headers} />
      <ResultSection title="Structured Data" result={this.props.results.structured}>
        <div>Number of Objects: {this.props.results.structured.numObjects}</div>
        <div>Content Id: {this.props.results.structured.contentId}</div>
      </ResultSection>
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
      loading: false,
      error: null
    };
  }

  loadRules(url) {
    request.post("/api/validate.json", {url: url})
           .then(response => this.setState({results: response.body, loading: false}))
           .catch(e => this.setState({loading: false, error: e.message}));
  }

  processUrl(url) {
    if(this.state.loading)
      return;

    this.setState({
      loading: true,
      error: null
    }, () => this.loadRules(url));
  }

  render() {
    return <div>
      <GetUrlComponent onSubmit={(url) => this.processUrl(url)}/>
      {this.state.error && <div className="error-message">{this.state.error}</div>}
      {this.state.loading && <div className="loading">Crunching Numbers</div>}
      {!this.state.loading && this.state.results && <Results results={this.state.results} />}
    </div>;
  }
}

ReactDom.render(<HomeComponent/>, global.document.getElementById('container'));
