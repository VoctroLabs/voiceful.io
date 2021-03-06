let state;

@autobind
class State {

  styles = [
    {value: 'singing', text: 'Singing'},
    {value: 'speech', text: 'Speech'},
  ];
  @observable selectedStyle;
  @action setSelectedStyle(style) {
    this.selectedStyle = style;
    if (style === 'speech') this.selectedLanguage = 'en';
    else this.selectedLanguage = undefined;
  }

  languages = [
    {value: 'en', text: 'English'},
    {value: 'es', text: 'Spanish'},
  ];
  @observable selectedLanguage;
  @action setSelectedLanguage(language) {
    this.selectedLanguage = language;
  }

  availableAllowedChars = {
    'singing': {
      'en': "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ ,.'-",
      'es': "abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZáéíóúÁÉÍÓÚ´ ,.'-",
    },
    'speech': {
      'en': "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ ,.'-?!",
      'es': "abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZáéíóúÁÉÍÓÚ´ ,.'-¿?¡!",
    },
  };
  @computed get allowedChars() {
    return this.availableAllowedChars[this.selectedStyle][this.selectedLanguage];
  }

  availableSingingTexts = {
    'en': [
      new Text('input your own text and fill in', {totalSyllables: 8}),
      new Text('the correct number of syllables your text will be', {totalSyllables: 13}),
      new Text('turned into a song by voiceful tech', {totalSyllables: 9}),
      new Text('enjoy and share it', {totalSyllables: 5}),
    ],
    'es': [
      new Text('Tú mismo puedes componer', {totalSyllables: 8}),
      new Text('la letra de cualquier canción sólo tienes que', {totalSyllables: 13}),
      new Text('escribirla aquí y ya podrás', {totalSyllables: 9}),
      new Text('escuchaarla', {totalSyllables: 5}),
    ],
  };
  @computed get singingTexts() {
    return this.availableSingingTexts[this.selectedLanguage];
  }
  @computed get singingText() {
    return this.singingTexts.map(i => i.text).join('\n');
  }
  @observable speechText = new Text('', {maxChars: 100});
  @computed get text() {
    return this.selectedStyle === 'singing'? this.singingText : this.speechText.text;
  }

  availableVoices = {
    'singing': {
      'en': [
        {value: 'ayesha', text: 'Female'},
        {value: 'randy', text: 'Male'},
      ],
      'es': [
        {value: 'maika', text: 'Female'},
        {value: 'bruno', text: 'Male'},
      ],
    },
    'speech': {
      'en': [
        {value: 'ayesha', text: 'Female'},
        {value: 'daniel', text: 'Male'},
      ],
    }
  };
  @observable selectedVoice;
  @action setSelectedVoice(voice) {
    this.selectedVoice = voice;
  }
  @computed get voices() {
    return this.availableVoices[this.selectedStyle][this.selectedLanguage]
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
    language: <LanguageStep/>,
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
        step: this.availableSteps['language'],
        next: () => ({
          step: this.availableSteps['singingText'],
          next: () => ({
            step: this.availableSteps['voice'],
            next: () => ({
              step: this.availableSteps['listen']
            })
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
    let char, cleanText = '';
    for(let i=0; i < text.length; i++) {
      char = text.slice(i, i + 1);
      if (state.allowedChars.indexOf(char) > -1) cleanText += char;
    }
    this.text = cleanText;
  }

  @computed get syllables() {
    if (state.selectedLanguage === 'es') return new Syllables(this.text).get().length;
    return syllable(this.text);
  }

}

state = new State();
