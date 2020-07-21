function SynthWidget()
{
  this.status = '';
  this.audio_status = 'stop';
  this.phrase_status = [];
  this.phrase_status[0] = 'default';
  this.phrase_status[1] = 'default';
  this.phrase_status[2] = 'default';

  this.currentSong = 0;
  this.songID = 0;
  this.elements = {
    widget:document.querySelector('#voiceful-demo-widget'),
    select:document.querySelector('#select-song'),
    input_happy:document.querySelector('#demo-happy-input'),
    input_letitgo_1:document.querySelector('#demo-letitgo-input-1'),
    input_letitgo_2:document.querySelector('#demo-letitgo-input-2'),
    help:document.querySelector('#help'),
    original_happy:document.querySelector('#demo-happy-original'),
    original_letitgo_1:document.querySelector('#demo-letitgo-original-1'),
    original_letitgo_2:document.querySelector('#demo-letitgo-original-2'),
    synthesize_button:document.querySelector('#synthesize-button'),
    play_button:document.querySelector('#play-button'),
    audio:document.querySelector('#audio-voiceful-demo')
  };

  this.audio_srcs = [];
  this.audio_srcs[0] = "https://s3-eu-west-1.amazonaws.com/media.voctrolabs/vocloud/vomix_tasks/66cd6069-9e40-4328-afaa-715330a8aa90/outputs/original/output.mp3";
  this.audio_srcs[1] = "https://s3-eu-west-1.amazonaws.com/media.voctrolabs/vocloud/vomix_tasks/e072b121-2bd6-430c-9289-3853dfd6eac4/outputs/original/output.mp3";

  this.init=function()
  {
    //Init status
    this.status = 'writing';
    this.audio_status = 'stop';

    //Init play/synthesize buttons
    this.elements.play_button.innerHTML = "<i class='glyphicon glyphicon-play'></i>&nbsp;&nbsp;PLAY"
    this.elements.synthesize_button.innerHTML = "<i class='glyphicon glyphicon-music'></i>&nbsp;&nbsp;CREATE SONG&nbsp;&nbsp;<i class='glyphicon glyphicon-music'></i>"
    this.elements.synthesize_button.style.display = 'none';
    this.elements.play_button.style.display = "inline";

    //Init song #0 lyrics
    this.elements.input_happy.value="dear Voiceful";
    this.elements.original_happy.innerHTML='';
    this.phrase_status[0] = 'default';

    //Init song #1 lyrics
    this.elements.input_letitgo_1.value="Can't hold it back anymore";
    this.elements.original_letitgo_1.innerHTML='';
    this.phrase_status[1] = 'default';
    this.elements.input_letitgo_2.value="Turn away and slam the door";
    this.elements.original_letitgo_2.innerHTML='';
    this.phrase_status[2] = 'default';

    //Init audio default URLs
    this.audio_srcs[0] = "https://s3-eu-west-1.amazonaws.com/media.voctrolabs/vocloud/vomix_tasks/66cd6069-9e40-4328-afaa-715330a8aa90/outputs/original/output.mp3";
    this.audio_srcs[1] = "https://s3-eu-west-1.amazonaws.com/media.voctrolabs/vocloud/vomix_tasks/e072b121-2bd6-430c-9289-3853dfd6eac4/outputs/original/output.mp3";

    this.elements.help.innerHTML='Click on the text box to change the lyrics.';

    //document.querySelector('#voiceful-demo-widget').style.background = "url(img/hb_alpha020.png) repeat center";

    return;
  }

  this.selectSong=function(_songID)
  {
    if (this.status == 'synthesizing')
    {
      alert('please wait until synthesis is finished!');
      return;
    }

    this.songID = _songID;

    if (_songID == 0)
    {
        document.querySelector('#demo-letitgo-text').style.display = 'none';
        document.querySelector('#demo-happy-text').style.display = 'block';
        this.elements.input_happy.value="dear Voiceful";
        this.elements.original_happy.innerHTML='';
        this.phrase_status[0] = 'default';

        this.status = 'writing';
        this.elements.audio.src = this.audio_srcs[0];

        //document.querySelector('#voiceful-demo-widget').style.background = "url(img/hb_alpha020.png) repeat center";
    }
    else
    {
        document.querySelector('#demo-happy-text').style.display = 'none';
        document.querySelector('#demo-letitgo-text').style.display = 'block';
        this.elements.input_letitgo_1.value="Can't hold it back anymore";
        this.elements.original_letitgo_1.innerHTML='';
        this.phrase_status[1] = 'default';
        this.elements.input_letitgo_2.value="Turn away and slam the door";
        this.elements.original_letitgo_2.innerHTML='';
        this.phrase_status[2] = 'default';
        
        this.status = 'writing';
        this.elements.audio.src = this.audio_srcs[1];
  
        //document.querySelector('#voiceful-demo-widget').style.background = "url(img/snow_alpha030.png) repeat center";
    }

    this.elements.audio.pause();
    this.elements.audio.currentTime=0
    this.audio_status = 'stop';
    
    this.elements.play_button.innerHTML = "<i class='glyphicon glyphicon-play'></i>&nbsp;&nbsp;PLAY";
    this.elements.synthesize_button.innerHTML = "<i class='glyphicon glyphicon-music'></i>&nbsp;&nbsp;CREATE SONG&nbsp;&nbsp;<i class='glyphicon glyphicon-music'></i>";

    this.elements.synthesize_button.style.display = 'none';
    this.elements.play_button.style.display = 'inline';

  }

  this.change=function(phraseID)
  {
    this.status==='writing';


    this.phrase_status[phraseID] = 'modified';

    //show synthesize button
    this.elements.play_button.style.display = "none";
    this.elements.synthesize_button.style.display = "inline";

    if ((phraseID == 0) && (this.elements.input_happy.value==''))
    {
      this.elements.input_happy.style.width='0';
      this.phrase_status[phraseID] = 'default';
    }
    else if ((phraseID == 1) && (this.elements.input_letitgo_1.value==''))
    {
      this.elements.input_letitgo_1.style.width='0';
      this.phrase_status[phraseID] = 'default';
    }
    else if ((phraseID == 2) && (this.elements.input_letitgo_2.value==''))
    {
      this.elements.input_letitgo_2.style.width='0';
      this.phrase_status[phraseID] = 'default';
    }
    return;
  }

  this.focus=function(phraseID)
  {
    if(this.status!=='error')
    {
      this.elements.help.innerHTML='Write your own lyrics';
    }

    if(this.phrase_status[phraseID]==='modified')
    {
      return;
    }

    if (phraseID == 0)
    {
      this.elements.original_happy.innerHTML="dear Voiceful";
      this.elements.input_happy.value='';
    }
    else if (phraseID == 1)
    {
      this.elements.original_letitgo_1.innerHTML="Can't hold it back anymore";
      this.elements.input_letitgo_1.value='';
    }
    else if (phraseID == 2)
    {
      this.elements.original_letitgo_2.innerHTML="Turn away and slam the door";
      this.elements.input_letitgo_2.value='';
    }

  };

  this.losefocus=function(phraseID)
  {
    if (this.status!=='error')
    {
      this.elements.help.innerHTML='Click on the text box to change the lyrics.';
    }
  
    if(this.phrase_status[phraseID]==='modified')
    {
      return;
    }

    if (phraseID == 0)
    {
      this.elements.input_happy.value="dear Voiceful";
      this.elements.original_happy.innerHTML='';
      this.phrase_status[phraseID]='default'
      
      this.elements.synthesize_button.style.display = 'none';
      this.elements.play_button.style.display = 'inline';
      this.elements.audio.src = this.audio_srcs[0];
      this.elements.play_button.innerHTML = "<i class='glyphicon glyphicon-play'></i>&nbsp;&nbsp;PLAY";

    }
    else if (phraseID == 1)
    {
      this.elements.input_letitgo_1.value="Can't hold it back anymore";
      this.elements.original_letitgo_1.innerHTML='';
      this.phrase_status[phraseID]='default';

      if (this.phrase_status[phraseID+1]=='default')
      {
        this.elements.synthesize_button.style.display = 'none';
        this.elements.play_button.style.display = 'inline';
        this.elements.audio.src = this.audio_srcs[1];
        this.elements.play_button.innerHTML = "<i class='glyphicon glyphicon-play'></i>&nbsp;&nbsp;PLAY";
      }
    }
    else if (phraseID == 2)
    {
      this.elements.input_letitgo_2.value="Turn away and slam the door";
      this.elements.original_letitgo_2.innerHTML='';
      this.phrase_status[phraseID]='default';

      if (this.phrase_status[phraseID-1]=='default')
      {
        this.elements.synthesize_button.style.display = 'none';
        this.elements.play_button.style.display = 'inline';
        this.elements.audio.src = this.audio_srcs[1];
        this.elements.play_button.innerHTML = "<i class='glyphicon glyphicon-play'></i>&nbsp;&nbsp;PLAY";
      }

    }
  }

  this.error = function()
  {
    alert("audio error!");

    synthwidget.elements.help.innerHTML='Click on the text box to change the lyrics.';
  }

  this.ended = function()
  {
    this.audio_status = 'stop';
    this.elements.play_button.innerHTML = "<i class='glyphicon glyphicon-play'></i>&nbsp;&nbsp;PLAY";

    synthwidget.elements.help.innerHTML='Click on the text box to change the lyrics.';
  }

  this.play = function(event)
  {

    if (this.songID == 0)
    {
      this.elements.input_happy.blur();
    }
    else if (this.songID > 0)
    {
      this.elements.input_letitgo_1.blur();
      this.elements.input_letitgo_2.blur();
    }

    //if(this.elements.audio.duration > 0 && !this.elements.audio.paused) //is playing
    if(this.audio_status == 'playing') //is playing
    {
      this.elements.audio.pause();
      this.elements.audio.currentTime=0
      this.elements.play_button.innerHTML = "<i class='glyphicon glyphicon-play'></i>&nbsp;&nbsp;PLAY";
      this.audio_status = 'stop';

      synthwidget.elements.help.innerHTML='Click on the text box to change the lyrics.';
      return;
    }
    else if ( this.status==='generated' )
    {
      this.elements.play_button.innerHTML = "<i class='glyphicon glyphicon-headphones gly-spin'></i>&nbsp;&nbsp;STOP";
      
      this.elements.audio.load();
      this.elements.audio.play();

      synthwidget.elements.help.innerHTML='Playing...';
      return;
    }
    else if (this.status==='writing')
    {
      if (this.songID == 0)
      {
        if (this.phrase_status[0] == 'default')
        {
          this.elements.play_button.innerHTML = "<i class='glyphicon glyphicon-headphones gly-spin'></i>&nbsp;&nbsp;STOP";
          this.elements.audio.load();
          this.elements.audio.play();

          synthwidget.elements.help.innerHTML='Playing...';
          return;
        }
      }
      else if (this.songID > 0)
      {
        if ((this.phrase_status[1] == 'default') && (this.phrase_status[2] == 'default'))
        {
          this.elements.play_button.innerHTML = "<i class='glyphicon glyphicon-headphones gly-spin'></i>&nbsp;&nbsp;STOP";
          this.elements.audio.load();
          this.elements.audio.play();

          synthwidget.elements.help.innerHTML='Playing...';       
          return;
        }
      }
    }

  }

  this.synthesize=function(event, phraseID)
  {
      if ( (event.type==='click' && event.button!==0) ||
           (event.type==='keydown' && event.key!=='Enter') || 
           this.status==='synthesizing' || 
           this.status==='error' )
      {
        return;
      }

      if (phraseID == 0)
      {
        if (this.elements.input_happy.value === '')
        {
            this.elements.input_happy.blur();
            return;
        }
      }
      else if (phraseID > 0)
      {
        if ((this.elements.input_letitgo_1.value === '') || (this.elements.input_letitgo_2.value === ''))
        {
            this.elements.input_letitgo_1.blur();
            this.elements.input_letitgo_2.blur();
            return;
        }
      }



      this.elements.synthesize_button.innerHTML = "<i class='glyphicon glyphicon-refresh gly-spin'></i>&nbsp;&nbsp;SYNTHESIZING...";
      this.status = "synthesizing";

      this.elements.help.innerHTML='Generating song with AI...';

      document.querySelector('#nav-happybday-tab').classList.add("disabled");
      document.querySelector('#nav-letitgo-tab').classList.add("disabled");
      document.querySelector('#nav-happybday-link').classList.add("disabled");
      document.querySelector('#nav-letitgo-link').classList.add("disabled");

      var vosynPreset;
      var presetVoMix;
      var vosynParams;
      var vosynUploads;

      if (synthwidget.songID == 0)
      {
        vosynPreset = 'happybirthday_excerpt';
        vomixPreset = 'happybirthday_mix2';

        vosynParams = {
          preset_name: vosynPreset,
          voice: "ayesha",
          input_text_upload_parts: 1
        };

        vosynUploads = {
          input_text: {
            data: JSON.stringify({
              phrases: [0],
              lyrics: [synthwidget.elements.input_happy.value]
            }),
            contentType: 'application/json'
          }
        };
      }
      else
      {
        vosynPreset = 'let_it_go_excerpt';
        vomixPreset = 'let_it_go_mix2';

        vosynParams = {
          preset_name: vosynPreset,
          voice: "ayesha",
          input_text_upload_parts: 1
        };

        vosynUploads = {
          input_text: {
            data: JSON.stringify({
              phrases: [0,1],
              lyrics: [synthwidget.elements.input_letitgo_1.value, synthwidget.elements.input_letitgo_2.value]
            }),
            contentType: 'application/json'
          }
        };

      }

      const vosynTask = new VocloudTask('vosyn');
      vosynTask.process(vosynParams, vosynUploads).done(function () 
      {
        if (vosynTask.status != "finished")
        {
          alert("server error");
          synthwidget.init();
        }
        //Finished synthesis
        synthwidget.elements.help.innerHTML='Mixing in the virtual studio...';

        var vomixParams = {
          preset_name: vomixPreset,
          audio2_upload_with_url: vosynTask.output_url
        };

        const vomixTask = new VocloudTask('vomix');
        vomixTask.process(vomixParams).done(function () 
        {
          //Finished mixing
          synthwidget.elements.synthesize_button.style.display = 'none';
          synthwidget.elements.play_button.style.display = 'inline';

          synthwidget.elements.synthesize_button.innerHTML = "<i class='glyphicon glyphicon-music'></i>&nbsp;&nbsp;CREATE SONG&nbsp;&nbsp;<i class='glyphicon glyphicon-music'></i>";
          
          synthwidget.status = 'generated';

          document.querySelector('#nav-happybday-tab').classList.remove("disabled");
          document.querySelector('#nav-letitgo-tab').classList.remove("disabled");
          document.querySelector('#nav-happybday-link').classList.remove("disabled");
          document.querySelector('#nav-letitgo-link').classList.remove("disabled");

          synthwidget.elements.help.innerHTML='Click on the text box to change the lyrics.';

          synthwidget.elements.audio.src = vomixTask.audio_url;
          synthwidget.elements.audio.load();
          synthwidget.play();
        });

        return;
      }).fail(function ()
      {
        //alert("server error");
        synthwidget.init();
        return; 
      });
    }
};

var synthwidget=new SynthWidget();

window.onload=synthwidget.init()
