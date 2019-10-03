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
        this.leafIDs = [];
        this.nodeIDs = [];
        this.materialIDs = [];
        this.currMaterialIndex = 0;
        this.textureID;
        this.length_s;
        this.length_t;
        this.transfMatrix = mat4.create();
        mat4.identity(this.transfMatrix); // creates identity matrix for the transformations

        this.loaded = false; // indicates if the node is initialized or not
    }

    addLeafID(leafID) {
        this.leafIDs.push(leafID);
    }

    addNodeID(nodeID) {
        this.nodeIDs.push(nodeID);
    }

    addMaterialId(materialID) {
        this.materialIDs.push(materialID);
    }

    changeCurrMaterial() {
        currMaterialIndex++;
        if(currMaterialIndex >= materialIDs.length)
            currMaterialIndex = 0;
    }

    setTextureID(textureID) {
        this.textureID = textureID;
    }

    setTextureLengths(length_s, length_t) {
        this.length_s = length_s;
        this.length_t = length_t;
    }

    setTransfMatrix(transfMatrix) {
        this.transfMatrix = transfMatrix;
    }
}