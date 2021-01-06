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
    requestAnimationFrame(this.frame);

    let changedLines = this.core.getChangedLines();
    let lines = this.state.lines;

    if (changedLines.size > 0) {
      changedLines.forEach((line, i) => {
        lines[i] = line;
      })

      this.setState({lines: lines});
    }
  }

  componentWillUnmount() {
    this.core.stop()
  }

  render() {
    return (
      <div className="asciinema-player-wrapper" tabIndex="-1">
        <div className="asciinema-player asciinema-theme-asciinema">
          <pre className="asciinema-terminal font-small" style={{width: this.terminalWidth(), height: this.terminalHeight()}}>
            {this.state.lines.map(line =>
              <Line key={line.id} segments={line.segments} />
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
}

class Line extends React.Component {
  render() {
    return <span className="line">
      {this.props.segments.map(segment =>
        <span className={this.segmentClass(segment[1])} style={this.segmentStyle(segment[1])}>{segment[0]}</span>
      )}
    </span>
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.segments !== nextProps.segments;
  }

  segmentClass(attrs) {
    let cls = '';

    let fg = attrs.get('fg');

    if (typeof fg == 'number') {
      cls = `fg-${fg}`;
    }

    let bg = attrs.get('bg');

    if (typeof bg == 'number') {
      cls = `${cls} bg-${bg} `;
    }

    if (attrs.has('bold')) {
      cls = `${cls} bright`;
    }

    if (attrs.has('italic')) {
      cls = `${cls} italic`;
    }

    if (attrs.has('underline')) {
      cls = `${cls} underline`;
    }

    return cls === '' ? null : cls;
  }

  segmentStyle(attrs) {
    let style = null;

    let fg = attrs.get('fg');

    if (typeof fg == 'string') {
      style = {color: fg};
    }

    let bg = attrs.get('bg');

    if (typeof bg == 'string') {
      style = style || {};
      style['background-color'] = bg;
    }

    return style;
  }
}

export default AsciinemaPlayer;