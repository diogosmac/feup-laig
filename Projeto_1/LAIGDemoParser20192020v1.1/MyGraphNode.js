/**
 * MyGraphNode
 * @constructor
 * @param graph - Reference to MySceneGraph object
 * @param id - ID of the node
 */
class MyGraphNode {

    constructor(graph, id) {
        this.graph = graph;
        this.id = id;
        this.leafs = [];
        this.childNodes = [];
        this.materials = [];
        this.currMaterialIndex = 0;
        this.texture;
        this.length_s;
        this.length_t;
        this.transfMatrix = mat4.create();
        mat4.identity(this.transfMatrix); // creates identity matrix for the transformations

        this.loaded = false; // indicates if the node is initialized or not
    }

    addLeaf(leaf) {
        this.leafs.push(leaf);
    }

    addNode(node) {
        this.childNodes.push(node);
    }

    addMaterial(material) {
        this.materials.push(material);
    }

    changeCurrMaterial() {
        this.currMaterialIndex++;
        if(this.currMaterialIndex >= materials.length)
            this.currMaterialIndex = 0;
    }

    setTexture(texture) {
        this.texture = texture;
    }

    setTextureLengths(length_s, length_t) {
        this.length_s = length_s;
        this.length_t = length_t;
    }

    setTransfMatrix(transfMatrix) {
        this.transfMatrix = transfMatrix;
    }
}