import { TextureLoader, SRGBColorSpace } from 'three'

const loader = new TextureLoader()
export let controlsTextures = null

export function initControlsTextures() {
  controlsTextures = {
    leftControl: {
      normal: loader.load('textures/controls/leftControl.jpg'),
      hover: loader.load('textures/controls/leftControlHover.jpg'),
    },
    rightControl: {
      normal: loader.load('textures/controls/rightControl.jpg'),
      hover: loader.load('textures/controls/rightControlHover.jpg'),
    },
    centerControl: {
      normal: loader.load('textures/controls/centerControl.jpg'),
      hover: loader.load('textures/controls/centerControlHover.jpg'),
    },
    menuControl: {
      normal: loader.load('textures/controls/menuControl.jpg'),
      hover: loader.load('textures/controls/menuControl.jpg'),
    },
    copyControl: {
      normal: loader.load('textures/controls/menuControl.jpg'),
      hover: loader.load('textures/controls/menuControl.jpg'),
    },
    clone: {
      normal: loader.load('textures/controls/menuControl.jpg'),
      hover: loader.load('textures/controls/menuControl.jpg'),
    },
    inSector: {
      normal: loader.load('textures/controls/InCenterControl.jpg'),
      hover: loader.load('textures/controls/InCenterControlHover.jpg'),
    },
  }

  Object.values(controlsTextures).forEach(stateSet => {
    Object.values(stateSet).forEach(tex => {
      tex.colorSpace = SRGBColorSpace
      tex.transparent = true
    })
  })
}
  
   
  