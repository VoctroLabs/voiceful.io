var step1Container = $('#step1-container'),
    step2Container = $('#step2-container'),
    step3Container = $('#step3-container');

/* *** STEP 1 *** */

var audioPickBtn = step1Container.find('#audio-pick-btn'),
    audioInput = step1Container.find('#audio-input'),
    audioInputSound,
    selectTrackBtn = step1Container.find('#select-track-btn'),
    selectTrackGroup = step1Container.find('#select-track-group'),
    tracks = selectTrackGroup.find('ul.dropdown-menu a'),
    btnsCircle1 = step1Container.find('.btns-circle').find('a'),
    btnConfirm1 = btnsCircle1.filter('.btn-confirm'),
    btnCancel1 = btnsCircle1.filter('.btn-cancel'),
    selectableSoundsBaseUrl = 'https://s3-eu-west-1.amazonaws.com/media.voctrolabs/vocloud/voscale_tasks/voiceful',
    selectableSounds = {};

function selectableSoundsSources(folder, filename) {
    return $.map(['webm', 'mp3'], function (extension) {
        return [selectableSoundsBaseUrl, folder, filename + '.' + extension].join('/');
    });
}

function audioInputHasFile() {
    return audioInput.get(0).files.length > 0;
}

function audioInputBlob() {
    return audioInput.get(0).files[0];
}

audioPickBtn.click(function () {
    if (audioInputHasFile()) {
        // Play or stop sound
        if (audioInputSound.playing()) audioInputSound.stop();
        else audioInputSound.play();
    }
    else audioInput.click();
});

audioInput.change(function () {
    if (audioInputHasFile()) {
        audioPickBtn.addClass('btn-loading').text('Loading...');
        var reader = new FileReader();
        reader.addEventListener('load', function () {
            audioInputSound = new Howl({
                src: reader.result,
                onload: function () {
                    if (audioInputHasFile())
                        audioPickBtn.removeClass('btn-loading').addClass('btn-play').text('Click to listen');
                },
                onplay: function () {
                    if (audioInputHasFile())
                        audioPickBtn.removeClass('btn-play').addClass('btn-stop').text('Click to stop');
                },
                onstop: function () {
                    if (audioInputHasFile())
                        audioPickBtn.removeClass('btn-stop').addClass('btn-play').text('Click to listen');
                },
                onend: function () {
                    if (audioInputHasFile())
                        audioPickBtn.removeClass('btn-stop').addClass('btn-play').text('Click to listen');
                }
            });
        });
        reader.readAsDataURL(audioInputBlob());
    }
    renderStep1();
});

//tracks.click(function () {
//    tracks.removeClass('selected');
//    $(this).addClass('selected');
//    renderStep1();
//});

tracks.on('click touchstart', function() {
    tracks.removeClass('selected');
    $(this).addClass('selected');
    renderStep1();
});

selectTrackGroup.on('hidden.bs.dropdown', function () {
    var selectedTrack = getSelectedTrack();
    if (selectedTrack.length === 0) return;
    selectTrackBtn.removeAttr('data-toggle').on('click', function () {
        var trackSound = selectableSounds[selectedTrack.text()];
        // Download audio if it has not been downloaded already
        if (!trackSound) {
            selectTrackBtn.removeClass('btn-play').addClass('btn-loading');
            trackSound = new Howl({
                src: selectableSoundsSources(selectedTrack.data('folder'), 'original'),
                autoplay: true
            });
            selectableSounds[selectedTrack.text()] = trackSound;
            trackSound.once('load', function() {
                if (getSelectedTrack().length > 0) selectTrackBtn.removeClass('btn-loading');;
            });
            trackSound.on('play', function () {
                if (getSelectedTrack().length > 0) selectTrackBtn.removeClass('btn-play').addClass('btn-stop');
            });
            trackSound.on('stop', function () {
                if (getSelectedTrack().length > 0) selectTrackBtn.removeClass('btn-stop').addClass('btn-play');
            });
            trackSound.on('end', function () {
                if (getSelectedTrack().length > 0) selectTrackBtn.removeClass('btn-stop').addClass('btn-play');
            });
        }
        // Play or stop sound
        if (trackSound.playing()) trackSound.stop();
        else trackSound.play();
    });
});

