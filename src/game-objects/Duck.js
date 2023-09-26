import { Manager } from "../Manager.js"

export default class Duck extends PIXI.Container {
    width
    height
    duckSprite
    hole

    constructor(scene, x, y, width, height) {
        super()

        //const duckSprite = PIXI.Sprite.from('duck')
        this.duckSprite = new PIXI.SimplePlane(PIXI.Texture.from('duck'), 2, 2)
        this.duckSprite.x = 0
        this.duckSprite.y = 0
        this.addChild(this.duckSprite)

        this.x = x
        this.y = y
        this.width = width
        this.height = height

        const billetHoleSprite = PIXI.Sprite.from('bullet_hole')
        billetHoleSprite.anchor.set(0.5)
        billetHoleSprite.visible = false
        this.addChild(billetHoleSprite)

        this.hole = this.children[1]
        this.holeMargin = this.hole.width / 2
    }

    setHolePosition(localHolePos) {
        this.hole.x = localHolePos.x
        this.hole.y = localHolePos.y
    }

    shootDuck() {
        //this.hole.visible = true

        this.duckFallAnimation()
    }

    resetDuck() {
        this.hole.visible = false

        const buffer = this.duckSprite.geometry.getBuffer('aVertexPosition')
        buffer.data[0] = 0
        buffer.data[1] = 0
        buffer.data[2] = this.width
        buffer.data[3] = 0

        this.visible = true
    }

    duckFallAnimation() {
        const buffer = this.duckSprite.geometry.getBuffer('aVertexPosition')

        const vertexFrom = {
            topLeftX: buffer.data[0],
            topRightX: buffer.data[2],
            topLeftY: 0,
            topRightY: 0
        }
        const vertexTo = {
            topLeftX: this.width / 2 - 40,
            topRightX: this.width / 2 + 40,
            topLeftY: this.height,
            topRightY: this.height
        }

        const duckFallAnim = new TWEEN.Tween(vertexFrom)
            .to(vertexTo, 800)
            .easing(TWEEN.Easing.Back.InOut)
            .onUpdate(() => {
                buffer.data[0] = vertexFrom.topLeftX
                buffer.data[1] = vertexFrom.topLeftY
                buffer.data[2] = vertexFrom.topRightX
                buffer.data[3] = vertexFrom.topRightY
            })
            .onComplete(() => {
                this.visible = false
            })
            .start()
    }


}