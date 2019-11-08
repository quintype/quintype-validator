import './app.scss';

import React from 'react';
import request from 'superagent-bluebird-promise';
import Dropzone from 'react-dropzone';
import _ from 'lodash';

import FileSaver from 'file-saver';

class GetUrlComponent extends React.Component {
  submit(e) {
    e.preventDefault();
    this.props.onSubmit(this.props.url);
  }

  importResult(accepted) {
    if(accepted.length !== 1)
      return;

    const reader = new FileReader();
    reader.onload = (x) => this.props.onImport(JSON.parse(x.target.result));
    reader.readAsText(accepted[0]);
  }

  render() {
    return <Dropzone accept="application/json"
                     onDrop={(accepted) => this.importResult(accepted)}
                     className="url-dropzone"
                     acceptClassName="url-dropzone-accept"
                     rejectClassName="url-dropzone-reject"
                     disableClick={true}>
      <form className="url-container" onSubmit={(e) => this.submit(e)} >
        <input className="url-input" value={this.props.url} placeholder="Enter Url" onChange={(e) => this.props.onChange(e.target.value)}/>
        <input type="submit" className="url-go" value="Go!" />
      </form>
    </Dropzone>;
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
    return <section className={`result ${this.state.active && 'active'}`}>
      <header className={`result-header expandable`} onClick={() => this.setState({active: !this.state.active})}>
        <div className="clearfix">
          <h2 className="result-title">Debugging</h2>
        </div>
      </header>
      <div className="result-body">
        <div>For a full list of rules, please see <a href="https://github.com/quintype/quintype-validator" target="_blank" rel="noopener noreferrer">Readme.md</a></div>
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
        {this.props.links.length > 0 && <div>
          <h4>Links:</h4>
          <ul>{this.props.links.map((link, index) => <li key={index}><button onClick={() => this.props.onValidate(link)}>validate</button> - {link}</li>)}</ul>
        </div>}
      </div>
    </section>
  }
}

class Results extends React.Component {
  render() {
    const showResult = (category, title) => this.props.results[category] ? <ResultSection title={title} result={this.props.results[category]} /> : undefined;

    return <div>
      {showResult("amp", "AMP")}
      {showResult("headers", "Caching Headers")}
      {this.props.results.structured
        ? <ResultSection title="Structured Data" result={this.props.results.structured}>
            <div>Number of Objects: {this.props.results.structured.numObjects}</div>
            <div>Content Id: {this.props.results.structured.contentId}</div>
          </ResultSection>
        : undefined}
      {showResult('og', "Facebook OG Tags")}
      {showResult('seo', "SEO Rules")}
      {showResult('robots', "Robots")}
      {showResult('pagespeed', "PageSpeed")}
      {showResult('lighthouseSeo', "LH SEO")}
      {showResult('lighthousePwa', "PWA")}

      <DebugSection results={this.props.results} links={this.props.links} onValidate={this.props.onValidate}/>

      <button className="results-download" onClick={() => this.props.onDownload()}>Download As JSON</button>
    </div>;
  }
}

export class HomeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "",
      response: null,
      loading: false,
      error: null
    };
  }

  loadRules(url) {
    request.post(`${process.env.REACT_APP_API_HOST || ""}/api/validate.json`, {url: url})
           .then(response => this.setState({response: response.body, loading: false, url: response.body.url}))
           .catch(e => this.setState({loading: false, error: e.message}));
  }

  processUrl(url) {
    if(this.state.loading)
      return;

    this.setState({
      url: url,
      loading: true,
      error: null
    }, () => this.loadRules(url));
  }

  downloadResponse() {
    const blob = new Blob([JSON.stringify(this.state.response)], {type: "application/json;charset=utf-8"});
    FileSaver.saveAs(blob, "validator.json");
  }

  import(response) {
    this.setState({
      response: response,
      error: null,
      loading: false,
      url: response.url
    })
  }

  render() {
    return <div>
      <GetUrlComponent onSubmit={(url) => this.processUrl(url)} url={this.state.url} onChange={(url) => this.setState({url: url})} onImport={(result) => this.import(result)}/>
      {this.state.error && <div className="error-message">{this.state.error}</div>}
      {this.state.loading && <div className="loading">Crunching Numbers</div>}
      {!this.state.loading && this.state.response && <Results results={this.state.response.results}
                                                              links={this.state.response.links}
                                                              onValidate={(url) => this.processUrl(url)}
                                                              url={this.state.response.url}
                                                              onDownload={() => this.downloadResponse()} />}
    </div>;
  }
}
