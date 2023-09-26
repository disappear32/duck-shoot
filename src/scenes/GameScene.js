import { Manager } from "../Manager.js"
import Aim from "../game-objects/Aim.js"
import Duck from "../game-objects/Duck.js"
import Gun from "../game-objects/Gun.js"

export class GameScene extends PIXI.Container {
    ducks
    isMoveContinue

    constructor() {
        super()

        //Бэк
        // const background = PIXI.Sprite.from('background')
        // background.anchor.set(0.5)
        // background.x = Manager.width / 2
        // background.y = Manager.height / 2
        // background.width = Manager.width
        // background.height = Manager.height
        // this.addChild(background)



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



        //Текст при выигрыше
        this.winText = new PIXI.Text('', {
            fontSize: 72,
            fill: 0x3E3E3E,
            align: 'center'
        })
        this.winText.name = 'Text'
        this.winText.anchor.set(0.5)
        this.winText.x = gameBoard.width / 2
        this.winText.y = 100
        this.winText.visible = false
        gameBoardContainer.addChild(this.winText)



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



        //Прицел
        this.aim = new Aim(this, 0, 0, 1080, 1480)
        this.addChild(this.aim)



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
        playButtonSprite.interactive = true
        playButtonSprite.on('tap', (event) => {
            this.handlePlayButton()
        })
        playButtonSprite.on('mousedown', (event) => {
            this.handlePlayButton()
        })

        UiContainer.addChild(playButtonSprite)




        //Настройка для движения уточек и ружья
        this.isMoveContinue = true
    }

    update(framesPassed) {
        TWEEN.update()

        const duckVelocity = this.isMoveContinue ? 5 : 0

        this.ducks.forEach((duck) => {
            if (duck.x >= 980) {
                duck.x = -duck.width
                duck.resetDuck()
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
                leftX: duck.getGlobalPosition().x + duck.holeMargin,
                rightX: duck.getGlobalPosition().x + duck.width - duck.holeMargin
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
            const holePosition = this.getHolePosition(gunBorders, shotDuckIndex)

            this.ducks[shotDuckIndex].setHolePosition(holePosition.local)
            this.isMoveContinue = false
            Manager.scaleCamera()

            this.aim.showAim(holePosition.global).then(() => {
                this.gun.gunAnimationStart()

                this.ducks[shotDuckIndex].shootDuck()

                this.aim.hideAim()

                this.showWinText()

                this.isMoveContinue = true

                Manager.returnCamera()
            })
        }
        else {
            this.gun.gunAnimationStart()

            this.winText.visible = true
            this.winText.text = 'Промах!'

            setTimeout(() => {
                this.winText.visible = false
            }, 900)
        }
    }

    getHolePosition(globalGunPos, shotDuckIndex) {
        const globalLeft = {
            x: globalGunPos.leftX,
            y: 0
        }
        const globalRight = {
            x: globalGunPos.rightX,
            y: 0
        }
        const localLeft = this.ducks[shotDuckIndex].toLocal(globalLeft)
        const localRight = this.ducks[shotDuckIndex].toLocal(globalRight)

        const localHolePos = {
            x: Math.random() * (localRight.x - localLeft.x) + localLeft.x,
            y: Math.random() * this.ducks[shotDuckIndex].height
        }
        const globalHolePos = this.ducks[shotDuckIndex].toGlobal(localHolePos)


        return {
            local: localHolePos,
            global: globalHolePos
        }
    }

    showWinText() {
        this.winText.visible = true

        const scalingFrom = { scale: 0.7 } 
        const scalingTo = { scale: 1.3 } 
        const scalingAnim = new TWEEN.Tween(scalingFrom)
            .to(scalingTo, 1200)
            .easing(TWEEN.Easing.Bounce.Out)
            .onUpdate(() => {
                this.winText.scale.set(scalingFrom.scale, scalingFrom.scale)
            })
            .onComplete(() => {
                this.winText.visible = false
            })
            .start()


        const appearFrom = { y: 160, alpha: 0.6, value: 0 }
        const appearTo = { y: 70, alpha: 1, value: Math.random() * 30 }
        const appearAnim = new TWEEN.Tween(appearFrom)
            .to(appearTo, 800)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(() => {
                this.winText.y = appearFrom.y
                this.winText.alpha = appearFrom.alpha
                this.winText.text = `x${appearFrom.value.toFixed(1)}`
            })
            .start()
    }
}
