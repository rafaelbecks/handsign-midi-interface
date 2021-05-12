import { useState, useEffect, useRef, Fragment } from 'react'
import { ReactSVG } from 'react-svg'
import { Knob } from 'react-rotary-knob'
import * as skins from 'react-rotary-knob-skin-pack'

import circlesTop from '../../assets/screw-circles-top.svg'
import circlesBottom from '../../assets/screw-circles-bottom.svg'
import dodecahedron from '../../assets/dodecahedron.png'
import oscilloscope from '../../assets/oscilloscope.png'
import greenScreen from '../../assets/green-screen.mov'

import Sequencer from '../Sequencer'
import SliderSwitch from '../../components/SliderSwitch'
import NumericControl from '../../components/NumericControl'
import Leds from '../Leds'

import {
  DeviceLayout,
  Container,
  RightCircleTop,
  LeftCircleTop,
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
    <LeftCircleTop src={circlesTop} />
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
  setVelocity
}) => {
  const midiSelect = useRef(null)
  const [sequencerSteps, setSecuencerSteps] = useState(8)
  const [handSignIcons, setHandSignIcons] = useState([])

  useEffect(async () => {
    const svgs = await getHandSigns()
    setHandSignIcons(svgs)
  }, [])

  return (
    <Container>
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
                  <span className={index === currentEvent ? 'chordName chordActive' : ' chordName chordInactive'}>{chordMode === '7TH' ? currentChords[index] : currentChords[index].replace('7', '').replace('maj', '').replace('Maj', '')}</span>
                </ChordContainer>
              ))}
            </HandSignContainer>
            <SmallSeparator />
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
          </DeviceSection>
          {/* RECOGNITION SECTION */}
          <MiddleSection>
            <FifthCircleSection>
              <img src={dodecahedron} />
              <OscilloscopeScreen src={greenScreen} muted loop autoPlay noControls />
              <GridScreen src={oscilloscope} />
              <ScreenMessage>{
              currentMidi === '-1'
                ? 'SELECT DEVICE TO START'
                : currentMidi !== '-1' && isLoading ? 'LOADING MODELS...' : ''
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
                console.log(midiSelect)
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
                    min={0}
                    max={1} value={velocity}
                    skin={skins.s13}
                  />
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

            <Row>
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
            </Row>
            <Separator />
            <h2>SEQUENCER</h2>
            <Row>
              <Control>
                <h3>MODE</h3>
                <SliderSwitch
                  onChange={(value) => console.log(value)}
                  values={['STOP', 'EDIT', 'PLAY']}
                />
              </Control>
              <Control style={{ marginRight: '10px' }}>
                <h3>BPM / STEPS</h3>
                <GreenScreenContainer>
                  <NumericControl
                    minValue={0} maxValue={500} initialValue={120} onChange={(value) => console.log(value)}
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
        <Sequencer steps={sequencerSteps} />
      </DeviceLayout>
    </Container>

  )
}

export default Layout
