/**
 * MyCylinder
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - ID of the object
 * @param nPartsU - number of parts of the plane on U domain
 * @param nPartsV -  number of parts of the plane on V domain
 */
class Plane extends CGFobject {

    constructor(scene, id, nPartsU, nPartsV) {

        super(scene);

        this.id = id;
        this.nPartsU = nPartsU;
        this.nPartsV = nPartsV;

        var points = [
            // U = 0
            [   // V = 0, 1
                [0.5, 0.0, -0.5, 1.0],
                [0.5, 0.0, 0.5, 1.0]
            ],
            // U = 1
            [   // V = 0, 1
                [-0.5, 0.0, -0.5, 1.0],
                [-0.5, 0.0, 0.5, 1.0]
            ]
        ];

        var surf = new CGFnurbsSurface(1, 1, points);
        this.obj = new CGFnurbsObject(this.scene, this.nPartsU, this.nPartsV, surf);

    }

    display() {
        this.obj.display();
    }

}
