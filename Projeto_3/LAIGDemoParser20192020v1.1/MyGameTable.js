/**
 * MyRectangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param x - X position of the center of the table
 * @param y - Y position of the center of the table
 * @param side - length of the side of the table
 * @param height - height of the table
 */

class MyGameTable extends CGFobject {

    constructor(scene, id, x, y, side, thicc, height) {

        super(scene);
        this.id = id;
        this.x = x;
        this.y = y;
        this.side = side;
        this.thicc = thicc;
        this.height = height;
        this.nDivs = 30;
        this.initBuffers();

    }

    makeToup() {

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

    makeBottom() {

        var points = [
            // U = 0
            [   // V = 0, 1
                [this.x + (this.side / 2), this.y - (this.side / 2), this.height - this.thicc, 1.0],
                [this.x + (this.side / 2), this.y + (this.side / 2), this.height - this.thicc, 1.0],
            ],
            // U = 1
            [   // V = 0, 1
                [this.x - (this.side / 2), this.y - (this.side / 2), this.height - this.thicc, 1.0],
                [this.x - (this.side / 2), this.y + (this.side / 2), this.height - this.thicc, 1.0],
            ]
        ];

        var surf = new CGFnurbsSurface(1, 1, points);
        this.bottom = new CGFnurbsObject(this.scene, this.nDivs, this.nDivs, surf);

    }

    makeSide() {

        var points = [
            // U = 0
            [   // V = 0, 1
                [this.x + (this.side / 2), this.y + (this.side / 2), this.height, 1.0],
                [this.x - (this.side / 2), this.y + (this.side / 2), this.height, 1.0],
            ],
            // U = 1
            [   // V = 0, 1
                [this.x + (this.side / 2), this.y + (this.side / 2), this.height - this.thicc, 1.0],
                [this.x - (this.side / 2), this.y + (this.side / 2), this.height - this.thicc, 1.0],
            ]
        ];
        var surf = new CGFnurbsSurface(1, 1, points);
        var sideDivs = Math.round((this.thicc / this.height) * this.nDivs);
        this.sidePanel = new CGFnurbsObject(this.scene, sideDivs, this.nDivs, surf);

    }

    makeLeg() {

        var legRadius = this.side / 20;
        var legSlices = 10;
        var legStacks = 20;
        this.leg = new NurbCylinder(
            this.scene, null, legRadius, legRadius, 
            this.height - this.thicc, legSlices, legStacks);
        
    }

    initBuffers() {
        this.makeToup();
        this.makeBottom();
        this.makeSide();
        this.makeLeg();
        console.log(this.leg);
    }

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
