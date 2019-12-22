/**
 * MyGameTable - class that represents the geometry of the table where the game is played
 */
class MyGameTable extends CGFobject {
    /**
     * Constructor of the class
     * @param {XMLScene} scene - reference to the scene object 
     * @param {int} id - the object's id
     * @param {int} x - x coordinate
     * @param {int} y - y coordinate
     * @param {int} side - side value
     * @param {int} thick - thickness of the table
     * @param {int} height - height of the table
     */
    constructor(scene, id, x, y, side, thick, height) {
        super(scene);
        this.id = id;
        this.x = x;
        this.y = y;
        this.side = side;
        this.thick = thick;
        this.height = height;
        this.nDivs = 30;
        this.initBuffers();
    }

    /**
     * Makes the top of the table
     */
    makeTop() {

        var points = [
            // U = 0
            [   // V = 0, 1
                [this.x + (this.side / 2), this.y + (this.side / 2), this.height, 1.0],
                [this.x + (this.side / 2), this.y - (this.side / 2), this.height, 1.0],
            ],
            // U = 1
            [   // V = 0, 1
                [this.x - (this.side / 2), this.y + (this.side / 2), this.height, 1.0],
                [this.x - (this.side / 2), this.y - (this.side / 2), this.height, 1.0],
            ]
        ];

        var surf = new CGFnurbsSurface(1, 1, points);
        this.plane = new CGFnurbsObject(this.scene, this.nDivs, this.nDivs, surf);

    }


    /**
     * Makes the bottom of the table
     */
    makeBottom() {

        var points = [
            // U = 0
            [   // V = 0, 1
                [this.x + (this.side / 2), this.y - (this.side / 2), this.height - this.thick, 1.0],
                [this.x + (this.side / 2), this.y + (this.side / 2), this.height - this.thick, 1.0],
            ],
            // U = 1
            [   // V = 0, 1
                [this.x - (this.side / 2), this.y - (this.side / 2), this.height - this.thick, 1.0],
                [this.x - (this.side / 2), this.y + (this.side / 2), this.height - this.thick, 1.0],
            ]
        ];

        var surf = new CGFnurbsSurface(1, 1, points);
        this.bottom = new CGFnurbsObject(this.scene, this.nDivs, this.nDivs, surf);

    }


    /**
     * Makes the side of the table
     */
    makeSide() {

        var points = [
            // U = 0
            [   // V = 0, 1
                [this.x + (this.side / 2), this.y + (this.side / 2), this.height, 1.0],
                [this.x - (this.side / 2), this.y + (this.side / 2), this.height, 1.0],
            ],
            // U = 1
            [   // V = 0, 1
                [this.x + (this.side / 2), this.y + (this.side / 2), this.height - this.thick, 1.0],
                [this.x - (this.side / 2), this.y + (this.side / 2), this.height - this.thick, 1.0],
            ]
        ];
        var surf = new CGFnurbsSurface(1, 1, points);
        var sideDivs = Math.round((this.thick / this.height) * this.nDivs);
        this.sidePanel = new CGFnurbsObject(this.scene, sideDivs, this.nDivs, surf);

    }


    /**
     * Makes a leg of the table
     */
    makeLeg() {

        var legRadius = this.side / 20;
        var legSlices = 10;
        var legStacks = 20;
        this.leg = new NurbCylinder(
            this.scene, null, legRadius, legRadius, 
            this.height - this.thick, legSlices, legStacks);
        
    }


    /**
     * Method that generates all the geometry for the game table
     */
    initBuffers() {
        this.makeTop();
        this.makeBottom();
        this.makeSide();
        this.makeLeg();
    }


    /**
     * Display method for the game table
     * @param {int} ls - length_s for the texture
     * @param {int} lt - length_t for the texture
     */
    display(ls, lt) {

        this.plane.display();
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


        var distFromCenter = 0.35 * this.side;

        this.scene.pushMatrix();
        this.scene.translate(distFromCenter, distFromCenter, 0);
        this.leg.display(ls, lt);
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(distFromCenter, -distFromCenter, 0);
        this.leg.display(ls, lt);
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-distFromCenter, distFromCenter, 0);
        this.leg.display(ls, lt);
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-distFromCenter, -distFromCenter, 0);
        this.leg.display(ls, lt);
        this.scene.popMatrix();

    }

}
