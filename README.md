# Handsign MIDI interface

Experimental MIDI interface. Using handsign detection to send chords using MIDI Web API to any external device. Chords construction based on circle of fifths

![](https://ex-reality.s3.amazonaws.com/screenshot.png)

## Dependencies

+ The browser must support MIDIAccess API (https://developer.mozilla.org/en-US/docs/Web/API/MIDIAccess)
+ Tensorflow model for handpose detection: https://github.com/tensorflow/tfjs-models/tree/master/handpose
+ Fingerpose library to define different hand signs: https://github.com/andypotato/fingerpose
+ Tonal.js: To construct all chords data: https://github.com/tonaljs/tonal


## TO DO

+ Add MIDI Configs parameters to MIDI event manager
+ Allow selecting midi channel
+ Build sequencer

## Running

Connect a MIDI device, this is mandatory

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

