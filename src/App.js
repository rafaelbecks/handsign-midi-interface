import { useEffect, useState } from 'react'

import './App.css'
import { fifthCircle, getKeyData, gestureStrings, getNotesOfChord } from './musicHandler'
import { initCamera, config } from './video'
import { initMidi, stop, sendMidiEvent, stopAllMidiEvents } from './midi'

let currentNotes
const landmarkColors = {
  thumb: 'red',
  indexFinger: 'blue',
  middleFinger: 'yellow',
  ringFinger: 'green',
  pinky: 'pink',
  palmBase: 'white'
}

function drawPoint (ctx, x, y, r, color) {
  ctx.beginPath()
  ctx.arc(x, y, r, 0, 2 * Math.PI)
  ctx.fillStyle = color
  ctx.fill()
}

function App () {
  const [errorMode, setErrorMode] = useState(false)
  const [availableMidi, setAvailableMidi] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentKey, setCurrentKey] = useState('C')

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
      canvas.width = config.video.width
      canvas.height = config.video.height
      console.log('Canvas initialized')
    } catch (error) {
      setErrorMode(true)
    }
  }, [])

  const onSelectMidi = (e) => {
    setIsLoading(true)
    main(e.target.value)
  }

  const main = async (midiController) => {
    const video = document.querySelector('#pose-video')
    const canvas = document.querySelector('#pose-canvas')
    const ctx = canvas.getContext('2d')

    const resultLayer = document.querySelector('#pose-result')
    window.globalCurrentKey = 'C'

    const knownGestures = [
      window.fp.Gestures.B,
      window.fp.Gestures.A,
      window.fp.Gestures.I,
      window.fp.Gestures.H,
      window.fp.Gestures.V,
      window.fp.Gestures.M,
      window.fp.Gestures.L
    // window.fp.Gestures.GermanOne,
    // window.fp.Gestures.ThumbsDown
    ]

    const GE = new window.fp.GestureEstimator(knownGestures)

    const model = await window.handpose.load()
    console.log('Handpose model loaded')

    const estimateHands = async () => {
    // clear canvas overlay
      ctx.clearRect(0, 0, config.video.width, config.video.height)
      resultLayer.innerText = ''

      const predictions = await model.estimateHands(video, true)

      for (let i = 0; i < predictions.length; i++) {
      // draw colored dots at each predicted joint position
        for (const part in predictions[i].annotations) {
          for (const point of predictions[i].annotations[part]) {
            drawPoint(ctx, point[0], point[1], 3, landmarkColors[part])
          }
        }

        const est = GE.estimate(predictions[i].landmarks, 7.5)
        if (est.gestures.length > 0) {
        // find gesture with highest confidence
          const result = est.gestures.reduce((p, c) => {
            return (p.confidence > c.confidence) ? p : c
          })

          const chordIndex = gestureStrings.indexOf(result.name)

          const notesToSend = getNotesOfChord(getKeyData(window.globalCurrentKey).chords[chordIndex])
          console.log(`%c ${notesToSend} sending event`, 'background: #222; color: #bada55')
          sendMidiEvent(notesToSend, midiController)
          currentNotes = notesToSend
          resultLayer.innerText = getKeyData(window.globalCurrentKey).chords[chordIndex]
        }
      }

      setTimeout(() => { estimateHands() }, 1000 / config.video.fps)
    }

    setInterval(() => {
      if (resultLayer.innerText === '') {
        stopAllMidiEvents(currentNotes, midiController)
      }
    }, 1000)

    estimateHands()
    console.log('Starting predictions')
    setIsLoading(false)
  }

  return (
    <div className='App'>
      <body className='App-header'>
        <div id='video-container'>
          <video id='pose-video' className='layer' playsInline />
          <canvas id='pose-canvas' className='layer' />
          <div id='pose-result' className='layer' />
        </div>
        {errorMode && (
          <p>There is not any midi device connected</p>
        )}
        <h1>multivac controller</h1>
        <p>{isLoading ? 'Loading...' : 'Ready to play'}</p>
        <select onChange={onSelectMidi}>
          <option value='-1'>Select midi output </option>
          {availableMidi.map(({ id, name }, index) => (<option value={index} key={id}>{name}</option>))}
        </select>
        <button onClick={stop}>Stop</button>

        <p> Fifth circle </p>

        {fifthCircle.map((key) => {
          const keyData = getKeyData(key)
          return (
            <li
              style={currentKey === key ? { color: 'blue' } : {}}
              onClick={
            () => {
              setCurrentKey(keyData.tonic)
              window.globalCurrentKey = keyData.tonic
            }
          } key={key}
            >{key}: | Minor: {keyData.minorRelative}
            </li>
          )
        }
        )}
        <h1>Chords</h1>
        {getKeyData(currentKey).chords.map(chord => (
          <li key={chord}>{chord}</li>
        ))}

      </body>
    </div>
  )
}

export default App
