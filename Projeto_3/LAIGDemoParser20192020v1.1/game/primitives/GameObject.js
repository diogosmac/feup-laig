/**
 * GameObject - class that represents an object specific of the game
 */
class GameObject extends CGFObject {
    /**
     * Constructor of the class
     * @param {XMLScene} scene 
     * @param {bool} selectable - Boolean value that indicates whether an object can be selected
     * @param {bool} visible - Boolean value that indicates whether an object is visible
     */
    constructor(scene, selectable, visible) {
        super(scene);
        this.selectable = selectable;
        this.visible = visible;
    }

    /**
     * Display method for the game object
     * @param {int} ls - Texture length in S
     * @param {int} lt - Texture length in T
     */
    display(ls, lt) {
        super.display();
    }

}