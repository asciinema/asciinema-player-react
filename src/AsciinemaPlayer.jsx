import React from 'react';
import AsciinemaPlayerCore from 'asciinema-player-core';

class AsciinemaPlayer extends React.Component {
  constructor(props) {
    super(props);

    this.core = new AsciinemaPlayerCore(props.src, {
      loop: props.loop || false
    });

    this.frame = this.frame.bind(this);

    this.autostart = props.autostart || false;

    this.state = {
      width: this.props.cols,
      height: this.props.rows,
      lines: []
    };
  }

  componentDidMount() {
    this.core.load().then(size => {
      if (!this.state.width) {
        this.setState({width: size.width, height: size.height});
      }

      requestAnimationFrame(this.frame);

      if (this.autostart) {
        this.core.start();
      }
    });
  }

  frame() {
    // console.log('frame!');
    requestAnimationFrame(this.frame);
    this.setState({lines: this.core.getLines()});
    // this.refreshTerminal();
  }

  // refreshTerminal() {
  //   this.setState({lines: this.core.getLines()});
  // }

  componentWillUnmount() {
    this.core.stop()
  }

  render() {
    return (
      <div className="asciinema-player-wrapper" tabIndex="-1">
        <div className="asciinema-player asciinema-theme-asciinema">
          <pre className="asciinema-terminal font-small" style={{width: this.terminalWidth(), height: this.terminalHeight()}}>
            {this.state.lines.map(line =>
              <span key={line.id} className="line">
                {line.segments.map(segment =>
                  <span className={this.segmentClass(segment[1])} style={this.segmentStyle(segment[1])}>{segment[0]}</span>
                )}
              </span>
            )}
          </pre>
        </div>
      </div>
    );
  }

  terminalWidth() {
    return (this.state.width || 80) + 'ch';
  }

  terminalHeight() {
    return (1.3333333333 * (this.state.height || 24)) + 'em';
  }

  segmentClass(attrs) {
    let cls = '';

    let fg = attrs.get('fg');

    if (fg !== undefined) {
      cls = `fg-${fg}`;
    }

    let bg = attrs.get('bg');

    if (bg !== undefined) {
      cls = `${cls} bg-${bg} `;
    }

    if (attrs.get('bold')) {
      cls = `${cls} bright`;
    }

    if (attrs.get('italic')) {
      cls = `${cls} italic`;
    }

    if (attrs.get('underline')) {
      cls = `${cls} underline`;
    }

    return cls;
  }

  segmentStyle(attrs) {
    return {};
  }
}

export default AsciinemaPlayer;