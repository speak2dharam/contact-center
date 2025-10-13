$(document).ready(function () {
    let mediaRecorder;
    let audioChunks = [];
    let timerInterval;
    let seconds = 0;
    let isRecording = false;
    let isMuted = false;

    // Speech recognition setup (for transcript)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition;
    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = function (event) {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    transcript += event.results[i][0].transcript;
                } else {
                    transcript += event.results[i][0].transcript;
                }
            }
            $('#transcript').val($('#transcript').val() + transcript);
        };

        recognition.onerror = function (event) {
            console.error('Speech recognition error', event.error);
            $('#status').text('Speech recognition error: ' + event.error);
        };
    }
    else {
        $('#status').text('Speech recognition not supported in this browser. Transcript will not work.');
    }

    // Start recording button click
    $('#startBtn').click(function () {
        startRecording();
    });

    // Stop recording button click
    $('#stopBtn').click(function () {
        stopRecording();
    });

    // Mute button click
    $('#muteBtn').click(function () {
        toggleMute();
    });

    // Cancel button click
    $('#cancelBtn').click(function () {
        cancelRecording();
    });

    // Submit button click
    $('#submitBtn').click(function () {
        submitRecording();
    });

    // Function to start recording
    function startRecording() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(function (stream) {
                    // Hide start button, show recording controls
                    $("#dropArea").hide();
                    $("#recordingSection").show();

                    // Start timer
                    startTimer();

                    // Start speech recognition
                    if (recognition) {
                        recognition.start();
                    }

                    // Set up media recorder
                    mediaRecorder = new MediaRecorder(stream);
                    mediaRecorder.start();
                    isRecording = true;

                    mediaRecorder.ondataavailable = function (event) {
                        audioChunks.push(event.data);
                    };

                    $('#status').text('Recording in progress...');
                })
                .catch(function (err) {
                    console.error('Error accessing microphone:', err);
                    $('#status').text('Error accessing microphone: ' + err.message);
                });
        } else {
            $('#status').text('getUserMedia not supported in this browser.');
        }
    }

    // Function to stop recording
    function stopRecording() {
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
            isRecording = false;

            // Stop timer
            clearInterval(timerInterval);

            // Stop speech recognition
            if (recognition) {
                recognition.stop();
            }

            // Stop all audio tracks
            mediaRecorder.stream.getTracks().forEach(track => track.stop());

            $('#status').text('Recording stopped. You can now submit or cancel.');
            $('#stopBtn').removeClass('pulse');
        }
    }

    // Function to toggle mute
    function toggleMute() {
        if (mediaRecorder && mediaRecorder.stream) {
            const audioTracks = mediaRecorder.stream.getAudioTracks();

            if (audioTracks.length > 0) {
                isMuted = !isMuted;
                audioTracks[0].enabled = !isMuted;

                if (isMuted) {
                    $('#muteBtn').html('<i class="fa-solid fa-microphone"></i> <span>Unmute</span>');
                    $('#status').text('Microphone is muted');
                } else {
                    $('#muteBtn').html('<i class="fa-solid fa-microphone-slash"></i> <span>Mute</span>');
                    $('#status').text('Microphone is unmuted');
                }
            }
        }
    }

    // Function to start timer
    function startTimer() {
        seconds = 0;
        timerInterval = setInterval(function () {
            seconds++;
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            $('#timer').text(
                (minutes < 10 ? '0' : '') + minutes + ':' +
                (remainingSeconds < 10 ? '0' : '') + remainingSeconds
            );
        }, 1000);
    }

    // Function to cancel recording
    function cancelRecording() {
        if (isRecording) {
            stopRecording();
        }

        $("#dropArea").show();
        $("#recordingSection").hide();

        
        isMuted = false;

        // Clear audio chunks
        audioChunks = [];
    }
    // Function to submit recording
    function submitRecording() {
        if (isRecording) {
            stopRecording();
        }

        const transcript = $('#transcript').val();

        if (transcript.trim() === '') {
            $('#status').text('No transcript to submit. Please record something first.');
            return;
        }

        // In a real application, you would send the audio and transcript to a server
        $('#status').html('Recording submitted successfully!<br>Transcript: ' + transcript.substring(0, 100) + '...');

        // Reset UI after a delay
        setTimeout(function () {
            $('#transcript').val('');
            $('#timer').text('00:00');
            isMuted = false;
            audioChunks = [];
        }, 3000);
    }
});