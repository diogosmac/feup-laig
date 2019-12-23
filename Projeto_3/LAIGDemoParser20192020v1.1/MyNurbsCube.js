/**
 * MyNurbsCube - class that represents a cube parallelepiped made out of nurbs planes
 */
class MyNurbsCube extends CGFobject {
    /**
     * Construtor of the class
     * @param {XMLscene} scene - reference to the scene object 
     * @param {*} id - id of the cube object
     * @param {int} side - side of the cube
     * @param {int} thick - thickness of the cube
     */
    constructor(scene, id, side, thick) {
        super(scene);
        this.id = id;
        this.side = side;
        this.thick = thick;
        this.nDivs = 20;
        this.x = 0;
        this.y = 0;
        this.initBuffers();
    }


    /**
     * Method that creates the geometry of the cube
     */
    initBuffers() {
        var points = [
            // U = 0
            [   // V = 0, 1
                [this.x + (this.side / 2), this.y + (this.side / 2), this.thick, 1.0],
                [this.x + (this.side / 2), this.y - (this.side / 2), this.thick, 1.0],
            ],
            // U = 1
            [   // V = 0, 1
                [this.x - (this.side / 2), this.y + (this.side / 2), this.thick, 1.0],
                [this.x - (this.side / 2), this.y - (this.side / 2), this.thick, 1.0],
            ]
        ];

        var surf = new CGFnurbsSurface(1, 1, points);
        this.top = new CGFnurbsObject(this.scene, this.nDivs, this.nDivs, surf);


        points = [
            // U = 0
            [   // V = 0, 1
                [this.x + (this.side / 2), this.y - (this.side / 2), 0, 1.0],
                [this.x + (this.side / 2), this.y + (this.side / 2), 0, 1.0],
            ],
            // U = 1
            [   // V = 0, 1
                [this.x - (this.side / 2), this.y - (this.side / 2), 0, 1.0],
                [this.x - (this.side / 2), this.y + (this.side / 2), 0, 1.0],
            ]
        ];

        surf = new CGFnurbsSurface(1, 1, points);
        this.bottom = new CGFnurbsObject(this.scene, this.nDivs, this.nDivs, surf);


        points = [
            // U = 0
            [   // V = 0, 1
                [this.x + (this.side / 2), this.y + (this.side / 2), this.thick, 1.0],
                [this.x - (this.side / 2), this.y + (this.side / 2), this.thick, 1.0],
            ],
            // U = 1
            [   // V = 0, 1
                [this.x + (this.side / 2), this.y + (this.side / 2), 0, 1.0],
                [this.x - (this.side / 2), this.y + (this.side / 2), 0, 1.0],
            ]
        ];
        surf = new CGFnurbsSurface(1, 1, points);
        this.sidePanel = new CGFnurbsObject(this.scene, this.nDivs, this.nDivs, surf);
    }


    /**
     * Display method for the game table
     * @param {int} ls - length_s for the texture
     * @param {int} lt - length_t for the texture
     */
    display(ls, lt) {
        this.scene.pushMatrix();
        this.scene.translate(0, this.thick, 0);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);

        this.top.display();
        this.bottom.display();

        this.scene.pushMatrix();

        this.sidePanel.display();
        this.scene.rotate(Math.PI / 2, 0, 0, 1);
        this.sidePanel.display();
        this.scene.rotate(Math.PI / 2, 0, 0, 1);
        this.sidePanel.display();
        this.scene.rotate(Math.PI / 2, 0, 0, 1);
        this.sidePanel.display();

        this.scene.popMatrix();
        this.scene.popMatrix();
    }
}