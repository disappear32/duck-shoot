import { Manager } from "../Manager.js"
import Duck from "../game-objects/Duck.js"
import Gun from "../game-objects/Gun.js"

export class GameScene extends PIXI.Container {
    ducks
    isMoveContinue

    constructor() {
        super()

        //Ружье
        this.gun = new Gun(this, 453, 1183)

        // const linesDirections = this.gun.getGunDirection()
        // this.helpGunDirection = new PIXI.Container()
        // this.helpGunDirection.x = linesDirections.leftX
        // this.helpGunDirection.y = 0
        // this.addChild(this.helpGunDirection)

        // const gunDirectionLine1 = new PIXI.Graphics()
        // gunDirectionLine1.lineStyle(3, 0xFF0000, 1, 1)
        // gunDirectionLine1.drawRect(0, 0, linesDirections.rightX - linesDirections.leftX, 1183)
        // this.helpGunDirection.addChild(gunDirectionLine1)



        //Игровое поле
        const gameBoard = {
            width: 980,
            height: 600,
            x: 50,
            y: 423,
            radius: 30
        }

        const gameBoardContainer = new PIXI.Container()
        gameBoardContainer.x = gameBoard.x
        gameBoardContainer.y = gameBoard.y
        this.addChild(gameBoardContainer)

        const gameBoardBorder = new PIXI.Graphics()
        gameBoardBorder.lineStyle(10, 0x636363, 1, 1)
        gameBoardBorder.drawRoundedRect(gameBoard.x, gameBoard.y, gameBoard.width, gameBoard.height, gameBoard.radius)
        this.addChild(gameBoardBorder)

        const gameBoardMask = new PIXI.Graphics()
        gameBoardMask.beginFill(0xFF3300)
        gameBoardMask.drawRoundedRect(gameBoard.x, gameBoard.y, gameBoard.width, gameBoard.height, gameBoard.radius)
        gameBoardMask.endFill()
        gameBoardContainer.mask = gameBoardMask



        //Спрайты уточек
        const duckCount = 2
        const duckSize = { 
            width: 120,
            height: 240
        }
        this.ducks = []

        for (let i = 0; i < duckCount; i++) {
            const duckMargin = (gameBoard.width - duckSize.width * (duckCount - 1)) / duckCount
            const duck = new Duck(
                this, 
                duckMargin * i + duckSize.width * (i - 1), 
                gameBoard.height - duckSize.height, 
                duckSize.width, 
                duckSize.height
            )

            gameBoardContainer.addChild(duck)
            this.ducks.push(duck)
        }



        //UI
        const UiControl = {
            width: Manager.width,
            height: 440,
            x: 0,
            y: 1480
        }

        const UiContainer = new PIXI.Container()
        UiContainer.x = UiControl.x
        UiContainer.y = UiControl.y
        this.addChild(UiContainer)

        const UiBackground = new PIXI.Graphics()
        UiBackground.beginFill(0xD9D9D9)
        UiBackground.drawRect(0, 0, UiControl.width, UiControl.height)
        UiBackground.endFill()
        UiContainer.addChild(UiBackground)

        const playButtonSprite = PIXI.Sprite.from('play')
        playButtonSprite.anchor.set(0.5)
        playButtonSprite.x = UiControl.width / 2
        playButtonSprite.y = UiControl.height / 2
        playButtonSprite.interactive = true;
        playButtonSprite.on('tap', (event) => {
            this.handlePlayButton()
            this.gun.gunAnimationStart()
        })
        
        UiContainer.addChild(playButtonSprite)
        
        this.isMoveContinue = true
    }

    update(framesPassed) {
        const duckVelocity = this.isMoveContinue ? 5 : 0

        this.ducks.forEach((duck) => {
            if (duck.x >= 980) { 
                duck.x = -duck.width 
                duck.hideBulletHole()
            }

            duck.x += duckVelocity * framesPassed
        })

        this.gun.update(framesPassed)

        // const linesDirections = this.gun.getGunDirection()
        // this.helpGunDirection.x = linesDirections.leftX
    }

    handlePlayButton() {
        const gunBorders = this.gun.getGunDirection()
        let shotDuckIndex

        const isHitDuck = this.ducks.some((duck) => {
            const duckBordres = {
                leftX: duck.getGlobalPosition().x,
                rightX: duck.getGlobalPosition().x + duck.width
            }

            if (duckBordres.leftX <= gunBorders.leftX && gunBorders.rightX <= duckBordres.rightX) {
                shotDuckIndex = this.ducks.indexOf(duck)
                return true
            }

            if (gunBorders.leftX <= duckBordres.leftX && gunBorders.rightX >= duckBordres.leftX) {
                shotDuckIndex = this.ducks.indexOf(duck)
                return true
            }

            if (gunBorders.leftX <= duckBordres.rightX && gunBorders.rightX >= duckBordres.rightX) {
                shotDuckIndex = this.ducks.indexOf(duck)
                return true
            }

            return false
        })

        if (isHitDuck) {
            this.isMoveContinue = false
            this.scaleCamera()

            setTimeout(() => {
                this.ducks[shotDuckIndex].shootDuck(gunBorders)
                this.isMoveContinue = true
                this.returnCamera()
            }, 1000)
        }
    }

    scaleCamera() {
        this.scale.x = 1.3
        this.scale.y = 1.3
    }

    returnCamera() {
        this.scale.x = 1
        this.scale.y = 1
    }
}
