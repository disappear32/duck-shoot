import { Manager } from "../Manager.js"
import Aim from "../game-objects/Aim.js"
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



        //Текст при выигрыше
        this.winText = new PIXI.Text('', {
            fontSize: 96,
            fill: 0x3E3E3E,
            align: 'center',
        })
        this.winText.name = 'Text'
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
        })

        UiContainer.addChild(playButtonSprite)



        //Прицел
        this.aim = new Aim(this, 0, 0, 1080, 1480)
        this.addChild(this.aim)




        //Настройка для движения уточек и ружья
        this.isMoveContinue = true
    }

    update(framesPassed) {
        TWEEN.update()

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
        console.log('text start')
        this.winText.visible = true
        this.winText.y = 100
        this.winText.scale = 0.7
        this.winText.alpha = 0.3

        const randomValue = Math.random() * 100 + 10

        const textAnim = new TWEEN.Tween([{ y: 100 }, { scale: 0.3 }, { alpha: 0.7 }, { value: 0 }])
            .to([{ y: 20 }, { scale: 1.5 }, { alpha: 1 }, { value: randomValue }], 700)
            //.repeat(1)
            //.delay(300)
            .onUpdate(() => {
                this.winText.y = y
                this.winText.scale = scale
                this.winText.alpha = alpha
                this.winText.text = `${value} RUB`
            })
            .onComplete(() => {
                this.winText.visible = false
                console.log('text done')
            })
    }
}
