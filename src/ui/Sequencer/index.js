import { useState, useEffect } from 'react'
import { Container, Step } from './styles'
import { Led } from '../Leds/styles'

import { getNotesOfChord } from '../../musicHandler'
import { sendMidiEvent, stopAllMidiEvents } from '../../midi'

const Sequencer = (props) => {
  // const [steps, setSteps] = useState(['Cm', '', '', '', 'Gm', '', '', '', 'Gm', '', '', 'Bb', '', '', '', ''])
  const [steps, setSteps] = useState([])
  const [playingStep, setPlayingStep] = useState(null)
  const [editableStep, setEditableStep] = useState(null)

  useEffect(() => {
    // generating blank spaces for sequencer
    if (props.steps !== steps.length) {
      const newSteps = props.steps - steps.length > 0
        ? [...steps, ...Array.from(
            Array.from(Array(props.steps - steps.length))
          )]
        : steps.splice(0, steps.length + props.steps - steps.length)
      setSteps(newSteps)
    }

    let currentStep = 0
    let sequencerTimer

    switch (props.sequencerState) {
      case 'STOP':
        clearInterval(sequencerTimer)
        currentStep = 0
        setPlayingStep(null)
        break
      case 'PLAY':
        return startSequencer(currentStep, sequencerTimer)
      default:
        break
    }

    if (props.savedStep !== null && editableStep >=0) {
      const localSteps = steps
      localSteps[editableStep] = props.savedStep
      setSteps(localSteps)
      setEditableStep(null)
    }
  }, [props.steps, props.sequencerState, props.savedStep])

  const startSequencer = (currentStep, sequencerTimer) => {
    setEditableStep(null)
    sequencerTimer = setInterval(() => {
      if (currentStep === steps.length) { currentStep = 0 }
      setPlayingStep(currentStep)
      if (steps[currentStep]) {

        sendMidiEvent(
          getNotesOfChord(steps[currentStep], global.midiConfig.octave, global.midiConfig.chordMode),
          global.midiConfig.velocity,
          props.currentMidi
        )

        const index = props.currentChords.indexOf(steps[currentStep])
        props.setCurrentEvent(index)
      }

      const previousStep = currentStep - 1 < 0 ? steps.length - 1 : currentStep - 1

      if (steps[previousStep] === undefined) {
        stopAllMidiEvents(props.currentMidi)
      }
      currentStep++
    }, (60 / props.bpm) * 1000)
    return () => clearInterval(sequencerTimer)
  }

  const selectStepToEdit = (step) => {
    if (props.sequencerState === 'EDIT') {
      setEditableStep(step)
      window.midiConfig.editableStep = step
    }
  }

  return (
    <Container>
      <ul>
        {Array.from(Array(props.steps).keys()).map(n =>
        <div>
          <Step
            className={n === playingStep && 'selectedStep'} key={n} onClick={
            () => selectStepToEdit(n)
          }
          >
            <span className={editableStep === n && 'markedNumber'}>
              {n + 1}
            </span>
          </Step>
          <Led
          onClick={
            () => {
              const localSteps = steps
              localSteps[n] = undefined
              setSteps(localSteps)
              setEditableStep(null)
            }
          }
          style={{
             margin: '8px 32px',
             width: '12px',
             height: '12px',
          }} className={`${n === playingStep ? 'ledOn' : 'ledOff'} ${steps[n] ? 'minorOn' : ''}`} />
        </div>

        )}
      </ul>
    </Container>
  )
}

export default Sequencer
