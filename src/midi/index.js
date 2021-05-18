import WebMidi from 'webmidi'
import { Scale } from '@tonaljs/tonal'

let isStopped = true
let firstSound = false

const initMidi = async () =>
  new Promise((resolve, reject) => {
    WebMidi.enable(function (err) {
      if (err) {
        reject(err)
      }
      resolve(WebMidi.outputs)
    })
  })

const sendMidiEvent = (chord, velocity, midiController) => {
  if (chord) {
    console.log(`%c sending chord ${chord}`, 'background: #222; color: #bada55')
    WebMidi.outputs[midiController].playNote(chord.map(note => note), 1, { velocity })
    isStopped = false
    firstSound = true
  }
}

const stopAllMidiEvents = (chord, midiController) => {
  if (!isStopped && firstSound) {
    console.log(`%c stop chord ${chord}`, 'background: #222; color: #bada55')
    WebMidi.outputs[midiController].stopNote(getAllNotes3Octaves(), 1)
    isStopped = true
  }
}

const getAllNotes3Octaves = () => {
  return [
    ...Scale.get(`c${window.midiConfig.octave - 1} chromatic`).notes,
    ...Scale.get(`c${window.midiConfig.octave} chromatic`).notes,
    ...Scale.get(`c${window.midiConfig.octave + 1} chromatic`).notes

  ]
}

const stop = () => {
  const video = document.querySelector('#pose-video')
  video.pause()
}

export { initMidi, sendMidiEvent, stopAllMidiEvents, stop }
