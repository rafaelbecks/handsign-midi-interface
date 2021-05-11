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

const getKeyData = (key, tonalMode) => {
  if (tonalMode === 'minor') {
    const { minorRelative } = Key.majorKey(key)
    console.log('Key.minorKey(relativeMinor)', Key.minorKey(minorRelative))

    return Key.minorKey(minorRelative)
  }

  return Key.majorKey(key)
}

const getNotesOfChord = (chord, octave, chordMode) => {
  const tonic = Chord.get(chord).tonic

  const notes = Chord.getChord(chord.replace(tonic, ''), `${tonic}${octave}`).notes
  return chordMode === '7TH' ? notes : notes.slice(0, 3)
}

const getCurrentChords = (currentKey, tonalMode) => {
  if (tonalMode === 'major') { return getKeyData(currentKey, tonalMode).chords }

  return getKeyData(currentKey, tonalMode).harmonic.chords
}

export { gestureStrings, fifthCircle, getKeyData, getNotesOfChord, getCurrentChords }
