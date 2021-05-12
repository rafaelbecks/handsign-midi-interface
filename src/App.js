import { useEffect, useState } from 'react'

import './App.css'
import { gestureStrings, getNotesOfChord, getCurrentChords } from './musicHandler'
import { initCamera, config } from './video'
import { drawHand } from './canvasUtils'
import { initMidi, sendMidiEvent, stopAllMidiEvents } from './midi'
import Layout from './ui/Layout'

let currentNotes
let mainLoop

window.midiConfig = {
  globalCurrentKey: 'C',
  octave: 3,
  tonalMode: 'major',
  chordMode: '7TH',
  velocity: 0.5
}

function App () {
  const [errorMode, setErrorMode] = useState(false)
  const [availableMidi, setAvailableMidi] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentKey, setCurrentKey] = useState('C')
  const [currentMidi, setCurrentMidi] = useState('-1')
  const [currentEvent, setCurrentEvent] = useState(null)
  const [octave, setOctave] = useState(3)
  const [tonalMode, setTonalMode] = useState('major')
  const [chordMode, setChordMode] = useState('7TH')
  const [velocity, setVelocity] = useState(0.5)

  useEffect(async () => {
    try {
      const midiControllers = await initMidi()
      setAvailableMidi(midiControllers)

      initCamera(
        config.video.width, config.video.height, config.video.fps
      ).then(video => {
        video.play()
        video.addEventListener('loadeddata', event => {
          console.log('Camera is ready')
        })
      })

      const canvas = document.querySelector('#pose-canvas')
      canvas.width = 298
      canvas.height = 284
      console.log('Canvas initialized')
    } catch (error) {
      setErrorMode(true)
    }
  }, [])

  const onSelectMidi = (e) => {
    if (mainLoop) {
      clearTimeout(mainLoop)
    }
    setIsLoading(true)
    main(e.target.value)
    setCurrentMidi(e.target.value)
  }

  let chordResult

  const main = async (midiController) => {
    const video = document.querySelector('#pose-video')
    const canvas = document.querySelector('#pose-canvas')
    const ctx = canvas.getContext('2d')

    chordResult = ''

    const knownGestures = [
      window.fp.Gestures.B,
      window.fp.Gestures.A,
      window.fp.Gestures.I,
      window.fp.Gestures.H,
      window.fp.Gestures.V,
      window.fp.Gestures.ThumbsDown,
      window.fp.Gestures.L
    // window.fp.Gestures.GermanOne,
    ]

    const GE = new window.fp.GestureEstimator(knownGestures)

    const model = await window.handpose.load()

    const { midiConfig } = global

    const estimateHands = async () => {
    // clear canvas overlay
      ctx.clearRect(0, 0, config.video.width, config.video.height)
      chordResult = ''
      const predictions = await model.estimateHands(video, true)

      for (let i = 0; i < predictions.length; i++) {
        drawHand(predictions, ctx)

        const est = GE.estimate(predictions[i].landmarks, 7.5)
        if (est.gestures.length > 0) {
        // find gesture with highest confidence
          const result = est.gestures.reduce((p, c) => {
            return (p.confidence > c.confidence) ? p : c
          })
          const chordIndex = gestureStrings.indexOf(result.name)
          chordResult = getCurrentChords(midiConfig.globalCurrentKey, midiConfig.tonalMode)[chordIndex]
          const notesToSend = getNotesOfChord(chordResult, midiConfig.octave, midiConfig.chordMode)
          setCurrentEvent(chordIndex)
          sendMidiEvent(notesToSend, velocity, midiController)
          currentNotes = notesToSend
        }
      }
      mainLoop = setTimeout(() => { estimateHands() }, 1000 / config.video.fps)
    }

    setInterval(() => {
      if (chordResult === '') {
        stopAllMidiEvents(currentNotes, midiController)
      }
    }, 500)

    estimateHands()
    console.log('Starting predictions')
    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  window.midiConfig.octave = octave
  window.midiConfig.tonalMode = tonalMode
  window.midiConfig.chordMode = chordMode

  return (
    <div className='App'>
      <Layout
        errorMode={errorMode}
        availableMidi={availableMidi}
        onSelectMidi={onSelectMidi}
        currentMidi={currentMidi}
        isLoading={isLoading}
        currentKey={currentKey}
        setCurrentKey={setCurrentKey}
        currentChords={getCurrentChords(currentKey, tonalMode)}
        currentEvent={currentEvent}
        setOctave={setOctave}
        octave={octave}
        tonalMode={tonalMode}
        setTonalMode={setTonalMode}
        chordMode={chordMode}
        setChordMode={setChordMode}
        velocity={velocity}
        setVelocity={setVelocity}
      />
      <video id='pose-video' className='layer' style={{ display: 'none' }} playsInline />
    </div>
  )
}

export default App
