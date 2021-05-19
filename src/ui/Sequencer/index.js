import { useState, useEffect } from 'react'
import { Container, Step } from './styles'

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
        setPlayingStep(currentStep)
        break
      case 'PLAY':
        return startSequencer(currentStep, sequencerTimer)
      default:
        break
    }

    if (props.savedStep !== null && editableStep) {
      steps[editableStep] = props.savedStep
      setEditableStep(null)
    }
  }, [props.steps, props.sequencerState, props.savedStep])

  const startSequencer = (currentStep, sequencerTimer) => {
    sequencerTimer = setInterval(() => {
      if (currentStep === steps.length) { currentStep = 0 }
      setPlayingStep(currentStep)
      console.log('steps[currentStep]', steps[currentStep])
      if (steps[currentStep]) {
        console.log('getNotesOfChord(steps[currentStep]', getNotesOfChord(steps[currentStep]))
        // TODO ADD MIDI CONTROLLER AND TRIAD MODE
        sendMidiEvent(
          getNotesOfChord(steps[currentStep], global.midiConfig.octave, '7TH'),
          global.midiConfig.velocity,
          0
        )

        const index = props.currentChords.indexOf(steps[currentStep])
        props.setCurrentEvent(index)
      }

      const previousStep = currentStep - 1 < 0 ? steps.length - 1 : currentStep - 1

      if (steps[previousStep] === undefined) {
        // TODO ADD MIDI CONTROLLER
        stopAllMidiEvents(0)
      }
      currentStep++
    }, (60 / props.bpm) * 1000)
    return () => clearInterval(sequencerTimer)
  }

  const selectStepToEdit = (step) => {
    if (props.sequencerState === 'EDIT') {
      console.log('here')
      setEditableStep(step)
      window.midiConfig.editableStep = step
    }
  }

  console.log('editableStep', editableStep)
  console.log('steps', steps)

  return (
    <Container>
      <ul>
        {Array.from(Array(props.steps).keys()).map(n =>
          <Step
            className={n === playingStep && 'selectedStep'} key={n} onClick={
            () => selectStepToEdit(n)
          }
          >
            <span className={[0, 4, 8, 12].includes(n) && 'markedNumber'}>
              {n + 1}
            </span>
          </Step>
        )}
      </ul>
    </Container>
  )
}

export default Sequencer
