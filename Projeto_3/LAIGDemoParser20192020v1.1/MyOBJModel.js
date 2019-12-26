class MyOBJModel extends CGFobject {
    constructor(scene, id, url, scale, rotate, offsetHeight) {
        super(scene);
        this.id = id;
        this.obj = new CGFOBJModel(this.scene, url);
        this.scale = scale;
        this.rotate = rotate;
        this.offsetHeight = offsetHeight;
    }


    display(ls, lt) {
        this.scene.pushMatrix();
        this.scene.translate(0, this.offsetHeight, 0);
        this.scene.rotate(this.rotate, 0, 1, 0);
        this.scene.scale(this.scale, this.scale, this.scale);
        this.obj.display();
        this.scene.popMatrix();
    }
}