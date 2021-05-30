import { useState, useEffect, useRef, Fragment } from 'react'
import { ReactSVG } from 'react-svg'
import { Knob } from 'react-rotary-knob'
import * as skins from 'react-rotary-knob-skin-pack'

import circlesTop from '../../assets/screw-circles-top.svg'
import circlesBottom from '../../assets/screw-circles-bottom.svg'
import dodecahedron from '../../assets/dodecahedron.png'
import oscilloscope from '../../assets/oscilloscope.png'
import greenScreen from '../../assets/green-screen.mov'

import { minorModes } from '../../musicHandler'
import Sequencer from '../Sequencer'
import SliderSwitch from '../../components/SliderSwitch'
import NumericControl from '../../components/NumericControl'
import Leds from '../Leds'

import {
  DeviceLayout,
  RightCircleTop,
  RightCircleBottom,
  LeftCircleBottom,
  DeviceName,
  DeviceSection,
  DeviceContent,
  FifthCircleSection,
  MiddleSection,
  GreenScreen,
  Row,
  Control,
  Separator,
  GreenScreenContainer,
  HandSignContainer,
  SmallSeparator,
  OscilloscopeScreen,
  GridScreen,
  MidiSelect,
  ScreenMessage,
  ChordContainer,
  KnobContainer
} from './styles'

const Screws = () => (
  <>
    <RightCircleTop src={circlesTop} />
    <RightCircleBottom src={circlesBottom} />
    <LeftCircleBottom src={circlesBottom} />
  </>
)

const getHandSigns = async () => {
  const svgs = []
  for (let index = 0; index < 8; index++) {
    const currentSvg = await import(`../../assets/handsigns/${index + 1}.svg`)
    svgs.push(currentSvg)
  }
  return svgs
}

