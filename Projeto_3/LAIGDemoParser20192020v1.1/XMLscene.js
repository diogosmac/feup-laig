var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     * @param {int} numGraphs
     */
    constructor(myinterface, numGraphs) {
        super();

        this.interface = myinterface;
        this.graphs = [];
        this.numGraphs = numGraphs;
        this.activeGraph = 1;
        this.graphsLoaded = 0;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.initCameras();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);

        this.fps = 60;
        this.setUpdatePeriod(1000 / this.fps);

        this.matIndex = 0;
        this.interfaceArrayViews = {}; // array for the view IDs and indexes for the interface dropdown

        this.lastT = 0; // aux variable in order to calculate time increments
        this.deltaT = 0; // time increments

        // --------------------------
        // game related

        this.pendingCameraChange = false;

        this.gameOrchestrator = new GameOrchestrator(this);
        this.setPickEnabled(true);
    }


    /**
     * Method that adds a newly generated graph to the array of scene graphs
     * @param {MySceneGraph} graph - new scene graph 
     */
    addGraph(graph) {
		this.graphs[graph.id] = graph;
    }


    /**
     * Updates the current graph
     */
    updateGraph(id) {
        if(this.activeGraph == id) // graph is already being displayed; no need to change anything
            return;

        this.activeGraph = id;
        this.graphs[this.activeGraph].resetNodeAnimations();
        
        this.axis = new CGFaxis(this, this.graphs[this.activeGraph].referenceLength);
        this.gl.clearColor(this.graphs[this.activeGraph].background[0], this.graphs[this.activeGraph].background[1], this.graphs[this.activeGraph].background[2], this.graphs[this.activeGraph].background[3]);
        this.setGlobalAmbientLight(this.graphs[this.activeGraph].ambient[0], this.graphs[this.activeGraph].ambient[1], this.graphs[this.activeGraph].ambient[2], this.graphs[this.activeGraph].ambient[3]);
        this.initLights();
        this.gameOrchestrator.loadTemplates(this.graphs[this.activeGraph].templates); // updates/initiates game templates
        this.normalCamera = this.graphs[this.activeGraph].views[this.activeCameraID]; // default camera is activated
        this.interface.updateInterface();
    }


    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
		this.normalCamera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
		
		this.cameraRotationActive = false;
		this.angleRotated = 0;
    }


    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graphs[this.activeGraph].lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebGL.
            
            if (this.graphs[this.activeGraph].lights.hasOwnProperty(key)) {
                var light = this.graphs[this.activeGraph].lights[key];

                this.lights[i].setPosition(light[2][0], light[2][1], light[2][2], light[2][3]);
                this.lights[i].setAmbient(light[3][0], light[3][1], light[3][2], light[3][3]);
                this.lights[i].setDiffuse(light[4][0], light[4][1], light[4][2], light[4][3]);
                this.lights[i].setSpecular(light[5][0], light[5][1], light[5][2], light[5][3]);
                this.lights[i].setConstantAttenuation(light[6][0]);
                this.lights[i].setLinearAttenuation(light[6][1]);
                this.lights[i].setQuadraticAttenuation(light[6][2]);
                

                if (light[1] == "spot") {
                    this.lights[i].setSpotCutOff(light[7]);
                    this.lights[i].setSpotExponent(light[8]);
                    this.lights[i].setSpotDirection(
                        light[9][0] - light[2][0],
                        light[9][1] - light[2][1],
                        light[9][2] - light[2][2]
                    );
                }
                
                if (light[0]) {
                    this.lights[i].setVisible(true);
                    this.lights[i].enable();
                }
                else {
                    this.lights[i].setVisible(false);
                    this.lights[i].disable();
                }
                
                this.lights[i].update();

                i++;
            }
        }
    }

    setDefaultAppearance() {
        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);
	}
	
    update(t) {
		this.checkKeys();

		if (this.cameraRotationActive) {
			let cameraAngRot = Math.PI * (t - this.lastT) / 2000;
			cameraAngRot = Math.min(cameraAngRot, Math.PI - this.angleRotated);
			this.angleRotated += cameraAngRot;
			if (this.angleRotated == Math.PI) {
				cameraAngRot -= this.angleRotated - Math.PI;
				this.angleRotated = 0;
                this.cameraRotationActive = false;
                this.gameOrchestrator.rotatingCameraDone = true;
			}
			this.camera.orbit(vec3.fromValues(0, 1, 0), cameraAngRot);
        }
        else if(this.pendingCameraChange !== false) {
            this.activeCameraID = this.pendingCameraChange;
            if(this.activeCameraID == "defaultPerspective")
                this.graphs[this.activeGraph].resetNodeAnimations();
            this.normalCamera = this.graphs[this.activeGraph].views[this.activeCameraID];
            this.pendingCameraChange = false;
        }

        if(this.sceneInited) {
            if(this.lastT == 0) { // first time calling function
                this.lastT = t;
            }
            else { // already have lastT value from last update() call
                let gameTime = t - this.lastT;
                this.deltaT = (t - this.lastT) / 1000; // converts to seconds
                this.lastT = t;
                this.graphs[this.activeGraph].animateNodes(this.deltaT);
                this.gameOrchestrator.update(gameTime, t / 1000);
            }
        }
    }

    changeMatIndex() {
        this.matIndex++;
    }

    checkKeys() {
        if (this.gui.isKeyPressed("KeyM"))
			this.changeMatIndex();
    }

    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        this.axis = new CGFaxis(this, this.graphs[this.activeGraph].referenceLength);

        this.gl.clearColor(this.graphs[this.activeGraph].background[0], this.graphs[this.activeGraph].background[1], this.graphs[this.activeGraph].background[2], this.graphs[this.activeGraph].background[3]);

        this.setGlobalAmbientLight(this.graphs[this.activeGraph].ambient[0], this.graphs[this.activeGraph].ambient[1], this.graphs[this.activeGraph].ambient[2], this.graphs[this.activeGraph].ambient[3]);

        this.initLights();
        
        this.gameOrchestrator.loadTemplates(this.graphs[this.activeGraph].templates, true); // updates/initiates game templates

        this.normalCamera = this.graphs[this.activeGraph].views[this.activeCameraID]; // default camera is activated

        this.interface.updateInterface();
        
        this.sceneInited = true;
    }

    changeCamera() {
        if(!this.cameraRotationActive) {
            if(this.activeCameraID == "defaultPerspective")
                this.graphs[this.activeGraph].resetNodeAnimations();
            this.normalCamera = this.graphs[this.activeGraph].views[this.activeCameraID];
        }
        else
            this.pendingCameraChange = this.activeCameraID;
    }

    /**
     * Render function of the scene (to be called twice by display)
     * @param {CGFcamera} camera 
     */
    render(camera) {
        // ---- BEGIN Background, camera and axis setup        
        
        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        
        this.camera = camera;

        // Initialize Model-View matrix as identity (no transformation)
        this.updateProjectionMatrix();
        this.loadIdentity();
        
        
        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();
        
        this.pushMatrix();
        // this.axis.display();
        
        
        if (this.sceneInited) {
            
            var i = 0;
            for(var key in this.graphs[this.activeGraph].lights) {
                if(i >= 8)
                    break;

                if(this.graphs[this.activeGraph].lights[key][0]) {
                    this.lights[i].setVisible(true);
                    this.lights[i].enable();
                }
                else {
                    this.lights[i].setVisible(false);
                    this.lights[i].disable();
                }

                this.lights[i].update();
                i++;        
            }

            // Draw axis
            this.setDefaultAppearance();

            // Displays the scene (MySceneGraph function).
            this.graphs[this.activeGraph].displayScene();

            this.gameOrchestrator.orchestrate();

            // Displays everything related to the game (and invoques picking management).
            this.gameOrchestrator.managePick(this.pickMode, this.pickResults);
            this.clearPickRegistration();
            this.gameOrchestrator.display();
        }


        this.popMatrix();
        // ---- END Background, camera and axis setup
    }


    /**
     * Displays the scene.
     */
    display() {
		this.render(this.normalCamera);
		// this.render(this.camera);
    }
}
