import { useEffect, useState } from 'react'

import './App.css'
import { getKeyData, gestureStrings, getNotesOfChord } from './musicHandler'
import { initCamera, config } from './video'
import { drawHand } from './canvasUtils'
import { initMidi, sendMidiEvent, stopAllMidiEvents } from './midi'
import Layout from './ui/Layout'

let currentNotes
let mainLoop

function App () {
  const [errorMode, setErrorMode] = useState(false)
  const [availableMidi, setAvailableMidi] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentKey, setCurrentKey] = useState('C')
  const [currentMidi, setCurrentMidi] = useState('-1')
  const [currentEvent, setCurrentEvent] = useState(null)
  const [octave, setOctave] = useState(3)

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
    window.globalCurrentKey = 'C'

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
          const notesToSend = getNotesOfChord(getKeyData(window.globalCurrentKey).chords[chordIndex], octave)
          chordResult = getKeyData(window.globalCurrentKey).chords[chordIndex]
          setCurrentEvent(chordIndex)
          sendMidiEvent(notesToSend, midiController)
          currentNotes = notesToSend
        }
      }
      mainLoop = setTimeout(() => { estimateHands() }, 1000 / config.video.fps)
    }

    setInterval(() => {
      if (chordResult === '') {
        stopAllMidiEvents(currentNotes, midiController)
      }
    }, 3000)

    estimateHands()
    console.log('Starting predictions')
    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }
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
        currentChords={getKeyData(currentKey).chords}
        currentEvent={currentEvent}
        setOctave={setOctave}
        octave={octave}
      />
      <video id='pose-video' className='layer' style={{ display: 'none' }} playsInline />
    </div>
  )
}

export default App
