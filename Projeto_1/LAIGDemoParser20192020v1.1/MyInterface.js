/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // this.gui.add(this.scene, 'camera').name('Camera');

        this.initKeys();

        return true;
    }

    addLightsFolder() {
    
        var lightsFolder = this.gui.addFolder('Lights');
        var i = 0;

        for(var key in this.scene.graph.lights) {
            lightsFolder.add(this.scene.lights[i].enable).name(key);
            i++;
        }
    }

    addCamerasDropdown() {
        this.gui.add(this.scene, 'activeCameraID', this.scene.graph.views).name('Selected camera').onChange(this.scene.changeCamera);
    }

    updateInterface() {
        this.addLightsFolder();
        this.addCamerasDropdown();
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui=this;
        this.processKeyboard=function(){};
        this.activeKeys={};
    }

    processKeyDown(event) {
        this.activeKeys[event.code]=true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code]=false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }
}