/**
 * Patch
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - ID of the object
 * @param nPointsU - number of points of the patch on U domain
 * @param nPointsV -  number of points of the patch on V domain
 * @param nPartsU - number of parts of the patch on U domain
 * @param nPartsV -  number of parts of the patch on V domain
 * @param controlPoints - control points for the patch
 */
class Patch extends CGFobject {

    constructor(scene, id, nPointsU, nPointsV, nPartsU, nPartsV, controlPoints) {

        super(scene);

        this.id = id;
        this.nPointsU = nPointsU;
        this.nPointsV = nPointsV;
        this.nPartsU = nPartsU;
        this.nPartsV = nPartsV;
        this.controlPoints = controlPoints;

        var surf = new CGFnurbsSurface(this.nPointsU - 1, this.nPointsV - 1, controlPoints);
        this.obj = new CGFnurbsObject(this.scene, this.nPartsU, this.nPartsV, surf);

    }

    display(ls, lt) {
        this.obj.display();
    }

}
