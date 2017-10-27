var syllable = require('syllable');

// Turn on tooltips
$('.num-syllabes').tooltip();

var step1Container = $('#step1-container'),
    step2Container = $('#step2-container'),
    step3Container = $('#step3-container');

/* *** STEP 1 *** */

var inputs = step1Container.find('input'),
    btnsCircle1 = step1Container.find('.btns-circle').find('a'),
    btnConfirm1 = btnsCircle1.filter('.btn-confirm'),
    btnCancel1 = btnsCircle1.filter('.btn-cancel');

function renderStep1() {
    var allInputsCorrect = true;
    inputs.each(function (i, input) {
        input = $(input);
        var formGroup = input.parent(),
            span = formGroup.find('.num-syllabes'),
            syllables = syllable(input.val()),
            totalSyllables = input.data('syllables'),
            inputCorrect = (syllables == totalSyllables);
        span.text(syllables + '/' + totalSyllables);
        if (inputCorrect) {
            span.html('<span class="glyphicon glyphicon-ok"></span>');
            formGroup.removeClass('disabled');
        }
        else formGroup.addClass('disabled');
        allInputsCorrect = allInputsCorrect && inputCorrect;
    });
    if (allInputsCorrect) btnsCircle1.removeClass('disabled');
    else btnsCircle1.addClass('disabled');
}

inputs.on('change', renderStep1);
inputs.on('keyup', renderStep1);

inputs.on('keydown', function (e) {
    // Allow only to input letters and ' (222) . , 
    var key = e.keyCode;
    if (e.ctrlKey || e.altKey || !((key >= 65 && key <= 90) || key==222 || key==37 || key==39 || key==188 || key==190 || [8, 32, 44, 46].includes(key))) e.preventDefault();
});

// On confirm go to next step
btnConfirm1.click(function () {
    stepTransition(step1Container, step2Container);
});

btnCancel1.click(function () {
    inputs.val(''); // clear inputs
    btnsCircle1.addClass('disabled');
    renderStep1();
});

// Analyse pre-existing text
renderStep1();

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
    vosyn();
});

btnCancel2.click(function () {
    voices.removeClass('selected').removeClass('disabled');
    btnsCircle2.addClass('disabled');
});

/* *** STEP 3 *** */

var shareAudioUrl;

function vosyn() {
    var vosynTask = new VocloudTask('vosyn'),
        vosynParams = {
            preset_name: 'demo_glum',
            voice: getSelectedVoice().data('voice'),
            input_text_upload_parts: 1
        },
        vosynUploads = {
            input_text: {
                data: JSON.stringify({
                    phrases: $.map(new Array(inputs.length), function (e, i) { return i + 1 }),
                    lyrics: $.map(inputs, function (input) { return input.value })
                })
            }
        };

    vosynTask.process(vosynParams, vosynUploads).done(function () {
        var vomixTask = new VocloudTask('vomix'),
            vomixParams = {
                preset_name: 'demo_glum',
                audio2_upload_with_url: vosynTask.audio_url
            };
        vomixTask.process(vomixParams).done(function () {
            shareAudioUrl = vomixTask.audio_url;

            var lyrics = $.map(inputs, function (input) { return input.value });
            var lyrics_join = lyrics[0]+'<br>'+lyrics[1]+'<br>'+lyrics[2]+'<br>'+lyrics[3];
            $('#lyrics').text('<p>'+'\"'+lyrics_join+'\"'+'</p>');

            createAudio(shareAudioUrl);
        });
    });
}

$('#share-btn').click(function () {
    var lyrics = $.map(inputs, function (input) { return input.value });
    var lyrics_join = lyrics[0]+'\n'+lyrics[1]+'\n'+lyrics[2]+'\n'+lyrics[3];
    var url = 'demo_vosyn_share.html?audio_url=' + encodeURIComponent(shareAudioUrl) + '&lyrics=' + encodeURIComponent(lyrics_join);
    
    window.open(url, '_self');
});
