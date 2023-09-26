export default class Aim extends PIXI.Container {
    constructor(scene, x, y, width, height) {
        super(scene, x, y)

        this.name = 'Aim'
        this.width = width
        this.height = height
        this.visible = false

        // const aimBackground = new PIXI.Graphics()
        // aimBackground.beginFill(0x717171)
        // aimBackground.drawRect(0, 0, width, height)
        // aimBackground.endFill()
        // this.addChild(aimBackground)

        const aimSprite = PIXI.Sprite.from('aim')
        aimSprite.anchor.set(0.5)
        this.addChild(aimSprite)

        this.aimWidth = aimSprite.width
        this.aimHeight = aimSprite.height
        this.aimX = aimSprite.x
        this.aimY = aimSprite.y
    }

    async showAim(holePosition) {
        const aimPos = {
            x: Math.random() * (this.width - this.aimWidth / 2),
            y: Math.random() * (this.height - this.aimHeight / 2)
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