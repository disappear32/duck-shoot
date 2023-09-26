import { Manager } from "../Manager.js"

export default class Duck extends PIXI.Container {
    width
    height
    hole

    constructor(scene, x, y, width, height) {
        super()

        const duckSprite = PIXI.Sprite.from('duck')
        duckSprite.x = 0
        duckSprite.y = 0
        this.addChild(duckSprite)

        this.x = x
        this.y = y
        this.width = width
        this.height = height

        const billetHoleSprite = PIXI.Sprite.from('bullet_hole')
        billetHoleSprite.anchor.set(0.5)
        billetHoleSprite.visible = false
        this.addChild(billetHoleSprite)

        this.hole = this.children[1]

        console.log(this.position)
    }

    setHolePosition(localHolePos) {
        this.hole.x = localHolePos.x
        this.hole.y = localHolePos.y
    }

    shootDuck() {
        this.hole.visible = true
    }

    hideBulletHole() {
        this.hole.visible = false
    }
}