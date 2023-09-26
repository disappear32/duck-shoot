import * as PIXI from '/lib/pixi.min.js'

import { Manager } from './Manager.js'
import { LoaderScene } from './scenes/LoaderScene.js'

Manager.initialize(1080, 1920, 0x6495ed)
Manager.changeScene(new LoaderScene())





