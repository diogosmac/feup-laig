class MyOBJModel extends CGFobject {
    constructor(scene, id, url, scale, rotate) {
        super(scene);
        this.id = id;
        this.obj = new CGFOBJModel(this.scene, url);
        this.scale = scale;
        this.rotate = rotate;
    }


    display(ls, lt) {
        this.scene.pushMatrix();
        this.scene.scale(this.scale, this.scale, this.scale);
        this.scene.rotate(this.rotate, 0, 1, 0);
        this.obj.display();
        this.scene.popMatrix();
    }
}