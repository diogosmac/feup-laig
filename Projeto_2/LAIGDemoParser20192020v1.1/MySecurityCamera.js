/**
 * MySecurityCamera - class that represent the 2nd screen, that is the security camera
 */
class MySecurityCamera extends CGFobject {
    /**
     * Constructor of the class
     * @param {*} scene - Reference to the scene object
     */
    constructor(scene) {
        // TODO: determine arguments to pass to rectangle
        // TODO: implement the shaders
        super(scene);
        // this.securityCameraShader = new CGFshader(scene.gl, "shaders/SecCamRec.vert", "shaders/SecCamRec.frag");
        this.securityCameraRec = new MyRectangle(scene, "SecurityCameraRec", 0, 0, 1, 1);
        this.secCamRecMaterial = new CGFappearance(this.scene);
        this.secCamRecMaterial.setShininess(1);
        this.secCamRecMaterial.setAmbient(0, 0, 0, 1);
        this.secCamRecMaterial.setDiffuse(0.5, 0.5, 0.5, 1);
        this.secCamRecMaterial.setSpecular(0, 0, 0, 1);
        this.secCamRecMaterial.setEmission(0, 0, 0, 1);
    }


    /**
     * Display method for the security camera object
     */
    display() {
        this.scene.rttTexture.bind();
        this.secCamRecMaterial.apply();
        this.secCamRecMaterial.setTexture(this.scene.rttTexture);
        // this.scene.setActiveShader(this.securityCameraShader);
        this.securityCameraRec.display();
        // this.scene.setActiveShader(this.scene.defaultShader);
        this.scene.rttTexture.unbind();
    }
}