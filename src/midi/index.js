import WebMidi from 'webmidi'

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

const sendMidiEvent = (chord, midiController) => {
  if (chord) {
    console.log(`%c sending chord ${chord}`, 'background: #222; color: #bada55')
    WebMidi.outputs[midiController].playNote(chord.map(note => note), 1, { velocity: 0.25 })

    isStopped = false
    firstSound = true
  }
}

const stopAllMidiEvents = (chord, midiController) => {
  if (!isStopped && firstSound) {
    console.log('%c stop chord', 'background: #222; color: #bada55')
    WebMidi.outputs[midiController].stopNote(Object.values(chord.map(note => note)).flat(), 1)
    isStopped = true
  }
}

const stop = () => {
  const video = document.querySelector('#pose-video')
  video.pause()
}

export { initMidi, sendMidiEvent, stopAllMidiEvents, stop }
