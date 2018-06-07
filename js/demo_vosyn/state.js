class State {
  @observable textInputs = [
    {text: "input your own text and fill in", totalSyllables: 8},
    {text: "the correct number of syllables your text will be", totalSyllables: 13},
    {text: "turned into a song by voiceful tech", totalSyllables: 9},
    {text: "enjoy and share it", totalSyllables: 5},
  ];
  @observable step = 1;
  @observable voice;

  @computed
  get text() {
    return this.textInputs.map(i => i.text).join('\n');
  }

  @action
  setStep(step) {
    this.step = step;
  }

  @action
  setVoice(voice) {
    this.voice = voice;
  }
}

const state = new State();