
const initCamera = async (width, height, fps) => {
  const constraints = {
    audio: false,
    video: {
      facingMode: 'user',
      width: width,
      height: height,
      frameRate: { max: fps }
    }
  }

  const video = document.querySelector('#pose-video')
  video.width = width
  video.height = height
  const stream = await navigator.mediaDevices.getUserMedia(constraints)
  video.srcObject = stream

  return new Promise(resolve => {
    video.onloadedmetadata = () => { resolve(video) }
  })
}

const config = {
  video: { width: 298, height: 284, fps: 30 }
}

export { config, initCamera }
