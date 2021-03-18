@autobind
@observer
class ListenStep extends React.Component {
  @observable audioUrl;
  @observable playerLoaded = false;

  async componentDidMount() {
    const processFn = state.selectedStyle === 'singing' ? this.processSingingAudio : this.processSpeechAudio;
    const audioUrl = await processFn();
    runInAction(() => this.audioUrl = audioUrl);
  }

  @action
  onPlayerLoaded() {
    this.playerLoaded = true;
  }

  async processSingingAudio() {
    const vosynParams = {
      preset_name: 'demo_glum',
      voice: state.selectedVoice,
      input_text_upload_parts: 1
    };
    const vosynUploads = {
      input_text: {
        data: JSON.stringify({
          phrases: state.singingTexts.map((_, index) => index + 1),
          lyrics: state.singingTexts.map(input => input.text)
        }),
        contentType: 'application/json'
      }
    };
    const vosynTask = new VocloudTask('vosyn');
    await vosynTask.process(vosynParams, vosynUploads);

    const vomixTask = new VocloudTask('vomix');
    await vomixTask.process({
      preset_name: 'demo_glum',
      audio2_upload_with_url: vosynTask.output_url
    });
    return vomixTask.audio_url;
  }

  async processSpeechAudio() {
    const vosynTask = new VocloudTask('vosyn');
    await vosynTask.process(
      {
        score_type: 'txt',
        vocoder_mode: 1,
        voice: state.selectedVoice,
        voice_style: state.selectedEmotion,
      },
      {
        score: {
          data: state.speechText.text,
          contentType: 'text/plain'
        }
      }
    );
    return vosynTask.output_url;
  }

  render () {
    const title = this.playerLoaded? 'Listen to it!' : 'Processing...';
    return (
      <Step title={title}
            buttons={<Buttons enabled={this.playerLoaded} shareAudioUrl={this.audioUrl}/>}
      >
        <Player audioUrl={this.audioUrl} onLoaded={this.onPlayerLoaded} />
        <div id="lyrics">"{state.text}"</div>
      </Step>
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
    window.location.assign(url);
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