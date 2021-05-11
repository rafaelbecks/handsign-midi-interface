import {
  Led,
  Note
} from './styles'

const Leds = ({ setCurrentKey, currentKey, tonalMode }) => {
  const onSelectNote = (note) => {
    setCurrentKey(note)
    window.midiConfig.globalCurrentKey = note
  }

  return (
    <>
      {/* MAJOR */}
      <Led
        onClick={() => {
          onSelectNote('C')
        }} className={currentKey === 'C' && tonalMode === 'major' ? 'ledOn' : 'ledOff'} style={{ right: '226px', top: '14px' }}
      />
      <Note style={{ right: '230px', top: '37px' }}>C</Note>
      <Led
        onClick={() => {
          onSelectNote('G')
        }} className={currentKey === 'G' && tonalMode === 'major' ? 'ledOn' : 'ledOff'} style={{ right: '108px', top: '48px' }}
      />
      <Note style={{ right: '119px', top: '68px' }}>G</Note>
      <Led
        onClick={() => {
          onSelectNote('D')
        }} className={currentKey === 'D' && tonalMode === 'major' ? 'ledOn' : 'ledOff'} style={{ right: '20px', top: '134px' }}
      />
      <Note style={{ right: '42px', top: '145px' }}>D</Note>
      <Led
        onClick={() => {
          onSelectNote('A')
        }} className={currentKey === 'A' && tonalMode === 'major' ? 'ledOn' : 'ledOff'} style={{ right: '-9px', top: '252px' }}
      />
      <Note style={{ right: '14px', top: '252px' }}>A</Note>
      <Led
        onClick={() => {
          onSelectNote('E')
        }} className={currentKey === 'E' && tonalMode === 'major' ? 'ledOn' : 'ledOff'} style={{ right: '22px', top: '371px' }}
      />
      <Note style={{ right: '44px', top: '364px' }}>E</Note>
      <Led
        onClick={() => {
          onSelectNote('B')
        }} className={currentKey === 'B' && tonalMode === 'major' ? 'ledOn' : 'ledOff'} style={{ right: '108px', bottom: '48px' }}
      />
      <Note style={{ right: '113px', bottom: '68px' }}>B</Note>
      <Led
        onClick={() => {
          onSelectNote('Gb')
        }} className={currentKey === 'Gb' && tonalMode === 'major' ? 'ledOn' : 'ledOff'} style={{ right: '226px', bottom: '14px' }}
      />
      <Note style={{ right: '231px', bottom: '37px' }}>Gb</Note>
      <Led
        onClick={() => {
          onSelectNote('Db')
        }} className={currentKey === 'Db' && tonalMode === 'major' ? 'ledOn' : 'ledOff'} style={{ left: '108px', bottom: '48px' }}
      />
      <Note style={{ left: '113px', bottom: '68px' }}>Db</Note>
      <Led
        onClick={() => {
          onSelectNote('Ab')
        }} className={currentKey === 'Ab' && tonalMode === 'major' ? 'ledOn' : 'ledOff'} style={{ left: '22px', top: '371px' }}
      />
      <Note style={{ left: '44px', top: '364px' }}>Ab</Note>
      <Led
        onClick={() => {
          onSelectNote('Eb')
        }} className={currentKey === 'Eb' && tonalMode === 'major' ? 'ledOn' : 'ledOff'} style={{ left: '-9px', top: '252px' }}
      />
      <Note style={{ left: '14px', top: '252px' }}>Eb</Note>
      <Led
        onClick={() => {
          onSelectNote('Bb')
        }} className={currentKey === 'Bb' && tonalMode === 'major' ? 'ledOn' : 'ledOff'} style={{ left: '20px', top: '134px' }}
      />
      <Note style={{ left: '42px', top: '145px' }}>Bb</Note>
      <Led
        onClick={() => {
          onSelectNote('F')
        }} className={currentKey === 'F' && tonalMode === 'major' ? 'ledOn' : 'ledOff'} style={{ left: '108px', top: '48px' }}
      />
      <Note style={{ left: '119px', top: '68px' }}>F</Note>
      {/* MINOR */}
      <Led
        onClick={() => {
          onSelectNote('C')
        }} className={currentKey === 'C' && tonalMode === 'minor' ? 'minorOn' : 'minorOff'}
        style={{ right: '226px', top: '67px' }}
      />
      <Note style={{ right: '230px', top: '91px' }}>A</Note>
      <Led
        onClick={() => {
          onSelectNote('G')
        }} className={currentKey === 'G' && tonalMode === 'minor' ? 'minorOn' : 'minorOff'}
        style={{ right: '131px', top: '96px' }}
      />
      <Note style={{ right: '149px', top: '119px' }}>E</Note>
      <Led
        onClick={() => {
          onSelectNote('D')
        }} className={currentKey === 'D' && tonalMode === 'minor' ? 'minorOn' : 'minorOff'}
        style={{ right: '72px', top: '153px' }}
      />
      <Note style={{ right: '96px', top: '165px' }}>B</Note>
      <Led
        onClick={() => {
          onSelectNote('A')
        }} className={currentKey === 'A' && tonalMode === 'minor' ? 'minorOn' : 'minorOff'}
        style={{ right: '37px', top: '251px' }}
      />
      <Note style={{ right: '60px', top: '252px' }}>F#</Note>

      <Led
        onClick={() => {
          onSelectNote('E')
        }} className={currentKey === 'E' && tonalMode === 'minor' ? 'minorOn' : 'minorOff'}
        style={{ right: '72px', bottom: '153px' }}
      />
      <Note style={{ right: '96px', bottom: '165px' }}>C#</Note>

      <Led
        onClick={() => {
          onSelectNote('B')
        }} className={currentKey === 'B' && tonalMode === 'minor' ? 'minorOn' : 'minorOff'}
        style={{ right: '131px', bottom: '96px' }}
      />
      <Note style={{ right: '149px', bottom: '119px' }}>G#</Note>

      <Led
        onClick={() => {
          onSelectNote('Gb')
        }} className={currentKey === 'Gb' && tonalMode === 'minor' ? 'minorOn' : 'minorOff'}
        style={{ right: '226px', bottom: '67px' }}
      />
      <Note style={{ right: '230px', bottom: '91px' }}>Eb</Note>

      <Led
        onClick={() => {
          onSelectNote('Db')
        }} className={currentKey === 'Db' && tonalMode === 'minor' ? 'minorOn' : 'minorOff'}
        style={{ left: '131px', bottom: '96px' }}
      />
      <Note style={{ left: '149px', bottom: '119px' }}>Bb</Note>

      <Led
        onClick={() => {
          onSelectNote('Ab')
        }} className={currentKey === 'Ab' && tonalMode === 'minor' ? 'minorOn' : 'minorOff'}
        style={{ left: '72px', bottom: '153px' }}
      />
      <Note style={{ left: '96px', bottom: '165px' }}>F</Note>

      <Led
        onClick={() => {
          onSelectNote('Eb')
        }} className={currentKey === 'Eb' && tonalMode === 'minor' ? 'minorOn' : 'minorOff'}
        style={{ left: '37px', top: '251px' }}
      />
      <Note style={{ left: '60px', top: '252px' }}>C</Note>

      <Led
        onClick={() => {
          onSelectNote('Bb')
        }} className={currentKey === 'Bb' && tonalMode === 'minor' ? 'minorOn' : 'minorOff'}
        style={{ left: '72px', top: '153px' }}
      />
      <Note style={{ left: '96px', top: '165px' }}>G</Note>

      <Led
        onClick={() => {
          onSelectNote('F')
        }} className={currentKey === 'F' && tonalMode === 'minor' ? 'minorOn' : 'minorOff'}
        style={{ left: '131px', top: '96px' }}
      />
      <Note style={{ left: '149px', top: '119px' }}>D</Note>

    </>

  )
}

export default Leds
