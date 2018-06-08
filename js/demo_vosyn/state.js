@autobind
class State {

  styles = [
    {value: 'singing', text: 'Singing'},
    {value: 'speech', text: 'Speech'},
  ];
  @observable selectedStyle;
  @action setSelectedStyle(style) {
    this.selectedStyle = style;
  }

  @observable singingTexts = [
    new Text('input your own text and fill in', {totalSyllables: 8}),
    new Text('the correct number of syllables your text will be', {totalSyllables: 13}),
    new Text('turned into a song by voiceful tech', {totalSyllables: 9}),
    new Text('enjoy and share it', {totalSyllables: 5}),
  ];
  @computed get singingText() {
    return this.singingTexts.map(i => i.text).join('\n');
  }
  @observable speechText = new Text('', {maxChars: 100});
  @computed get text() {
    return this.selectedStyle === 'singing'? this.singingText : this.speechText.text;
  }

  availableVoices = {
    'singing': [
      {value: 'randy', text: 'Male'},
      {value: 'ayesha', text: 'Female'},
    ],
    'speech': [
      {value: 'daniel', text: 'Male'},
      {value: 'ayesha', text: 'Female'},
    ]
  };
  @observable selectedVoice;
  @action setSelectedVoice(voice) {
    this.selectedVoice = voice;
  }
  @computed get voices() {
    return this.availableVoices[this.selectedStyle]
  }

  availableEmotions = {
    'daniel': [
      {value: 'angry', text: 'Angry'},
      {value: 'happy', text: 'Happy'},
      {value: 'neutral', text: 'Neutral'},
    ],
    'ayesha': [
      {value: 'afraid', text: 'Afraid'},
      {value: 'angry', text: 'Angry'},
      {value: 'happy', text: 'Happy'},
      {value: 'neutral', text: 'Neutral'},
      {value: 'sad', text: 'Sad'},
    ]
  };
  @observable selectedEmotion;
  @action setSelectedEmotion(emotion) {
    this.selectedEmotion = emotion;
  }
  @computed get emotions() {
    return this.availableEmotions[this.selectedVoice]
  }


  availableSteps = {
    style: <StyleStep/>,
    singingText: <SingingTextStep/>,
    speechText: <SpeechTextStep/>,
    voice: <VoiceStep/>,
    emotion: <EmotionStep/>,
    listen: <ListenStep/>,
  };
  @observable step = {
    step: this.availableSteps['style'],
    next: () => (this.selectedStyle === 'singing' ?
      {
        step: this.availableSteps['singingText'],
        next: () => ({
          step: this.availableSteps['voice'],
          next: () => ({
            step: this.availableSteps['listen']
          })
        })
      } :
      {
        step: this.availableSteps['speechText'],
        next: () => ({
          step: this.availableSteps['voice'],
          next: () => ({
            step: this.availableSteps['emotion'],
            next: () => ({
              step: this.availableSteps['listen']
            })
          })
        })
      }
    )
  };
  @observable stepNumber = 1;
  @action nextStep() {
    this.step = this.step.next();
    this.stepNumber += 1;
  }
}

class Text {
  @observable text;
  @observable maxChars;
  @observable totalSyllables;

  constructor(text, {maxChars, totalSyllables} = {}) {
    this.text = text;
    this.maxChars = maxChars;
    this.totalSyllables = totalSyllables;
  }

  clearText() {
    this.setText('');
  }

  @computed get correct() {
    let correct = true;
    if (this.maxChars) correct = (this.length <= this.maxChars);
    if (correct && this.totalSyllables) correct = (this.totalSyllables === this.syllables);
    return correct;
  }

  @action setText(text) {
    // Allow only to input letters and some symbols
    let char, key, cleanText = '';
    for(let i=0; i < text.length; i++) {
      char = text.slice(i, i + 1);
      key = char.charCodeAt(0);
      if ((key >= 65 && key <= 90) || (key >= 97 && key <= 122) ||
        [' ', ',', '.', "'", '-'].includes(char))
        cleanText += char;
    }
    this.text = cleanText;
  }

  @computed get syllables() {
    return syllable(this.text);
  }

}

const state = new State();