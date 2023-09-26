import { Manager } from "../Manager.js"

export default class Aim extends PIXI.Container {
    constructor(scene, x, y, width, height) {
        super(scene, x, y)

        this.name = 'Aim'
        this.width = width
        this.height = height
        this.visible = false

        const aimSprite = PIXI.Sprite.from('aim')
        aimSprite.anchor.set(0.5)
        this.addChild(aimSprite)
    }

    async showAim(holePosition) {
        const aimPos = {
            x: Math.random() * (Manager.width - this.width / 2),
            y: 1480 + this.height / 2
        }

        this.x = aimPos.x
        this.y = aimPos.y
        this.visible = true

        const aimMoveAnimation = () => {
            return new Promise((resolve) => {
                return new TWEEN.Tween(aimPos)
                    .to({ x: holePosition.x, y: holePosition.y }, 1000)
                    .easing(TWEEN.Easing.Quadratic.InOut)
                    .onUpdate(() => {
                        this.x = aimPos.x
                        this.y = aimPos.y
                    })
                    .onComplete(() => {
                        resolve()
                        console.log('anim done')
                    })
                    .start()
            })
        }

        await aimMoveAnimation()
    }

    hideAim() {
        this.visible = false
    }
}