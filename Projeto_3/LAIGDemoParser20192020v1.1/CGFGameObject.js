/**
 * CGFGameObject
 * @constructor
 * @param selectable - boolean value that indicates whether an object can be selected
 * @param visible - boolean value that indicates whether an object is visible
 */
class CGFGameObject extends CGFobject {

    constructor(scene, selectable, visible) {
        super(scene);
        this.selectable = selectable;
        this.visible = visible;
    }

    display(ls, lt) {
        super.display();
    }

}
