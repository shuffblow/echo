import { Audio } from 'expo-av'

// 开始录音
export const startRecording = async () => {
  await Audio.requestPermissionsAsync()
  const recording = new Audio.Recording()
  await recording.prepareToRecordAsync(
    Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
  )
  await recording.startAsync()
  return recording
}

// 停止录音
export const stopRecording = async (recording: Audio.Recording) => {
  await recording.stopAndUnloadAsync()
  const uri = recording.getURI()
  return uri
}