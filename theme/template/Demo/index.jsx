/* eslint jsx-a11y/no-noninteractive-element-interactions: 0 */
import React from 'react';
import ReactDOM from 'react-dom';
import CopyToClipboard from 'react-copy-to-clipboard';
import CodePreview from './CodePreview';
import './index.css'

window.React = React
window.ReactDOM = ReactDOM

class Demo extends React.Component {
  iframeRef = React.createRef();

  codeSandboxIconRef = React.createRef();

  riddleIconRef = React.createRef();

  codepenIconRef = React.createRef();

  state = {
    codeExpand: false,
    copied: false,
    copyTooltipVisible: false,
  };

  componentDidMount() {
    const { meta, location } = this.props;
    if (meta.id === location.hash.slice(1)) {
      this.anchor.click();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { codeExpand, copied, copyTooltipVisible } = this.state;
    const { expand, theme } = this.props;
    return (
      (codeExpand || expand) !== (nextState.codeExpand || nextProps.expand) ||
      copied !== nextState.copied ||
      copyTooltipVisible !== nextState.copyTooltipVisible ||
      nextProps.theme !== theme
    );
  }

  getSourceCode() {
    const { highlightedCodes } = this.props;
    if (typeof document !== 'undefined') {
      const div = document.createElement('div');
      div.innerHTML = highlightedCodes.jsx;
      return div.textContent;
    }
    return '';
  }

  handleCodeExpand = demo => {
    const { codeExpand } = this.state;
    this.setState({ codeExpand: !codeExpand });
    this.track({
      type: 'expand',
      demo,
    });
  };

  handleCodeCopied = demo => {
    this.setState({ copied: true });
    this.track({
      type: 'copy',
      demo,
    });
  };

  onCopyTooltipVisibleChange = visible => {
    if (visible) {
      this.setState({
        copyTooltipVisible: visible,
        copied: false,
      });
      return;
    }
    this.setState({
      copyTooltipVisible: visible,
    });
  };

  // eslint-disable-next-line class-methods-use-this
  track({ type, demo }) {
    if (!window.gtag) {
      return;
    }
    window.gtag('event', 'demo', {
      event_category: type,
      event_label: demo,
    });
  }

  render() {
    const { state } = this;
    const { props } = this;
    const {
      meta,
      content,
      highlightedCodes,
      style,
      highlightedStyle,
      expand,
      utils,
      locale,
      theme,
      preview
    } = props;
    const { copied, copyTooltipVisible } = state;
    const codeExpand = this.state.codeExpand || expand;
    const localizeIntro = content[locale] || content;
    const introChildren = utils.toReactComponent(['div'].concat(localizeIntro));
    const example = preview(React, ReactDOM)
    const sourceCode = this.getSourceCode();

    return (
      <section id={meta.id}>
        <section className="code-box-demo">
          {example}
          {style ? <style dangerouslySetInnerHTML={{ __html: style }} /> : null}
        </section>
        <section className="code-box-meta markdown">
          <div className="code-box-description">{introChildren}</div>
          <div className="code-box-actions">
            <CopyToClipboard text={sourceCode} onCopy={() => this.handleCodeCopied(meta.id)}>
              <span
                visible={copyTooltipVisible}
                onVisibleChange={this.onCopyTooltipVisibleChange}
                title={copied ? 'copied' : 'copy'}
              >
                {copied ? 'copied' : 'copy'}
              </span>
            </CopyToClipboard>
            <span
              title={codeExpand ? 'hide' : 'show'}
            >
              <span className="code-expand-icon code-box-code-action">
                <img
                  alt="expand code"
                  src={
                    theme === 'dark'
                      ? 'https://gw.alipayobjects.com/zos/antfincdn/btT3qDZn1U/wSAkBuJFbdxsosKKpqyq.svg'
                      : 'https://gw.alipayobjects.com/zos/antfincdn/Z5c7kzvi30/expand.svg'
                  }
                  className={codeExpand ? 'code-expand-icon-hide' : 'code-expand-icon-show'}
                  onClick={() => this.handleCodeExpand(meta.id)}
                />
                <img
                  alt="expand code"
                  src={
                    theme === 'dark'
                      ? 'https://gw.alipayobjects.com/zos/antfincdn/CjZPwcKUG3/OpROPHYqWmrMDBFMZtKF.svg'
                      : 'https://gw.alipayobjects.com/zos/antfincdn/4zAaozCvUH/unexpand.svg'
                  }
                  className={codeExpand ? 'code-expand-icon-show' : 'code-expand-icon-hide'}
                  onClick={() => this.handleCodeExpand(meta.id)}
                />
              </span>
            </span>
          </div>
        </section>
        <section key="code">
          {codeExpand && <CodePreview toReactComponent={props.utils.toReactComponent} codes={highlightedCodes} />}
          {highlightedStyle ? (
            <div key="style" className="highlight">
              <pre>
                <code className="css" dangerouslySetInnerHTML={{ __html: highlightedStyle }} />
              </pre>
            </div>
          ) : null}
        </section>
      </section>
    );
  }
}

export default Demo;
