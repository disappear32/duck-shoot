import { Manager } from "../Manager.js"

export default class Duck extends PIXI.Container {
    width
    height

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

        this.holeMarin = Math.max(billetHoleSprite.width, billetHoleSprite.height)
    }

    shootDuck(globalGunPos) {
        const globalLeft = {
            x: globalGunPos.leftX,
            y: 0
        }
        const globalRight = {
            x: globalGunPos.rightX,
            y: 0
        }
        const localLeft = this.toLocal(globalLeft)
        const localRight = this.toLocal(globalRight)
        console.log(globalLeft, localLeft)
        console.log(globalRight, localRight)

        const randomHolePosX = Math.random() * (localRight.x - localLeft.x) + localLeft.x
        const randomHolePosY = Math.random() * this.height

        this.children[1].x = randomHolePosX
        this.children[1].y = randomHolePosY
        this.children[1].visible = true
    }

    hideBulletHole() {
        this.children[1].visible = false
    }
}