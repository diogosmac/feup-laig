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
            if(i >= 8)
                break;
            
            lightsFolder.add(this.scene.graph.lights[key], '0').name(key);
            i++;
        }
    }

    addCamerasDropdown() {
        // fill in the arrays
        for(var key in this.scene.graph.views) {
            this.scene.interfaceArrayViews[key] = key;
        }

        this.gui.add(this.scene, 'activeCameraID', this.scene.interfaceArrayViews).name('Main camera').onChange(this.scene.changeCamera.bind(this.scene));
        this.gui.add(this.scene, 'activeSecCameraID', this.scene.interfaceArrayViews).name('Security camera').onChange(this.scene.changeSecurityCamera.bind(this.scene));
    }

    updateInterface() {
        this.addCamerasDropdown();
        this.addLightsFolder();
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