export class Manager {
    constructor() { }

    app
    _width
    _height
    currentScene

    static get width() {
        return Manager._width
    }
    static get height() {
        return Manager._height
    }

    static initialize(width, height, background) {
        Manager._width = width
        Manager._height = height

        Manager.app = new PIXI.Application({
            view: document.getElementById("game"),
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            backgroundColor: background,
            width: width,
            height: height,
        });

        globalThis.__PIXI_APP__ = Manager.app // Отладка

        Manager.app.ticker.add(Manager.update)

        window.addEventListener("resize", Manager.resize)

        Manager.resize()
    }

    static changeScene(newScene) {
        if (Manager.currentScene) {
            Manager.app.stage.removeChild(Manager.currentScene)
            Manager.currentScene.destroy()
        }

        Manager.currentScene = newScene
        Manager.app.stage.addChild(Manager.currentScene)
    }

    static update(framesPassed) {
        if (Manager.currentScene) {
            Manager.currentScene.update(framesPassed)
        }
    }

    static resize() {
        const screenWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
        const screenHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)

        const scale = Math.min(screenWidth / Manager.width, screenHeight / Manager.height)

        const enlargedWidth = Math.floor(scale * Manager.width)
        const enlargedHeight = Math.floor(scale * Manager.height)

        const horizontalMargin = (screenWidth - enlargedWidth) / 2
        const verticalMargin = (screenHeight - enlargedHeight) / 2

        Manager.app.view.style.width = `${enlargedWidth}px`
        Manager.app.view.style.height = `${enlargedHeight}px`
        Manager.app.view.style.marginLeft = Manager.app.view.style.marginRight = `${horizontalMargin}px`
        Manager.app.view.style.marginTop = Manager.app.view.style.marginBottom = `${verticalMargin}px`

        console.log(Manager.app.view.style.width)
        console.log(Manager.width)
        const width = Manager.app.view.style.getPropertyValue("width")
        console.log(width)
    }

    static scaleCamera() {
        const width = Manager.app.view.style.setProperty("width", "100px")
    }
}