function getSelectedTrack() {
    return tracks.filter('.selected');
}

// Set correct selection and disabled state for buttons
function renderStep1() {
    var selectedTrack = getSelectedTrack(),
        btnBaseClasses = 'btn btn-default btn-lg',
        audioPickBtnClasses = [btnBaseClasses],
        selectTrackBtnClasses = [btnBaseClasses];
    if (selectedTrack.length > 0) {
        audioPickBtnClasses.push('disabled');
        selectTrackBtnClasses.push('selected btn-play');
        selectTrackBtn.text(selectedTrack.text());
        btnsCircle1.removeClass('disabled');
    } else if (audioInputHasFile()) {
        audioPickBtnClasses.push('selected');
        selectTrackBtnClasses.push('disabled btn-select');
        selectTrackBtn.text('Select your track');
        tracks.removeClass('selected');
        btnsCircle1.removeClass('disabled');
    } else {
        audioPickBtn.text('Click to upload');
        selectTrackBtnClasses.push('btn-select');
        selectTrackBtn.text('Select your track').off('click').attr('data-toggle', 'dropdown');
        tracks.removeClass('selected');
        btnsCircle1.addClass('disabled');
    }
    audioPickBtn.attr('class', audioPickBtnClasses.join(' '));
    selectTrackBtn.attr('class', selectTrackBtnClasses.join(' '));
}

function stopAllSounds() {
    Object.keys(selectableSounds).forEach(function (key) {
       selectableSounds[key].stop();
    });
    audioInputSound && audioInputSound.stop();
}

// On confirm go to next step
btnConfirm1.click(function () {
    stopAllSounds();
    stepTransition(step1Container, step2Container);
});

btnCancel1.click(function () {
    stopAllSounds();
    audioInput.val(''); // clear file input
    tracks.removeClass('selected');
    renderStep1();
});

/* *** STEP 2 *** */

var slider = step2Container.find('#slider'),
    sliderText = step2Container.find('#sliderText'),
    btnsCircle2 = step2Container.find('.btns-circle').find('a'),
    btnConfirm2 = btnsCircle2.filter('.btn-confirm'),
    sliderOptions = [
        { text: 'Slower and down', filename: 'slower_down' },
        { text: 'Down', filename: 'down' },
        { text: 'Slow', filename: 'slow' },
        { text: 'Fast', filename: 'fast' },
        { text: 'Up', filename: 'up' },
        { text: 'Faster and up', filename: 'faster_up' }
    ];

slider.slider({
    min: 0,
    max: sliderOptions.length - 1,
    value: 0,
    tooltip: 'hide',
    ticks: $.map(sliderOptions, function (e, i) { return i })
});

// Return the text option corresponds to the current position of the slider
function getSliderOption() {
 return sliderOptions[slider.slider('getValue')];
}

slider.on('change', function () {
    sliderText.text(getSliderOption().text);
});

btnConfirm2.click(function () {
    stepTransition(step2Container, step3Container);
    voscale();
});

/* *** STEP 3 *** */

var shareAudioUrl;

function voscale() {
    var selectedTrack = getSelectedTrack();

    if (selectedTrack.length > 0) { // Use a pre-existing track
        var soundSources = selectableSoundsSources(selectedTrack.data('folder'), getSliderOption().filename);
        shareAudioUrl = soundSources[0];
        createAudio(soundSources);
    } else { // Upload a custom track from the user
        var voscaleTask = new VocloudTask('voscale'),
            parameters = {
                preset_name: getSliderOption().text
            },
            uploads = {
                audio: {
                    contentType: false,
                    data: audioInputBlob()
                }
            };

        voscaleTask.process(parameters, uploads).done(function () {
            shareAudioUrl = voscaleTask.audio_url;
            createAudio(shareAudioUrl);
        });
    }
}

$('#share-btn').click(function () {
    var url = 'demo_voscale_share.html?audio_url=' + encodeURIComponent(shareAudioUrl);
    window.open(url, '_self');
});
