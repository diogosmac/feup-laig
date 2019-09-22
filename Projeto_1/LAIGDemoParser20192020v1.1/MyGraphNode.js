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
}