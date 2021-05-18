import { useState, useEffect } from 'react'
import { Container, Step } from './styles'

import { getNotesOfChord } from '../../musicHandler'
import { sendMidiEvent, stopAllMidiEvents } from '../../midi'

const Sequencer = (props) => {
  // const [steps, setSteps] = useState(['Cm', '', '', '', 'Gm', '', '', '', 'Gm', '', '', 'Bb', '', '', '', ''])
  const [steps, setSteps] = useState(['G7', '', '', '', '', '', '', 'Cm'])
  const [playingStep, setPlayingStep] = useState(null)

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
  }, [props.steps, props.sequencerState])

  const startSequencer = (currentStep, sequencerTimer) => {
    sequencerTimer = setInterval(() => {
      if (currentStep === steps.length) { currentStep = 0 }
      setPlayingStep(currentStep)
      if (steps[currentStep] !== '') {
        sendMidiEvent(
          getNotesOfChord(steps[currentStep], window.midiConfig.octave, 'TRIAD'),
          0.5,
          0
        )
      }

      const previousStep = currentStep - 1 < 0 ? steps.length - 1 : currentStep - 1
      console.log('previousStep', previousStep)
      console.log('currentStep', currentStep)

      if (steps[previousStep]) {
        stopAllMidiEvents(
          getNotesOfChord(steps[previousStep], window.midiConfig.octave, 'TRIAD'),

          0)
      }
      currentStep++
    }, (60 / props.bpm) * 1000)
    return () => clearInterval(sequencerTimer)
  }

  return (
    <Container>
      <ul>
        {Array.from(Array(props.steps).keys()).map(n =>
          <Step className={n === playingStep && 'selectedStep'} key={n}>
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
