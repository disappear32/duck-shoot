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

        Manager.app.view.style.width = `${enlargedWidth}px`
        Manager.app.view.style.height = `${enlargedHeight}px`
    }

    static scaleCamera() {
        const currWidth = parseInt(Manager.app.view.style.getPropertyValue("width").slice(0, -2), 10)
        const canvasScaleFactor = Manager.width / currWidth
        const screenWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)

        const scaleFactor = screenWidth / (currWidth - 40 * canvasScaleFactor)
        Manager.app.view.style.transform = `scale(${scaleFactor})`
    }

    static returnCamera() {
        Manager.app.view.style.transform = ''
    }
}