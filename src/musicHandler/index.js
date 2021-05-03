import { Key, Chord } from '@tonaljs/tonal'

const gestureStrings = [
  'b',
  'a',
  'i',
  'h',
  'v',
  'm',
  'l'
  // 'german_one',
  // 'thumbs_down'
]

const fifthCircle = [
  'C', 'G', 'D', 'A', 'E', 'B', 'Gb', 'Db', 'Ab', 'Eb', 'Bb', 'F'
]

const getKeyData = (key) => {
  if (key.includes('m')) { return Key.minorKey(key) }

  return Key.majorKey(key)
}

const getNotesOfChord = (chord) => {
  return Chord.get(chord).notes
}

export { gestureStrings, fifthCircle, getKeyData, getNotesOfChord }
