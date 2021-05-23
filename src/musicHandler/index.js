import { Key, Chord } from '@tonaljs/tonal'

const gestureStrings = [
  'b',
  'a',
  'i',
  'h',
  'v',
  'thumbs_down',
  'l'
  // 'german_one',
  // 'thumbs_down'
]

const fifthCircle = [
  'C', 'G', 'D', 'A', 'E', 'B', 'Gb', 'Db', 'Ab', 'Eb', 'Bb', 'F'
]

const minorModes = {
  har: 'harmonic',
  mel: 'melodic',
  nat: 'natural'
}

const getKeyData = (key, tonalMode) => {
  if (tonalMode === 'minor') {
    const { minorRelative } = Key.majorKey(key)
    return Key.minorKey(minorRelative)
  }

  return Key.majorKey(key)
}

const getNotesOfChord = (chord, octave, chordMode) => {
  const { tonic, notes } = Chord.get(chord)
  const { midiConfig: { inversionMode }} = window

  const rootNote = inversionMode === 'F' ? notes[0] : notes[Number(inversionMode)]

  const notesToReturn = Chord.getChord(chord.replace(tonic, ''), `${tonic}${octave}`, `${rootNote}${octave}`).notes
  return chordMode === '7TH' ? notesToReturn : notesToReturn.slice(0, 3)
}

const getCurrentChords = (currentKey, tonalMode, harmonicMode) => {
  if (tonalMode === 'major') { return getKeyData(currentKey, tonalMode).chords }

  return getKeyData(currentKey, tonalMode)[harmonicMode].chords
}

export { gestureStrings, fifthCircle, getKeyData, getNotesOfChord, getCurrentChords, minorModes }
