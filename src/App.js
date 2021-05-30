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
  velocity: 1.5,
  harmonicMode: 'natural',
  editableStep: null,
  sequencerState: 'STOP',
  currentMidi: null,
  inversionMode: 'F'
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
  const [velocity, setVelocity] = useState(1.5)
  const [harmonicMode, setHarmonicMode] = useState('natural')
  const [savedStep, setSavedStep] = useState(null)
  const [inversionMode, setInversionMode] = useState('F')

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
          initHandDetection()
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
    setCurrentMidi(e.target.value)
    window.midiConfig.currentMidi = e.target.value
  }

  let chordResult

  const initHandDetection = async () => {
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
          chordResult = getCurrentChords(midiConfig.globalCurrentKey, midiConfig.tonalMode, midiConfig.harmonicMode)[chordIndex]
          const notesToSend = getNotesOfChord(chordResult, midiConfig.octave, midiConfig.chordMode)

          const midiController = midiConfig.currentMidi

          if (midiController !== '-1') {
            if (midiConfig.sequencerState === 'STOP' || midiConfig.sequencerState === 'PLAY') {
              setCurrentEvent(chordIndex)
              sendMidiEvent(notesToSend, midiConfig.velocity, midiController)
            }

            if (midiConfig.sequencerState === 'EDIT') {
              setSavedStep(chordResult)
              sendMidiEvent(notesToSend, midiConfig.velocity, midiController, 2000)
            }
          }
        }
      }
      setTimeout(() => { estimateHands() }, 1000 / config.video.fps)
    }

    setInterval(() => {
      if (chordResult === '' && midiConfig.sequencerState !== 'PLAY') {
        stopAllMidiEvents(window.midiConfig.currentMidi)
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
  window.midiConfig.harmonicMode = harmonicMode
  window.midiConfig.velocity = velocity
  window.midiConfig.currentMidi = currentMidi
  window.midiConfig.inversionMode = inversionMode

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
        currentChords={getCurrentChords(currentKey, tonalMode, harmonicMode)}
        currentEvent={currentEvent}
        setOctave={setOctave}
        octave={octave}
        tonalMode={tonalMode}
        setTonalMode={setTonalMode}
        chordMode={chordMode}
        setChordMode={setChordMode}
        velocity={velocity}
        setVelocity={setVelocity}
        harmonicMode={harmonicMode}
        setHarmonicMode={setHarmonicMode}
        savedStep={savedStep}
        setCurrentEvent={setCurrentEvent}
        setInversionMode={setInversionMode}
      />
      <video id='pose-video' className='layer' style={{ display: 'none' }} playsInline />
    </div>
  )
}

export default App
