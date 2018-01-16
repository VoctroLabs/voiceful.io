var step1Container = $('#step1-container'),
    step2Container = $('#step2-container');

/* *** STEP 1 *** */

var recordBtn = step1Container.find('#record-btn'),
    recordedSound,
    recordingTimeout,
    audioPickBtn = step1Container.find('#audio-pick-btn'),
    audioInput = step1Container.find('#audio-input'),
    audioInputSound,
    btnsCircle1 = step1Container.find('.btns-circle').find('a'),
    btnConfirm1 = btnsCircle1.filter('.btn-confirm'),
    btnCancel1 = btnsCircle1.filter('.btn-cancel'),
    recorder = null;

recordBtn.status = 'init';
recordBtn.baseClasses = recordBtn.attr('class');
recordBtn.click(function () {
    if (recordBtn.status === 'init') {
        recordBtn.status = 'countdown';
        recordCountDown(3);
    } else if (recordBtn.status === 'recording') {
        recordBtn.status = 'recorded';
        stopRecording();
    } else if (recordBtn.status === 'recorded') {
        recordBtn.status = 'playing';
        recordedSound.play();
    } else if (recordBtn.status === 'playing') {
        recordBtn.status = 'recorded';
        recordedSound.stop();
    }
    renderStep1();
});

function recordCountDown(seconds) {
    if (seconds > 0) {
        recordBtn.countdown = seconds;
        renderRecordBtn();
        setTimeout(function () { recordCountDown(seconds - 1); }, 1000);
    } else captureMicrophone();
}

function captureMicrophone() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
    navigator.getUserMedia(
        {audio: true},
        function (microphone) {
            var audio_context = new AudioContext,
                input = audio_context.createMediaStreamSource(microphone),
                config = { numChannels: 1 };

            recorder = new Recorder(input, config);
            recorder.clear();
            recorder.record();

            // UI actions
            recordBtn.status = 'recording';
            renderRecordBtn();

            // Put a maximum recording time
            recordingTimeout = setTimeout(function recordingTimeout() {
                if (recordBtn.status === 'recording') {
                    stopRecording();
                    alert('Please, do not record more than 15 seconds.');
                }
            }, 15 * 1000); // 15 seconds
        },
        function(error) {
            console.error(error);
            alert('Unable to access your microphone.');
        }
    );
}

function stopRecording() {
    clearTimeout(recordingTimeout);
    recorder.stop();
    recordBtn.status = 'loading';
    renderStep1();
    var recordedFunc = function () {
        recordBtn.status = 'recorded';
        renderRecordBtn();
    };
    recorder.exportWAV(function (blob) {
        recorder.blob = blob;
        recordedSound = new Howl({
            src: URL.createObjectURL(blob),
            format: 'wav',
            onload: recordedFunc,
            onend: recordedFunc
        });
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

// Set correct selection and disabled state for buttons
function renderStep1() {
    var btnBaseClasses = 'btn btn-default btn-lg',
        audioPickBtnClasses = [btnBaseClasses],
        recordBtnClasses = [btnBaseClasses];
    if (recordBtn.status !== 'init') { // there is a recorded audio or we are recording one
        recordBtnClasses.push('selected');
        audioPickBtnClasses.push('disabled');
        if ($.inArray(recordBtn.status, ['loading', 'recorded', 'playing']) > -1) // recording finished
            btnsCircle1.removeClass('disabled');
        else btnsCircle1.addClass('disabled');
    }
    else if (audioInputHasFile()) {
        recordBtnClasses.push('disabled');
        audioPickBtnClasses.push('selected');
        btnsCircle1.removeClass('disabled');
    } else {
        audioPickBtn.text('Click to upload');
        btnsCircle1.addClass('disabled');
    }
    audioPickBtn.attr('class', audioPickBtnClasses.join(' '));
    renderRecordBtn(recordBtnClasses);
}

function renderRecordBtn(classes) {
    if (!classes) classes = ['btn btn-default btn-lg'];
    if (recordBtn.status === 'init') recordBtn.text('Click to record');
    else if (recordBtn.status === 'countdown') {
        recordBtn.text('Start in ' + recordBtn.countdown);
        classes.push('selected');
    } else if (recordBtn.status === 'recording') {
        recordBtn.text('Stop recording');
        classes.push('selected', 'btn-record');
    } else if (recordBtn.status === 'loading') {
        recordBtn.text('Your recording');
        classes.push('selected', 'btn-loading');
    } else if (recordBtn.status === 'recorded') {
        recordBtn.text('Your recording');
        classes.push('selected', 'btn-play');
    } else if (recordBtn.status === 'playing') {
        recordBtn.text('Your recording');
        classes.push('selected', 'btn-stop');
    }
    recordBtn.attr('class', classes.join(' '))
}

function stopAllSounds() {
    recordedSound && recordedSound.stop();
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
    recordBtn.status = 'init'; // clear recorded audio
    renderStep1();
});

/* *** STEP 2 *** */

var voices = $('#voices').find('a'),
    btnsCircle2 = step2Container.find('.btns-circle').find('a'),
    btnConfirm2 = btnsCircle2.filter('.btn-confirm'),
    btnCancel2 = btnsCircle2.filter('.btn-cancel');

function getSelectedVoice() {
    return voices.filter('.selected');
}

voices.click(function () {
    var selectedOption = $(this);
    voices.removeClass('selected').addClass('disabled');
    selectedOption.removeClass('disabled').addClass('selected');
    btnsCircle2.removeClass('disabled');
});

btnConfirm2.click(function () {
    stepTransition(step2Container, step3Container);
    votrans();
});

btnCancel2.click(function () {
    voices.removeClass('selected').removeClass('disabled');
    btnsCircle2.addClass('disabled');
});

/* *** STEP 3 *** */

var votransTask, shareAudioUrl;

function votrans() {
    var parameters = {
        preset_name: getSelectedVoice().text()
    };

    var uploads = {
        audio: recordBtn.status === 'recorded' ?
            {
                contentType: 'audio/wav',
                data: recorder.blob
            } :
            {
                contentType: false,
                data: audioInputBlob()
            }
    };

    votransTask = new VocloudTask('votrans');
    votransTask.process(parameters, uploads).done(function () {
        shareAudioUrl = votransTask.audio_url;
        createAudio(shareAudioUrl);
    });
}

$('#share-btn').click(function () {
    var url = 'demo_votrans_share.html?audio_url=' + encodeURIComponent(shareAudioUrl);
    window.open(url, '_self');
});
