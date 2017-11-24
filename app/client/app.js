import css from './app.scss';

import React from 'react';
import ReactDom from 'react-dom';
import request from 'superagent-bluebird-promise';

import FileSaver from 'file-saver';
import _ from 'lodash';

class GetUrlComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: ""
    }
  }

  submit(e) {
    e.preventDefault();
    this.props.onSubmit(this.state.url);
  }

  render() {
    return <form className="url-container" onSubmit={(e) => this.submit(e)}>
      <input className="url-input" value={this.state.value} placeholder="Enter Url" onChange={(e) => this.setState({url: e.target.value})} />
      <input type="submit" className="url-go" value="Go!"/>
    </form>;
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
          <ul>{errors.map((error, index) => <li key={index}>{error}</li>)}</ul>
        </div>}

        {warnings.length > 0 && <div>
          <h4>Warnings:</h4>
          <ul>{warnings.map((error, index) => <li key={index}>{error}</li>)}</ul>
        </div>}
      </div>
    </section>
  }
}

function toRow(category, key, value) {
  return <tr key={`${category}/${key}`}>
    <td>{category}</td>
    <td className="debug-key">{key}</td>
    <td>{value}</td>
  </tr>;
}

class DebugSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false
    }
  }

  render() {
    global.results = this.props.results;
    global._ = _;
    return <section className={`result ${this.state.active && 'active'}`}>
      <header className={`result-header expandable`} onClick={() => this.setState({active: !this.state.active})}>
        <div className="clearfix">
          <h2 className="result-title">Debug Information</h2>
        </div>
      </header>
      <div className="result-body">
        <div>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Key</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {_(this.props.results).entries().flatMap(([category, result]) => _(result.debug).entries().map(([key, value]) => toRow(category, key, value)).value()).value()}
            </tbody>
          </table>
        </div>
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

      <DebugSection results={this.props.results}/>

      <button className="results-download" onClick={() => this.props.onDownload()}>Download As JSON</button>
    </div>;
  }
}

class HomeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      response: null,
      loading: false,
      error: null
    };
  }

  loadRules(url) {
    request.post("/api/validate.json", {url: url})
           .then(response => this.setState({response: response.body, loading: false}))
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

  downloadResponse() {
    const blob = new Blob([JSON.stringify(this.state.response)], {type: "application/json;charset=utf-8"});
    FileSaver.saveAs(blob, "validator.json");
  }

  render() {
    return <div>
      <GetUrlComponent onSubmit={(url) => this.processUrl(url)}/>
      {this.state.error && <div className="error-message">{this.state.error}</div>}
      {this.state.loading && <div className="loading">Crunching Numbers</div>}
      {!this.state.loading && this.state.response && <Results results={this.state.response.results}
                                                              url={this.state.response.url}
                                                              onDownload={() => this.downloadResponse()} />}
    </div>;
  }
}

ReactDom.render(<HomeComponent/>, global.document.getElementById('container'));
