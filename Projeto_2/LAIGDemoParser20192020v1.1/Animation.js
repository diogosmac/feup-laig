/**
 * Animation - "abstract" class serving as a base to apply animations to an object
 */
class Animation {
    /**
     * Constructor of the class
     */
    constructor() {
        this.animationMatrix = mat4.create();
        mat4.identity(this.animationMatrix);
    }


    /**
     * "Abstract" function, to be implemented by the subclasses, that calculates the new animation matrix, given deltaT
     * @param {*} deltaT - The time difference between function calls
     */
    generateAnimationMatrix(deltaT) {
        
    }


    /**
     * Function that updates the animation matrix in function of the time passed
     * @param {*} deltaT - The time difference between function calls
     */
    update(deltaT) {
        this.generateAnimationMatrix(deltaT);
    }


    /**
     * Function that applies the transformation matrix to the scene's transformation matrix
     */
    apply() {
        this.scene.multMatrix(this.animationMatrix);
    }
}