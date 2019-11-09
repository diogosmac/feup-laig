/**
 * NurbCylinder - Class that represents a nurbs cylinder
 */
class NurbCylinder extends CGFobject {
    /**
     * Constructor of the class
    * @param {*} scene - Reference to MyScene object
    * @param {*} id - ID of the object
    * @param {*} base -  Radius of the base (Z = 0)
    * @param {*} top - Radius of the top (Z = height)
    * @param {*} height - Height of the cylinder
    * @param {*} slices - Number of slices
    * @param {*} stacks - Number of stacks
     */
    constructor(scene, id, base, top, height, slices, stacks) {
        super(scene);
        this.id = id;
        this.base = base;
        this.top = top;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;
        this.initBuffers();
    }
    
    /**
     * Function that creates the 2 nurbs objects that the cylinder displays
     */
    initBuffers() {
        var controlPointsA = [
            // U = 0
            [   // V = 0..3
                [0, -this.base, 0, 1],
                [-this.base * 4/3, -this.base, 0, 1],
                [-this.base * 4/3, this.base, 0, 1],
                [0, this.base, 0, 1]
            ],
            // U = 1
            [   // V = 0..3
                [0, -this.top, this.height, 1],
                [-this.top * 4/3, -this.top, this.height, 1],
                [-this.top * 4/3, this.top, this.height, 1],
                [0, this.top, this.height, 1]
            ]
        ];
        var surfA = new CGFnurbsSurface(1, 3, controlPointsA);
        this.objA = new CGFnurbsObject(this.scene, this.stacks, Math.round(this.slices / 2), surfA);

        var controlPointsB = [
            // U = 0
            [   // V = 0..3
                [0, this.base, 0, 1],
                [this.base * 4/3, this.base, 0, 1],
                [this.base * 4/3, -this.base, 0, 1],
                [0, -this.base, 0, 1]
            ],
            // U = 1
            [   // V = 0..3
                [0, this.top, this.height, 1],
                [this.top * 4/3, this.top, this.height, 1],
                [this.top * 4/3, -this.top, this.height, 1],
                [0, -this.top, this.height, 1]
            ]
        ];
        var surfB = new CGFnurbsSurface(1, 3, controlPointsB);
        this.objB = new CGFnurbsObject(this.scene, this.stacks, Math.round(this.slices / 2), surfB);
    }

    display(ls, lt) {
        this.objA.display();
        this.objB.display();
    }

}