const Layout = ({
  onSelectMidi,
  availableMidi,
  currentMidi,
  isLoading,
  currentKey,
  setCurrentKey,
  currentChords,
  currentEvent,
  octave,
  setOctave,
  tonalMode,
  setTonalMode,
  setChordMode,
  chordMode,
  velocity,
  setVelocity,
  setHarmonicMode,
  harmonicMode,
  savedStep,
  setCurrentEvent,
  setInversionMode
}) => {
  const midiSelect = useRef(null)
  const [sequencerSteps, setSecuencerSteps] = useState(8)
  const [handSignIcons, setHandSignIcons] = useState([])
  const [bpm, setBpm] = useState(120)
  const [sequencerState, setSequencerState] = useState('STOP')

  useEffect(async () => {
    const svgs = await getHandSigns()
    setHandSignIcons(svgs)
  }, [])

  return (
    <DeviceLayout>
      <Screws />
      <DeviceName>HANDSIGN MIDI INTERFACE</DeviceName>
      <DeviceContent>
        {/* CHORDS */}
        <DeviceSection>
          <h2>SIGN GUIDE</h2>
          <HandSignContainer>
            {handSignIcons.map((svg, index) => currentChords[index] && (
              <ChordContainer key={index}>
                <ReactSVG src={svg.default} wrapper='span' className={index === currentEvent ? 'chordActive' : 'chordInactive'} />
                <span
                  className={index === currentEvent ? 'chordName chordActive' : ' chordName chordInactive'}
                >
                  {
                      chordMode === '7TH'
                        ? currentChords[index]
                        : currentChords[index].replace('7', '').replace('maj', '').replace('Maj', '')
                    }
                </span>
              </ChordContainer>
            ))}
          </HandSignContainer>
          <SmallSeparator />
          <Row>
            <Control>
              <h3>INVERSION</h3>
              <SliderSwitch
                onChange={(value) => setInversionMode(value)}
                values={chordMode === '7TH' ? ['F', '1', '2', '3'] : ['F', '1', '2']}
              />
            </Control>
            {tonalMode === 'minor' && (
              <Control>
                <h3 className='smallMargin'>MINOR</h3>
                <SliderSwitch
                  onChange={(value) => {
                    setHarmonicMode(minorModes[value])
                  }}
                  values={['nat', 'har', 'mel']}
                />
              </Control>
            )}
          </Row>

        </DeviceSection>
        {/* RECOGNITION SECTION */}
        <MiddleSection>
          <FifthCircleSection>
            <img src={dodecahedron} />
            <OscilloscopeScreen src={greenScreen} muted loop autoPlay noControls />
            <GridScreen src={oscilloscope} />
            <ScreenMessage>{
              isLoading ? 'LOADING AI MODEL...'
                : currentMidi === '-1'
                  ? 'SELECT DEVICE TO START' : ''
              }
            </ScreenMessage>
            <canvas id='pose-canvas' className='layer' />
            <Leds currentKey={currentKey} setCurrentKey={setCurrentKey} tonalMode={tonalMode} />
          </FifthCircleSection>
        </MiddleSection>
        {/* MIDI CONFIG SECTION */}
        <DeviceSection>
          <h2>MIDI CONFIG</h2>
          <h3>DEVICE</h3>
          <GreenScreen
            style={{ width: '150px' }} value={availableMidi[currentMidi] ? availableMidi[currentMidi].name : 'NO DEVICE SELECTED'} type='text' onClick={() => {
              midiSelect.current.focus()
            }}
          />
          <MidiSelect ref={midiSelect} style={{ opacity: 0 }} onChange={onSelectMidi}>
            <option value='-1'>No device selected </option>
            {availableMidi.map(({ id, name }, index) => (<option value={index} key={id}>{name}</option>))}
          </MidiSelect>
          <Row>
            <Control>
              <h3>VELOCITY</h3>
              <KnobContainer>
                <Knob
                  unlockDistance={0}
                  onChange={(val) => {
                    setVelocity(val)
                    window.midiConfig.velocity = val
                  }}
                  min={1}
                  max={3} value={velocity}
                  skin={skins.s13}
                  preciseMode={false}
                />
                <span>{Math.round(velocity * 100) / 100}</span>
              </KnobContainer>
            </Control>
            <Control>
              <h3>TONAL MODE</h3>
              <SliderSwitch
                onChange={(value) => setTonalMode(value)}
                values={['major', 'minor']}
              />
            </Control>
          </Row>
          <div
            style={{
              width: '154px',
              margin: '14px 0'
            }}
          />

          {/* <Row>
              <Control>
                <h3>PLAY MODE</h3>
                <SliderSwitch
                  onChange={(value) => console.log(value)}
                  values={['chord', 'note', 'custom']}
                />
              </Control>
              <Control>
                <h3>MIDI MODE</h3>
                <SliderSwitch
                  onChange={(value) => console.log(value)}
                  values={['channel', 'sequencer']}
                />
              </Control>
            </Row> */}
          <Row>
            <Control style={{ marginRight: '10px' }}>
              <h3 className='smallMargin'>OCTAVE</h3>
              <GreenScreenContainer>
                <NumericControl
                  width='20px'
                  minValue={1} maxValue={10} initialValue={octave}
                  onChange={(value) => setOctave(value)}
                />
              </GreenScreenContainer>
            </Control>

            <Control>
              <h3 className='smallMargin'>CHORD</h3>
              <SliderSwitch
                onChange={(value) => setChordMode(value)}
                values={['7TH', 'TRIAD']}
              />
            </Control>
          </Row>
          <Separator />
          <h2>SEQUENCER</h2>
          <Row>
            <Control>
              <h3>MODE</h3>
              <SliderSwitch
                onChange={(value) => {
                  setSequencerState(value)
                  window.midiConfig.sequencerState = value
                }}
                values={['STOP', 'EDIT', 'PLAY']}
              />
            </Control>
            <Control style={{ marginRight: '10px' }}>
              <h3>BPM / STEPS</h3>
              <GreenScreenContainer>
                <NumericControl
                  minValue={0} maxValue={500} initialValue={120} onChange={(value) => setBpm(Number(value))}
                />
                <NumericControl
                  minValue={4} maxValue={16} initialValue={8}
                  onChange={setSecuencerSteps}
                />
              </GreenScreenContainer>
            </Control>
          </Row>
        </DeviceSection>
      </DeviceContent>
      <Sequencer
        currentMidi={currentMidi}
        steps={sequencerSteps}
        bpm={bpm}
        sequencerState={sequencerState}
        savedStep={savedStep}
        setCurrentEvent={setCurrentEvent}
        currentChords={currentChords}
      />
    </DeviceLayout>
  )
}

export default Layout
