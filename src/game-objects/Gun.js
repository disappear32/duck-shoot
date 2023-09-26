import { Manager } from "../Manager.js"

export default class Gun extends PIXI.Container {
    constructor(scene, x, y) {
        super()

        scene.addChild(this)

        const gunSprite = PIXI.Sprite.from('gun')
        gunSprite.x = 0
        gunSprite.y = 0
        this.addChild(gunSprite)


        this.x = x
        this.y = y

        this.leftBorderX = 235
        this.rightBorderX = Manager.width - gunSprite.width - 235

        this.gunVelocity = this.getRandomVelocity()
        this.gunVector = this.getRandomVector()
        this.nextVelocityChangeTime = this.getRandomTime()
        this.updateCounter = 0

        const frames = []
        for (let i = 0; i < 26; i++) {
            frames.push(PIXI.Texture.from(`explosion${i}.png`))
        }
        this.gunAnimation = new PIXI.AnimatedSprite(frames)
        this.gunAnimation.x = gunSprite.width / 2
        this.gunAnimation.y = 0
        this.gunAnimation.animationSpeed = 0.75
        this.gunAnimation.anchor.set(0.5)
        this.gunAnimation.scale.set(0.7)
        this.gunAnimation.loop = false
        this.gunAnimation.visible = false
        this.gunAnimation.onComplete = () => {
            this.gunAnimation.visible = false
            this.gunAnimation.gotoAndStop(0)
            this.isActive = true
        }
        this.addChild(this.gunAnimation)
    }

    getRandomTime() {
        return Math.random() * 3000 + 1000 // От 1 до 4 секунд в миллисекундах
    }
    getRandomVelocity() {
        return Math.random() * 5 + 5 // Новая случайная скорость
    }
    getRandomVector() {
        return Math.random() < 0.5 ? 1 : -1 // Случайное направление
    }
    getGunDirection() {
        return { 
            leftX: this.x + 76,
            rightX: this.x + 98
        }
    }
    gunAnimationStart() {
        this.gunAnimation.visible = true
        this.gunAnimation.play()
    }

    update(framesPassed) {
        if (this.parent.isMoveContinue) {
            this.updateCounter++
    
            if (this.updateCounter * 16.666667 >= this.nextVelocityChangeTime) { // 1 секунда = 1000 миллисекунд
    
                this.gunVelocity = this.getRandomVelocity()
                this.gunVector = this.getRandomVector()
    
                this.updateCounter = 0
                this.nextVelocityChangeTime = this.getRandomTime()
            }
    
            this.x += this.gunVector * this.gunVelocity * framesPassed
    
            if (this.x < this.leftBorderX) {
                this.x = this.leftBorderX
                this.gunVector = 1
            } else if (this.x > this.rightBorderX) {
                this.x = this.rightBorderX
                this.gunVector = -1
            }
        }
    }
}
