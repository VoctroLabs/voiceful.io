@autobind
@observer
class ListenStep extends React.Component {
  @observable audioUrl;
  @observable playerLoaded = false;

  componentDidMount() {
    this.processAudio();
  }

  @action
  onPlayerLoaded() {
    this.playerLoaded = true;
  }

  async processAudio() {
    const vosynParams = {
      preset_name: 'demo_glum',
      voice: state.voice,
      input_text_upload_parts: 1
    };
    const vosynUploads = {
      input_text: {
        data: JSON.stringify({
          phrases: state.textInputs.map((_, index) => index + 1),
          lyrics: state.textInputs.map(input => input.text)
        })
      }
    };
    const vosynTask = new VocloudTask('vosyn');
    await vosynTask.process(vosynParams, vosynUploads);

    const vomixTask = new VocloudTask('vomix');
    await vomixTask.process({
      preset_name: 'demo_glum',
      audio2_upload_with_url: vosynTask.output_url
    });
    runInAction(() => this.audioUrl = vomixTask.audio_url);
  }

  render () {
    const title = this.playerLoaded? 'Listen to it!' : 'Processing...';
    return (
      <div id="listen-step">
        <StepHeader number={3} text="STEP THREE" title={title}/>
        <Player audioUrl={this.audioUrl} onLoaded={this.onPlayerLoaded} />
        <div id="lyrics">"{state.text}"</div>
        <Buttons enabled={this.playerLoaded} shareAudioUrl={this.audioUrl}/>
      </div>
    );
  }

}

@autobind
@observer
class Player extends React.Component {
  @observable status = 'loading';
  audio;

  static propTypes = {
    audioUrl: PropTypes.string,
    onLoaded: PropTypes.func,
  };

  componentDidMount() {
    autorun(() => {
      const audioUrl = this.props.audioUrl;
      if (audioUrl) this.createAudio();
    });
  }

  createAudio() {
    if (this.audio) this.audio.unload();
    this.audio = new Howl({src: this.props.audioUrl});
    // Show play button once audio is loaded
    this.audio.once('load', () => {
      this.setStatus('stopped');
      this.props.onLoaded && this.props.onLoaded();
    });
    this.audio.on('play', () => this.setStatus('playing'));
    this.audio.on('stop', () => this.setStatus('stopped'));
    this.audio.on('end', () => this.setStatus('stopped'));
  }

  onPlayBtn() {
    if (this.audio.playing()) this.audio.stop();
    else this.audio.play();
  }

  @action
  setStatus(value) {
    this.status = value;
  }

  render() {
    return (
      <div className="row">
        {this.status === 'loading'?
          <span id="spinner" className="glyphicon glyphicon-refresh spinning" aria-hidden="true"/> :
          <a id="play-btn" style={{display: 'inline'}} onClick={this.onPlayBtn}>
            <img id="play-btn-bg" src="img/player-bg.png" alt="player"
                 className={classNames({'spinning': this.status === 'playing'})}/>
            <span id="play-btn-fg" aria-hidden="true"
                  className={classNames('glyphicon', {
                    'glyphicon-play': this.status === 'stopped',
                    'glyphicon-stop': this.status === 'playing',
                  })}
            />
          </a>
        }
      </div>
    );
  }

}

@autobind
@observer
class Buttons extends React.Component {

  static propTypes = {
    enabled: PropTypes.bool,
    shareAudioUrl: PropTypes.string,
  };

  static defaultProps = {
    enabled: false,
  };

  onShare() {
    const lyrics = encodeURIComponent(state.text);
    const shareAudioUrl = encodeURIComponent(this.props.shareAudioUrl);
    const url = `demo_vosyn_share.html?audio_url=${shareAudioUrl}&lyrics=${lyrics}`;
    window.open(url, '_self');
  }

  render() {
    const {enabled} = this.props;
    const disabled = !enabled;
    return (
      <div className="row btns-circle">
        <a className={classNames('btn-circle', {disabled})} href="demo_vosyn.html">
          <div className="btn btn-default btn-lg">
            <span className="glyphicon glyphicon-repeat" aria-hidden="true"/>
          </div>
          <div className="btn-circle-text">REPEAT</div>
        </a>
        <a className={classNames('btn-circle', {disabled})} href="demos.html">
          <div className="btn btn-default btn-lg">
            <span className="glyphicon glyphicon-remove" aria-hidden="true"/>
          </div>
          <div className="btn-circle-text">CLOSE</div>
        </a>
        <a id="share-btn" className={classNames('btn-circle', {disabled})} onClick={this.onShare}>
          <div className="btn btn-default btn-lg">
            <span className="glyphicon glyphicon-share-alt" aria-hidden="true"/>
          </div>
          <div className="btn-circle-text">SHARE</div>
        </a>
      </div>
    );
  }

}