import { Manager } from "../Manager.js"
import { GameScene } from "./GameScene.js"

const manifest = {
    bundles: [
        {
            name: "UI Bundle",
            assets:
            {
                "play": "./resources/play.png",
                "background": "./resources/background.jpg"
            }
        },
        {
            name: "Ducks Bundle",
            assets:
            {
                "duck": "./resources/duck.png",
            }
        },
        {
            name: "Gun Bundle",
            assets:
            {
                "gun": "./resources/gun.png",
                "bullet_hole": "./resources/bullet_hole.png"
            }
        },
        {
            name: "Explosion Bundle",
            assets:
            {
                "explosions_map": "./resources/explosions.json",
            }
        },
        {
            name: "Aim Bundle",
            assets:
            {
                "aim": "./resources/aim.png",
            }
        }
    ]
}

export class LoaderScene extends PIXI.Container {
    constructor() {
        super()

        this.initializeLoader().then(() => {
            this.gameLoaded()
        })

    }

    async initializeLoader() {
        await PIXI.Assets.init({ manifest: manifest })

        const bundleIds = manifest.bundles.map(bundle => bundle.name)

        await PIXI.Assets.loadBundle(bundleIds)
    }

    async gameLoaded() {
        Manager.changeScene(new GameScene())
    }

    update() {

    }
}