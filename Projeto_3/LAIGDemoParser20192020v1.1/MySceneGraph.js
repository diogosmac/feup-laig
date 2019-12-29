var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var GLOBALS_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var ANIMATIONS_INDEX = 7
var PRIMITIVES_INDEX = 8;
var TEMPLATES_INDEX = 9;
var COMPONENTS_INDEX = 10;

const ALL_PRIMITIVES = [
    'rectangle',
    'triangle',
    'cylinder',
    'sphere',
    'torus',
    'plane',
    'patch',
    'cylinder2',
    'gametable',
    'nurbscube',
    'rectangleXZ',
    'objmodel'
];

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;


        this.nodes = [];
        this.views = [];
        this.lights = [];
        this.primitives = [];
        this.materials = [];
        this.textures = [];
        this.transformations = [];
        this.animations = [];
        this.templates = [];

        this.idRoot = null;                    // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        this.defaultMaterial = new CGFappearance(this.scene);
        this.defaultMaterial.setShininess(1);
        this.defaultMaterial.setAmbient(0, 0, 0, 1);
        this.defaultMaterial.setDiffuse(0.5, 0.5, 0.5, 1);
        this.defaultMaterial.setSpecular(0, 0, 0, 1);
        this.defaultMaterial.setEmission(0, 0, 0, 1);

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lxs")
            return "root tag <lxs> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <scene>
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order " + index);

            // Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            // Parse views block
            if ((error = this.parseView(nodes[index])) != null)
                return error;
        }

        // <globals>
        if ((index = nodeNames.indexOf("globals")) == -1)
            return "tag <globals> missing";
        else {
            if (index != GLOBALS_INDEX)
                this.onXMLMinorError("tag <globals> out of order");

            // Parse ambient block
            if ((error = this.parseAmbient(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            // Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            // Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            // Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            // Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        if ((index = nodeNames.indexOf("animations")) == -1)
            return "tag <animations> missing";
        else {
            if (index != ANIMATIONS_INDEX)
                this.onXMLMinorError("tag <animations> out of order");

            if ((error = this.parseAnimations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            // Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }


        // <templates>
        if ((index = nodeNames.indexOf("templates")) == -1)
            return "tag <templates> missing";
        else {
            if (index != TEMPLATES_INDEX)
                this.onXMLMinorError("tag <templates> out of order");

            // Parse primitives block
            if ((error = this.parseTemplates(nodes[index])) != null)
                return error;
        }


        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            // Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
        this.log("all parsed");
    }

    /**
     * Parses the <scene> block. 
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {

        // Get root of the scene.
        var root = this.reader.getString(sceneNode, 'root')
        if (root == null)
            return "no root defined for scene";

        this.idRoot = root;

        // Get axis length        
        var axis_length = this.reader.getFloat(sceneNode, 'axis_length');
        if (axis_length == null || isNaN(axis_length))
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed scene");
        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseView(viewsNode) {

        var viewsCounter = 0;

        var defaultViewID = this.reader.getString(viewsNode, 'default');
        if (defaultViewID == null)
            return "No default view specified";
            
        var children = viewsNode.children;
        
        var grandChildren = [];

        for(var i = 0; i < children.length; i++) {

            if (children[i].nodeName == "perspective") {

                var viewID = this.reader.getString(children[i], 'id');
                if (viewID == null)
                    return "No ID specified for this view";

                if (this.views[viewID] != null)
                    return "ID must be unique for each view (conflict: ID = " + viewID + ")";

                
                var near = this.reader.getFloat(children[i], 'near');
                if (!(near != null && !isNaN(near) && near > 0))
                    return "unable to parse 'near' value of the view for ID = " + viewID;

                var far = this.reader.getFloat(children[i], 'far');
                if (!(far != null && !isNaN(far) && far > near))
                    return "unable to parse 'far' value of the view for ID = " + viewID;
                    
                var fov = this.reader.getFloat(children[i], 'angle')
                if (!(fov != null && !isNaN(fov)))
                    return "unable to parse 'angle' value of the view for ID = " + viewID;

                fov *= DEGREE_TO_RAD;


                grandChildren = children[i].children;

                var nodeNames = [];

                for(var j = 0; j < grandChildren.length; j++)
                    nodeNames.push(grandChildren[j].nodeName);

                var fromIndex = nodeNames.indexOf("from");
                var toIndex = nodeNames.indexOf("to");

                if (fromIndex == -1)
                    return "'from' values not specified in the view with ID = " + viewID;

                if (toIndex == -1)
                    return "'to' values not specified in the view with ID = " + viewID;

                var position = this.parseCoordinates3D(grandChildren[fromIndex], "'from' values in the view with ID = " + viewID);
                if (!Array.isArray(position))
                    return position;

                var target = this.parseCoordinates3D(grandChildren[toIndex], "'to' values in the view with ID = " + viewID);
                if (!Array.isArray(target))
                    return target;


                this.views[viewID] = new CGFcamera(fov, near, far, position, target);
                viewsCounter++;

            }
            else if (children[i].nodeName == 'ortho') {

                var viewID = this.reader.getString(children[i], 'id');
                if (viewID == null)
                    return "No ID specified for this view";

                if (this.views[viewID] != null)
                    return "ID must be unique for each view (conflict: ID = " + viewID + ")";

                
                var near = this.reader.getFloat(children[i], 'near');
                if (!(near != null && !isNaN(near)))
                    return "unable to parse 'near' value of the view for ID = " + viewID;

                var far = this.reader.getFloat(children[i], 'far');
                if (!(far != null && !isNaN(far)))
                    return "unable to parse 'far' value of the view for ID = " + viewID;
                    
                var left = this.reader.getFloat(children[i], 'left');
                if (!(left != null && !isNaN(left)))
                    return "unable to parse 'left' value of the view for ID = " + viewID;

                var right = this.reader.getFloat(children[i], 'right');
                if (!(right != null && !isNaN(right)))
                    return "unable to parse 'right' value of the view for ID = " + viewID;

                var top = this.reader.getFloat(children[i], 'top');
                if (!(top != null && !isNaN(top)))
                    return "unable to parse 'top' value of the view for ID = " + viewID;

                var bottom = this.reader.getFloat(children[i], 'bottom');
                if (!(bottom != null && !isNaN(bottom)))
                    return "unable to parse 'bottom' value of the view for ID = " + viewID;

                grandChildren = children[i].children;

                var nodeNames = [];

                for(var j = 0; j < grandChildren.length; j++)
                    nodeNames.push(grandChildren[j].nodeName);

                var fromIndex = nodeNames.indexOf("from");
                var toIndex = nodeNames.indexOf("to");
                var upIndex = nodeNames.indexOf("up");

                if (fromIndex == -1)
                    return "'from' values not specified in the view with ID = " + viewID;

                if (toIndex == -1)
                    return "'to' values not specified in the view with ID = " + viewID;

                var position = this.parseCoordinates3D(grandChildren[fromIndex], "'from' values in the view with ID = " + viewID);
                if (!Array.isArray(position))
                    return position;

                var target = this.parseCoordinates3D(grandChildren[toIndex], "'to' values in the view with ID = " + viewID);
                if (!Array.isArray(target))
                    return target;

                var up;

                if (upIndex == -1)
                    up = [0, 1, 0]; // default value
                else {
                    up = this.parseCoordinates3D(grandChildren[upIndex], "'up' values in the view with ID = " + viewID);
                    if (!Array.isArray(up))
                        return up;
                }

                this.views[viewID] = new CGFcameraOrtho(left, right, bottom, top, near, far, position, target, up);
                viewsCounter++;

            }
            else {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
            }

        }


        if (viewsCounter < 1)
            return "no views defined in the XML file";

        if (this.views[defaultViewID] == null)
            return "ID given for the default view doesn't exist";

        this.scene.activeCameraID = defaultViewID;
        this.scene.activeSecCameraID = defaultViewID;

        this.log("Parsed views");
        return null;
    }

    /**
     * Parses the <ambient> node.
     * @param {ambient block element} ambientsNode
     */
    parseAmbient(ambientsNode) {

        var children = ambientsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        if (ambientIndex == -1)
            return "Ambient illumination not specified";

        if (backgroundIndex == -1)
            return "Background illumination not specified";

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;


        this.log("Parsed ambient");
        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {

        var children = lightsNode.children;

        var numLights = 0;

        var grandChildren = [];

        
        var attributeNames = [];
        var attributeTypes = [];
        attributeNames.push(...["location", "ambient", "diffuse", "specular", "attenuation"]);
        attributeTypes.push(...["position", "color", "color", "color", "float"]);

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];

            // Check type of light
            if (children[i].nodeName != "omni" && children[i].nodeName != "spot") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            // Light enable/disable
            var enableLight = this.reader.getBoolean(children[i], 'enabled');
            if (!(enableLight != null && (enableLight == true || enableLight == false)))
                return "unable to parse value component of the 'enable light' field for ID = " + lightId;

            global.push(enableLight);
            global.push(children[i].nodeName); // to know if it is omni or spot

            grandChildren = children[i].children;
            // Specifications for the current light.

            var nodeNames = [];

            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {

                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {

                    var aux = [];

                    if (attributeTypes[j] == "position") {
                        aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID = " + lightId);
                    }
                    else if (attributeNames[j] == "attenuation") {
                        var constant = this.reader.getFloat(grandChildren[attributeIndex], 'constant');
                        if (!(constant != null && !isNaN(constant) && constant >= 0 && constant <= 1))
                            return "unable to parse value component of the 'constant' field for ID = " + lightId;
                        aux.push(constant);

                        var linear = this.reader.getFloat(grandChildren[attributeIndex], 'linear');
                        if (!(linear != null && !isNaN(linear) && linear >= 0 && linear <= 1))
                           return "unable to parse value component of the 'linear' field for ID = " + lightId;
                        aux.push(linear);

                        var quadratic = this.reader.getFloat(grandChildren[attributeIndex], 'quadratic');
                        if (!(quadratic != null && !isNaN(quadratic) && quadratic >= 0 && quadratic <= 1))
                            return "unable to parse value component of the 'quadratic' field for ID = " + lightId;
                        aux.push(quadratic);
                    }
                    else
                        aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID = " + lightId);

                    if (!Array.isArray(aux))
                        return aux;

                    global.push(aux);
                }
                else
                    return "light " + attributeNames[j] + " undefined for ID = " + lightId;
            }

            // Gets the additional attributes of the spot light
            if (children[i].nodeName == "spot") {
                var angle = this.reader.getFloat(children[i], 'angle');
                if (!(angle != null && !isNaN(angle)))
                    return "unable to parse angle of the light for ID = " + lightId;

                    
                var exponent = this.reader.getFloat(children[i], 'exponent');
                if (!(exponent != null && !isNaN(exponent)))
                    return "unable to parse exponent of the light for ID = " + lightId;

                var targetIndex = nodeNames.indexOf("target");

                // Retrieves the light target.
                var targetLight = [];
                if (targetIndex != -1) {
                    var aux = this.parseCoordinates3D(grandChildren[targetIndex], "target light for ID " + lightId);
                    if (!Array.isArray(aux))
                        return aux;

                    targetLight = aux;
                }
                else
                    return "light target undefined for ID = " + lightId;

                global.push(...[angle, exponent, targetLight]);
            }

            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");


        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {

        var texturesCounter = 0;

        var children = texturesNode.children;

        for(var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "texture") {
                    this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                    continue;
            }

            var textureID = this.reader.getString(children[i], 'id');
            if (textureID == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.textures[textureID] != null)
                return "ID must be unique for each texture (conflict: ID = " + textureID + ")";

            var fileName = this.reader.getString(children[i], 'file');
            if (fileName == null)
                return "no file defined for texture";

            var newTexture = new CGFtexture(this.scene, fileName);

            this.textures[textureID] = newTexture;
            texturesCounter++;
        }


        if (texturesCounter < 1)
            return "no textures defined in the XML file";

        this.log("Parsed textures");
        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {

        var materialCounter = 0;

        var children = materialsNode.children;

        var nodeNames = [];
        
        // Any number of materials.
        for (var i = 0; i < children.length; i++) {
            
            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            
            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
            return "no ID defined for material";
            
            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each material (conflict: ID = " + materialID + ")";
        
            var newMaterial = new CGFappearance(this.scene);

            var shininess = this.reader.getFloat(children[i], 'shininess');
            if (!(shininess != null && !isNaN(shininess) && shininess > 0))
                return "unable to parse shininess of material with ID = " + materialID;

            newMaterial.setShininess(shininess);

            var grandChildren = children[i].children;

            for(var j = 0; j < grandChildren.length; j++)
                nodeNames.push(grandChildren[j].nodeName);

            var emissionIndex = nodeNames.indexOf("emission");
            var ambientIndex = nodeNames.indexOf("ambient");
            var diffuseIndex = nodeNames.indexOf("diffuse");
            var specularIndex = nodeNames.indexOf("specular");

            if (emissionIndex == -1)
                return "no emission value specified for material with ID = " + materialID;
            else {
                var emissionValues = this.parseColor(grandChildren[emissionIndex], "emission for material with ID = " + materialID);
                if (!Array.isArray(emissionValues))
                    return emissionValues;

                newMaterial.setEmission(emissionValues[0], emissionValues[1], emissionValues[2], emissionValues[3]);
            }

            if (ambientIndex == -1)
                return "no ambient value specified for material with ID = " + materialID;
            else {
                var ambientValues = this.parseColor(grandChildren[ambientIndex], "ambient for material with ID = " + materialID);
                if (!Array.isArray(ambientValues))
                    return ambientValues;

                newMaterial.setAmbient(ambientValues[0], ambientValues[1], ambientValues[2], ambientValues[3]);
            }

            if (diffuseIndex == -1)
                return "no diffuse value specified for material with ID = " + materialID;
            else {
                var diffuseValues = this.parseColor(grandChildren[diffuseIndex], "diffuse for material with ID = " + materialID);
                if (!Array.isArray(diffuseValues))
                    return diffuseValues;

                newMaterial.setDiffuse(diffuseValues[0], diffuseValues[1], diffuseValues[2], diffuseValues[3]);
            }

            if (specularIndex == -1)
                return "no specular value specified for material with ID = " + materialID;
            else {
                var specularValues = this.parseColor(grandChildren[specularIndex], "specular for material with ID = " + materialID);
                if (!Array.isArray(specularValues))
                    return specularValues;

                newMaterial.setSpecular(specularValues[0], specularValues[1], specularValues[2], specularValues[3]);
            }
            
            this.materials[materialID] = newMaterial;
            materialCounter++;         
        }

        if (materialCounter < 1)
            return "no materials defined in the XML file";


        this.log("Parsed materials");
        return null;
    }

    /**
     * Parses the <transformations> block.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {

        var transfCounter = 0;

        var children = transformationsNode.children;

        var grandChildren = [];

        // Any number of transformations.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "transformation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current transformation.
            var transformationID = this.reader.getString(children[i], 'id');
            if (transformationID == null)
                return "no ID defined for transformation";

            // Checks for repeated IDs.
            if (this.transformations[transformationID] != null)
                return "ID must be unique for each transformation (conflict: ID = " + transformationID + ")";

            grandChildren = children[i].children;
            // Specifications for the current transformation.

            var transfMatrix = mat4.create();

            var atLeastOneTransformation = false;

            for (var j = 0; j < grandChildren.length; j++) {

                switch (grandChildren[j].nodeName) {

                    case 'translate':
                        atLeastOneTransformation = true;
                        var coordinates = this.parseCoordinates3D(grandChildren[j], "translate transformation for ID = " + transformationID);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);
                        break;

                    case 'scale':
                        atLeastOneTransformation = true;
                        var coordinates = this.parseCoordinates3D(grandChildren[j], "scale transformation for ID = " + transformationID);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        transfMatrix = mat4.scale(transfMatrix, transfMatrix, coordinates);
                        break;
    
                    case 'rotate':
                        atLeastOneTransformation = true;
                        var axis = this.reader.getString(grandChildren[j], "axis");
                        if (!(axis != null && (axis == 'x' || axis == 'y' || axis == 'z')))
                            return "unable to parse the axis of a rotation in the transformation with ID = " + transformationID;

                        var angle = this.reader.getFloat(grandChildren[j], "angle");
                        if (!(angle != null && !isNaN(angle)))
                            return "unable to parse the angle of a rotation in the transformation with ID = " + transformationID;

                        angle *= DEGREE_TO_RAD;

                        transfMatrix = mat4.rotate(transfMatrix, transfMatrix, angle, this.axisCoords[axis]);
                        break;

                    default:
                        this.onXMLMinorError("unknown tag <" + grandChildren[j].nodeName + ">");
                        break;

                }

            }

            if (!atLeastOneTransformation)
                return "No valid sub-transformations for transformation with ID = " + transformationID;


            this.transformations[transformationID] = transfMatrix;
            transfCounter++;
        }

        
        if (transfCounter < 1)
            return "no transformations defined in the XML file";


        this.log("Parsed transformations");
        return null;
    }

    /**
     * Parses the <animations> block.
     * @param {animations block element} animationsNode 
     */
    parseAnimations(animationsNode) {

        var children = animationsNode.children;
        var grandChildren = [];
        
        var transformations = [];

        for (var i = 0; i < children.length; i++) {
            
            if (children[i].nodeName != "animation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            var animationID = this.reader.getString(children[i], 'id');
            if (animationID == null)
                return "no ID defined for animation";

            if (this.animations[animationID] != null) {
                return "ID must be unique for each animation (conflict: ID = " + animationID + ")";
            }


            grandChildren = children[i].children;

            if (grandChildren.length == 0)
                return "animation node must have at least one valid keyframe (error on animation with ID = " + animationID + ")";

            var keyframes = [];
            var keyframeCounter = 0;

            for (var j = 0; j < grandChildren.length; j++) {

                if (grandChildren[j].nodeName != "keyframe") {
                    this.onXMLMinorError("unknown tag <" + grandChildren[j].nodeName + ">");
                    continue;
                }

                var instant = this.reader.getFloat(grandChildren[j], 'instant');
                if (!(instant != null && !isNaN(instant) && instant > 0))
                    return "no valid instant defined for keyframe (animation ID = " + animationID + ")";

                if (keyframeCounter > 0)
                    if (keyframes[keyframeCounter - 1].instant >= instant)
                        return "at least one invalid instant in sequence of keyframes for animationID = " + animationID;



                transformations = grandChildren[j].children;

                if(transformations.length != 3)
                    return "a keyframe in animation " + animationID + " has an invalid transformations block";


                if (transformations[0].nodeName != "translate")
                    return "no \"translate\" block in keyframe of animation (ID = " + animationID + ")";

                var translateCoords = this.parseCoordinates3D(transformations[0], "translate transformation for animation with ID = " + animationID);
                if (!Array.isArray(translateCoords))
                    return translateCoords;


                if (transformations[1].nodeName != "rotate")
                    return "no \"rotate\" block in keyframe of animation (ID = " + animationID + ")";

                var rotationValues = [];

                var rotationAngleX = this.reader.getFloat(transformations[1], 'angle_x');
                if (!(rotationAngleX != null && !isNaN(rotationAngleX)))
                    return "no angle for rotation on X-axis from keyframe of animation with ID = " + animationID;

                rotationValues.push(rotationAngleX * DEGREE_TO_RAD);

                var rotationAngleY = this.reader.getFloat(transformations[1], 'angle_y');
                if (!(rotationAngleY != null && !isNaN(rotationAngleY)))
                    return "no angle for rotation on Y-axis from keyframe of animation with ID = " + animationID;
    
                rotationValues.push(rotationAngleY * DEGREE_TO_RAD);

                var rotationAngleZ = this.reader.getFloat(transformations[1], 'angle_z');
                if  (!(rotationAngleZ != null && !isNaN(rotationAngleZ)))
                    return "no angle for rotation on Z-axis from keyframe of animation with ID = " + animationID;
                    
                rotationValues.push(rotationAngleZ * DEGREE_TO_RAD);

                if (transformations[2].nodeName != "scale")
                    return "no \"translate\" block in keyframe of animation (ID = " + animationID + ")";

                var scaleCoords = this.parseCoordinates3D(transformations[2], "scale transformation for animation with ID = " + animationID);
                if (!Array.isArray(scaleCoords))
                    return scaleCoords;

                var keyframe = new MyKeyframe(translateCoords, rotationValues, scaleCoords, instant);


                keyframes.push(keyframe);
                keyframeCounter++;
            }

            if(keyframeCounter == 0)
                return "animation node must have at least one valid keyframe (error on animation with ID = " + animationID + ")";

            this.animations[animationID] = new KeyframeAnimation(this.scene, keyframes);

        }
    }

    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {

        var primitiveCounter = 0;

        var children = primitivesNode.children;

        var grandChildren = [];

        // Any number of primitives.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "primitive") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current primitive.
            var primitiveId = this.reader.getString(children[i], 'id');
            if (primitiveId == null)
                return "no ID defined for primitive";

            // Checks for repeated IDs.
            if (this.primitives[primitiveId] != null)
                return "ID must be unique for each primitive (conflict: ID = " + primitiveId + ")";

            grandChildren = children[i].children;

            // Validate the primitive type
            if (!(grandChildren.length == 1 && 
            ALL_PRIMITIVES.includes(grandChildren[0].nodeName)))
                return "There must be exactly 1 primitive type (rectangle, triangle, cylinder, sphere, torus, plane, patch or cylinder2)";

            // Specifications for the current primitive.
            var primitiveType = grandChildren[0].nodeName;

            // Retrieves the primitive coordinates.

            // For the rectangle primitive
            if (primitiveType == 'rectangle') {
                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2) && x2 > x1))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2) && y2 > y1))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                var rect = new MyRectangle(this.scene, primitiveId, x1, x2, y1, y2);

                this.primitives[primitiveId] = rect;
                primitiveCounter++;
            }

            // For the triangle primitive
            else if (primitiveType == 'triangle') {
                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // z1
                var z1 = this.reader.getFloat(grandChildren[0], 'z1');
                if (!(z1 != null && !isNaN(z1)))
                    return "unable to parse z1 of the primitive coordinates for ID = " + primitiveId;

                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2)))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2)))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                // z2
                var z2 = this.reader.getFloat(grandChildren[0], 'z2');
                if (!(z2 != null && !isNaN(z2)))
                    return "unable to parse z2 of the primitive coordinates for ID = " + primitiveId; 
                    
                // x3
                var x3 = this.reader.getFloat(grandChildren[0], 'x3');
                if (!(x3 != null && !isNaN(x3)))
                    return "unable to parse x3 of the primitive coordinates for ID = " + primitiveId;
                    
                // y3
                var y3 = this.reader.getFloat(grandChildren[0], 'y3');
                if (!(y3 != null && !isNaN(y3)))
                    return "unable to parse y3 of the primitive coordinates for ID = " + primitiveId;

                // z3
                var z3 = this.reader.getFloat(grandChildren[0], 'z3');
                if (!(z3 != null && !isNaN(z3)))
                    return "unable to parse z3 of the primitive coordinates for ID = " + primitiveId;

                var triang = new MyTriangle(this.scene, primitiveId, x1, y1, z1, x2, y2, z2, x3, y3, z3);

                this.primitives[primitiveId] = triang;
                primitiveCounter++;
            }

            // For the cylinder primitive
            else if (primitiveType == 'cylinder') {
                // base
                var base = this.reader.getFloat(grandChildren[0], 'base');
                if (!(base != null && !isNaN(base) && base >= 0))
                    return "unable to parse base of the primitive coordinates for ID = " + primitiveId;

                // top
                var top = this.reader.getFloat(grandChildren[0], 'top');
                if (!(top != null && !isNaN(top) && top >= 0))
                    return "unable to parse top of the primitive coordinates for ID = " + primitiveId;

                // height
                var height = this.reader.getFloat(grandChildren[0], 'height');
                if (!(height != null && !isNaN(height) && height > 0))
                    return "unable to parse height of the primitive coordinates for ID = " + primitiveId;

                // slices
                var slices = this.reader.getInteger(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices) && slices > 1))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                // stacks
                var stacks = this.reader.getInteger(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks) && stacks > 0))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

                var cylind = new MyCylinder(this.scene, primitiveId, base, top, height, slices, stacks);

                this.primitives[primitiveId] = cylind;
                primitiveCounter++;
            }

            // For the sphere primitive
            else if (primitiveType == 'sphere') {
                // radius
                var radius = this.reader.getFloat(grandChildren[0], 'radius');
                if (!(radius != null && !isNaN(radius) && radius > 0))
                    return "unable to parse radius of the primitive coordinates for ID = " + primitiveId;

                // slices
                var slices = this.reader.getInteger(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices) && slices > 1))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                // stacks
                var stacks = this.reader.getInteger(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks) && stacks > 1))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

                var sph = new MySphere(this.scene, primitiveId, radius, slices, stacks);

                this.primitives[primitiveId] = sph;
                primitiveCounter++;
            }

            // For the torus primitive
            else if (primitiveType == 'torus') {
                // inner
                var inner = this.reader.getFloat(grandChildren[0], 'inner');
                if (!(inner != null && !isNaN(inner) && inner > 0))
                    return "unable to parse inner of the primitive coordinates for ID = " + primitiveId;

                // outer
                var outer = this.reader.getFloat(grandChildren[0], 'outer');
                if (!(outer != null && !isNaN(outer) && outer > 0))
                    return "unable to parse outer of the primitive coordinates for ID = " + primitiveId;

                // slices
                var slices = this.reader.getInteger(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices) && slices > 1))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                // loops
                var loops = this.reader.getInteger(grandChildren[0], 'loops');
                if (!(loops != null && !isNaN(loops) && loops > 2))
                    return "unable to parse loops of the primitive coordinates for ID = " + primitiveId;

                var tor = new MyTorus(this.scene, primitiveId, inner, outer, slices, loops);

                this.primitives[primitiveId] = tor;
                primitiveCounter++;
            }

            else if (primitiveType == 'plane') {

                var nPartsU = this.reader.getInteger(grandChildren[0], 'npartsU');
                if (!(nPartsU != null && !isNaN(nPartsU) && nPartsU >= 1))
                    return "unable to parse npartsU of the primitive coordinates for ID = " + primitiveId;

                var nPartsV = this.reader.getInteger(grandChildren[0], 'npartsV');
                if (!(nPartsV != null && !isNaN(nPartsV) && nPartsV >= 1))
                    return "unable to parse npartsV of the primitive coordinates for ID = " + primitiveId;


                var obj = new Plane(this.scene, primitiveId, nPartsU, nPartsV);

                this.primitives[primitiveId] = obj;
                primitiveCounter++;
            }

            else if (primitiveType == 'patch') {

                var nPointsU = this.reader.getInteger(grandChildren[0], 'npointsU');
                if (!(nPointsU != null && !isNaN(nPointsU) && nPointsU >= 1))
                    return "unable to parse npointsU of the primitive coordinates for ID = " + primitiveId;

                var nPointsV = this.reader.getInteger(grandChildren[0], 'npointsV');
                if (!(nPointsV != null && !isNaN(nPointsV) && nPointsV >= 1))
                    return "unable to parse npointsV of the primitive coordinates for ID = " + primitiveId;

                var nPartsU = this.reader.getInteger(grandChildren[0], 'npartsU');
                if (!(nPartsU != null && !isNaN(nPartsU) && nPartsU >= 1))
                    return "unable to parse npartsU of the primitive coordinates for ID = " + primitiveId;
    
                var nPartsV = this.reader.getInteger(grandChildren[0], 'npartsV');
                if (!(nPartsV != null && !isNaN(nPartsV) && nPartsV >= 1))
                    return "unable to parse npartsV of the primitive coordinates for ID = " + primitiveId;

                var controlPointNodes = grandChildren[0].children;

                var controlPoints = [];

                if (controlPointNodes.length != (nPointsU * nPointsV))
                    return "incorrect number of control points for primitive with ID = " + primitiveId;

                var controlPointNodesCounter = 0;

                for (var u = 0; u < nPointsU; u++) {

                    var u_points = [];

                    for (var v = 0; v < nPointsV; v++) {

                        var j = u * nPointsV + v;

                        if (controlPointNodes[j].nodeName != "controlpoint") {
                            this.onXMLMinorError("unknown tag <" + controlPointNodes[j].nodeName + ">");
                            continue;
                        }
    
                        controlPointNodesCounter++;
    
                        var controlPoint = this.parseControlPoint(controlPointNodes[j], "Error parsing control points for patch primitive with ID = " + primitiveId);
                        if (!Array.isArray(controlPoint))
                            return controlPoint;
    
                        u_points.push(controlPoint);
    
                    }

                    controlPoints.push(u_points);

                }

                if(controlPointNodesCounter != (nPointsU * nPointsV))
                    return "incorrect number of control points for primitive with ID = " + primitiveId;


                var obj = new Patch(this.scene, primitiveId, nPointsU, nPointsV, nPartsU, nPartsV, controlPoints);
                
                this.primitives[primitiveId] = obj;
                primitiveCounter++;

            }

            else if (primitiveType == 'cylinder2') {

                // base
                var base = this.reader.getFloat(grandChildren[0], 'base');
                if (!(base != null && !isNaN(base) && base >= 0))
                    return "unable to parse base of the primitive coordinates for ID = " + primitiveId;
                
                // top
                var top = this.reader.getFloat(grandChildren[0], 'top');
                if (!(top != null && !isNaN(top) && top >= 0))
                    return "unable to parse top of the primitive coordinates for ID = " + primitiveId;
                
                // height
                var height = this.reader.getFloat(grandChildren[0], 'height');
                if (!(height != null && !isNaN(height) && height > 0))
                    return "unable to parse height of the primitive coordinates for ID = " + primitiveId;
                
                // slices
                var slices = this.reader.getInteger(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices) && slices > 1))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;
                
                // stacks
                var stacks = this.reader.getInteger(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks) && stacks > 0))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;
                
                    
                var obj = new NurbCylinder(this.scene, primitiveId, base, top, height, slices, stacks);

                this.primitives[primitiveId] = obj;
                primitiveCounter++;
            
            }

            else if (primitiveType == 'gametable') {

                var x = this.reader.getFloat(grandChildren[0], 'x');
                if (!(x != null && !isNaN(x)))
                    return "unable to parse x position of the primitive coordinates for ID = " + primitiveId;

                var y = this.reader.getFloat(grandChildren[0], 'y');
                if (!(y != null && !isNaN(y)))
                    return "unable to parse y position of the primitive coordinates for ID = " + primitiveId;

                var side = this.reader.getFloat(grandChildren[0], 'side');
                if (!(side != null && !isNaN(side)))
                    return "unable to parse side dimension of the primitive coordinates for ID = " + primitiveId;

                var thickness = this.reader.getFloat(grandChildren[0], 'thickness');
                if (!(thickness != null && !isNaN(thickness)))
                    return "unable to parse thickness dimension of the primitive coordinates for ID = " + primitiveId;

                    var height = this.reader.getFloat(grandChildren[0], 'height');
                if (!(height != null && !isNaN(height)))
                    return "unable to parse height dimension of the primitive coordinates for ID = " + primitiveId;

                var obj = new MyGameTable(this.scene, primitiveId, x, y, side, thickness, height);

                this.primitives[primitiveId] = obj;
                primitiveCounter++;
            }

            else if (primitiveType == "nurbscube") {
                var side = this.reader.getFloat(grandChildren[0], 'side');
                if (!(side != null && !isNaN(side) && side > 0))
                    return "unable to parse side of the primitive coordinates for ID = " + primitiveId;

                var thickness = this.reader.getFloat(grandChildren[0], 'thickness');
                if (!(thickness != null && !isNaN(thickness) && thickness > 0))
                    return "unable to parse thickness of the primitive coordinates for ID = " + primitiveId;

                var obj = new MyNurbsCube(this.scene, primitiveId, side, thickness);

                this.primitives[primitiveId] = obj;
                primitiveCounter++;
            }

            else if (primitiveType == "rectangleXZ") {
                    // x1
                    var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                    if (!(x1 != null && !isNaN(x1)))
                        return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;
    
                    // y1
                    var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                    if (!(y1 != null && !isNaN(y1)))
                        return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;
    
                    // x2
                    var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                    if (!(x2 != null && !isNaN(x2) && x2 > x1))
                        return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;
    
                    // y2
                    var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                    if (!(y2 != null && !isNaN(y2) && y2 > y1))
                        return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;
    
                    var rect = new MyRectangleXZ(this.scene, primitiveId, x1, x2, y1, y2);
    
                    this.primitives[primitiveId] = rect;
                    primitiveCounter++;
            }

            else if (primitiveType == 'objmodel') {
                var url = this.reader.getString(grandChildren[0], 'url');
                if (!(url != null))
                    return "unable to parse url for ID = " + primitiveId;

                var scale = this.reader.getFloat(grandChildren[0], 'scale');
                if (!(scale != null && !isNaN(scale)))
                    return "unable to parse scale for ID = " + primitiveId;

                var rotate = this.reader.getFloat(grandChildren[0], 'rotate');
                if (!(rotate != null && !isNaN(rotate)))
                    return "unable to parse rotate for ID = " + primitiveId;

                rotate *= DEGREE_TO_RAD;

                var offsetHeight = this.reader.getFloat(grandChildren[0], 'offsetHeight');
                if (!(offsetHeight != null && !isNaN(offsetHeight)))
                    return "unable to parse offsetHeight for ID = " + primitiveId;

                var obj = new MyOBJModel(this.scene, primitiveId, url, scale, rotate, offsetHeight);

                this.primitives[primitiveId] = obj;
                primitiveCounter++;
            }

        }

        if (primitiveCounter < 1)
            return "no primitives defined in the XML file";


        this.log("Parsed primitives");
        return null;
    }


    /**
     * Parses the <templates> block.
     * @param {templates block element} templatesNode
     */
    parseTemplates(templatesNode) {
        
        var children = templatesNode.children;

        var grandChildren = [];

        // Any number of template.
        for (var i = 0; i < children.length; i++) {

            // Specifications for the current template.
            var templateType = children[i].nodeName;

            var currentTemplate;

            // Retrieves the primitive coordinates.

            // For the board template
            if (templateType == 'board') {

                var boardGeometry = this.reader.getString(children[i], 'boardGeometry');
                if (!(boardGeometry != null && this.primitives[boardGeometry] != null))
                    return "unable to parse boardGeometry for template " + templateType;

                boardGeometry = this.primitives[boardGeometry];

                var boardMaterial = this.reader.getString(children[i], 'boardMaterial');
                if (!(boardMaterial != null && this.materials[boardMaterial] != null))
                    return "unable to parse boardMaterial for template " + templateType;

                boardMaterial = this.materials[boardMaterial];

                var boardTexture = this.reader.getString(children[i], 'boardTexture');
                if (!(boardTexture != null && (boardTexture == "none" || (boardTexture != "none" && this.textures[boardTexture] != null))))
                    return "unable to parse boardTexture for template " + templateType;
                
                if(boardTexture == "none")
                    boardTexture = null;
                else    
                    boardTexture = this.textures[boardTexture];


                var tileGeometry = this.reader.getString(children[i], 'tileGeometry');
                if (!(tileGeometry != null && this.primitives[tileGeometry] != null))
                    return "unable to parse tileGeometry for template " + templateType;

                tileGeometry = this.primitives[tileGeometry];


                var tile1Mat = this.reader.getString(children[i], 'tile1Mat');
                if (!(tile1Mat != null && this.materials[tile1Mat] != null))
                    return "unable to parse tile1Mat for template " + templateType;

                tile1Mat = this.materials[tile1Mat];


                var tile1Texture = this.reader.getString(children[i], 'tile1Texture');
                if (!(tile1Texture != null && (tile1Texture == "none" || (tile1Texture != "none" && this.textures[tile1Texture] != null))))
                    return "unable to parse tile1Texture for template " + templateType;
                
                if(tile1Texture == "none")
                    tile1Texture = null;
                else    
                    tile1Texture = this.textures[tile1Texture];


                var tile2Mat = this.reader.getString(children[i], 'tile2Mat');
                if (!(tile2Mat != null && this.materials[tile2Mat] != null))
                    return "unable to parse tile2Mat for template " + templateType;

                tile2Mat = this.materials[tile2Mat];


                var tile2Texture = this.reader.getString(children[i], 'tile2Texture');
                if (!(tile2Texture != null && (tile2Texture == "none" || (tile2Texture != "none" && this.textures[tile2Texture] != null))))
                    return "unable to parse tile2Texture for template " + templateType;
                
                if(tile2Texture == "none")
                    tile2Texture = null;
                else    
                    tile2Texture = this.textures[tile2Texture];
    

                var selectedTileMat = this.reader.getString(children[i], 'selectedTileMat');
                if (!(selectedTileMat != null && this.materials[selectedTileMat] != null))
                    return "unable to parse selectedTileMat for template " + templateType;

                selectedTileMat = this.materials[selectedTileMat];

                var highlightedTileMat = this.reader.getString(children[i], 'highlightedTileMat');
                if (!(highlightedTileMat != null && this.materials[highlightedTileMat] != null))
                    return "unable to parse highlightedTileMat for template " + templateType;

                highlightedTileMat = this.materials[highlightedTileMat];


                currentTemplate = new BoardTemplate(boardGeometry, boardMaterial, boardTexture, tileGeometry,
                                                    tile1Mat, tile1Texture, tile2Mat, tile2Texture,
                                                    selectedTileMat, highlightedTileMat);
            }

            // For the microbe templates
            else if (templateType == 'microbeA' || templateType == 'microbeB') {

                var microbeGeometry = this.reader.getString(children[i], 'microbeGeometry');
                if (!(microbeGeometry != null && this.primitives[microbeGeometry] != null))
                    return "unable to parse microbeGeometry for template " + templateType;

                microbeGeometry = this.primitives[microbeGeometry];

                var microbeMaterial = this.reader.getString(children[i], 'microbeMaterial');
                if (!(microbeMaterial != null && this.materials[microbeMaterial] != null))
                    return "unable to parse microbeMaterial for template " + templateType;

                microbeMaterial = this.materials[microbeMaterial];

                var microbeTexture = this.reader.getString(children[i], 'microbeTexture');
                if (!(microbeTexture != null && (microbeTexture == "none" || (microbeTexture != "none" && this.textures[microbeTexture] != null))))
                    return "unable to parse microbeTexture for template " + templateType;
                
                if(microbeTexture == "none")
                    microbeTexture = null;
                else    
                    microbeTexture = this.textures[microbeTexture];


                currentTemplate = new MicrobeTemplate(microbeGeometry, microbeMaterial, microbeTexture);
            }

            // For the number textures template
            else if (templateType == 'panelNumbers') {

                var numberTexturesArray = [];

                var zero = this.reader.getString(children[i], 'zero');
                if (!(zero != null && this.textures[zero] != null))
                    return "unable to parse zero for template " + templateType;

                numberTexturesArray.push(this.textures[zero]);

                var one = this.reader.getString(children[i], 'one');
                if (!(one != null && this.textures[one] != null))
                    return "unable to parse one for template " + templateType;

                numberTexturesArray.push(this.textures[one]);

                var two = this.reader.getString(children[i], 'two');
                if (!(two != null && this.textures[two] != null))
                    return "unable to parse two for template " + templateType;

                numberTexturesArray.push(this.textures[two]);

                var three = this.reader.getString(children[i], 'three');
                if (!(three != null && this.textures[three] != null))
                    return "unable to parse three for template " + templateType;

                numberTexturesArray.push(this.textures[three]);

                var four = this.reader.getString(children[i], 'four');
                if (!(four != null && this.textures[four] != null))
                    return "unable to parse four for template " + templateType;

                numberTexturesArray.push(this.textures[four]);

                var five = this.reader.getString(children[i], 'five');
                if (!(five != null && this.textures[five] != null))
                    return "unable to parse five for template " + templateType;

                numberTexturesArray.push(this.textures[five]);

                var six = this.reader.getString(children[i], 'six');
                if (!(six != null && this.textures[six] != null))
                    return "unable to parse six for template " + templateType;

                numberTexturesArray.push(this.textures[six]);

                var seven = this.reader.getString(children[i], 'seven');
                if (!(seven != null && this.textures[seven] != null))
                    return "unable to parse seven for template " + templateType;

                numberTexturesArray.push(this.textures[seven]);

                var eight = this.reader.getString(children[i], 'eight');
                if (!(eight != null && this.textures[eight] != null))
                    return "unable to parse eight for template " + templateType;

                numberTexturesArray.push(this.textures[eight]);

                var nine = this.reader.getString(children[i], 'nine');
                if (!(nine != null && this.textures[nine] != null))
                    return "unable to parse nine for template " + templateType;

                numberTexturesArray.push(this.textures[nine]);


                currentTemplate = new NumbersTemplate(numberTexturesArray);
            }

            // For the game panel textures template
            else if (templateType == 'panelGame') {

                var playerATurnTex = this.reader.getString(children[i], 'playerATurnTex');
                if (!(playerATurnTex != null && this.textures[playerATurnTex] != null))
                    return "unable to parse playerATurnTex for template " + templateType;

                playerATurnTex = this.textures[playerATurnTex];

                var playerBTurnTex = this.reader.getString(children[i], 'playerBTurnTex');
                if (!(playerBTurnTex != null && this.textures[playerBTurnTex] != null))
                    return "unable to parse playerBTurnTex for template " + templateType;

                playerBTurnTex = this.textures[playerBTurnTex];

                var rotateTex = this.reader.getString(children[i], 'rotateTex');
                if (!(rotateTex != null && this.textures[rotateTex] != null))
                    return "unable to parse rotateTex for template " + templateType;

                rotateTex = this.textures[rotateTex];

                var scoreATex = this.reader.getString(children[i], 'scoreATex');
                if (!(scoreATex != null && this.textures[scoreATex] != null))
                    return "unable to parse scoreATex for template " + templateType;

                scoreATex = this.textures[scoreATex];

                var scoreBTex = this.reader.getString(children[i], 'scoreBTex');
                if (!(scoreBTex != null && this.textures[scoreBTex] != null))
                    return "unable to parse scoreBTex for template " + templateType;

                scoreBTex = this.textures[scoreBTex];

                var timerTex = this.reader.getString(children[i], 'timerTex');
                if (!(timerTex != null && this.textures[timerTex] != null))
                    return "unable to parse timerTex for template " + templateType;

                timerTex = this.textures[timerTex];

                var undoTex = this.reader.getString(children[i], 'undoTex');
                if (!(undoTex != null && this.textures[undoTex] != null))
                    return "unable to parse undoTex for template " + templateType;

                undoTex = this.textures[undoTex];

                var movieTex = this.reader.getString(children[i], 'movieTex');
                if (!(movieTex != null && this.textures[movieTex] != null))
                    return "unable to parse movieTex for template " + templateType;

                movieTex = this.textures[movieTex];

                currentTemplate = new GamePanelTemplate(playerATurnTex, playerBTurnTex, rotateTex, scoreATex, scoreBTex, timerTex, undoTex, movieTex);
            }

            // For the menu panel textures template
            else if (templateType == 'panelMenu') {

                let allTextures = [];

                var playTex = this.reader.getString(children[i], 'playTex');
                if (!(playTex != null && this.textures[playTex] != null))
                    return "unable to parse playTex for template " + templateType;

                allTextures['playTex'] = this.textures[playTex];

                var timer15Tex = this.reader.getString(children[i], 'timer15Tex');
                if (!(timer15Tex != null && this.textures[timer15Tex] != null))
                    return "unable to parse timer15Tex for template " + templateType;

                allTextures['timer15Tex'] = this.textures[timer15Tex];

                var timer30Tex = this.reader.getString(children[i], 'timer30Tex');
                if (!(timer30Tex != null && this.textures[timer30Tex] != null))
                    return "unable to parse timer30Tex for template " + templateType;

                allTextures['timer30Tex'] = this.textures[timer30Tex];

                var timer60Tex = this.reader.getString(children[i], 'timer60Tex');
                if (!(timer60Tex != null && this.textures[timer60Tex] != null))
                    return "unable to parse timer60Tex for template " + templateType;

                allTextures['timer60Tex'] = this.textures[timer60Tex];

                var backTex = this.reader.getString(children[i], 'backTex');
                if (!(backTex != null && this.textures[backTex] != null))
                    return "unable to parse backTex for template " + templateType;

                allTextures['backTex'] = this.textures[backTex];

                var chooseSceneTex = this.reader.getString(children[i], 'chooseSceneTex');
                if (!(chooseSceneTex != null && this.textures[chooseSceneTex] != null))
                    return "unable to parse chooseSceneTex for template " + templateType;

                allTextures['chooseSceneTex'] = this.textures[chooseSceneTex];

                var cvcTex = this.reader.getString(children[i], 'cvcTex');
                if (!(cvcTex != null && this.textures[cvcTex] != null))
                    return "unable to parse cvcTex for template " + templateType;

                allTextures['cvcTex'] = this.textures[cvcTex];

                var easyTex = this.reader.getString(children[i], 'easyTex');
                if (!(easyTex != null && this.textures[easyTex] != null))
                    return "unable to parse easyTex for template " + templateType;

                allTextures['easyTex'] = this.textures[easyTex];


                var mediumTex = this.reader.getString(children[i], 'mediumTex');
                if (!(mediumTex != null && this.textures[mediumTex] != null))
                    return "unable to parse mediumTex for template " + templateType;

                allTextures['mediumTex'] = this.textures[mediumTex];


                var difficultyTex = this.reader.getString(children[i], 'difficultyTex');
                if (!(difficultyTex != null && this.textures[difficultyTex] != null))
                    return "unable to parse difficultyTex for template " + templateType;

                allTextures['difficultyTex'] = this.textures[difficultyTex];


                var drawTex = this.reader.getString(children[i], 'drawTex');
                if (!(drawTex != null && this.textures[drawTex] != null))
                    return "unable to parse drawTex for template " + templateType;

                allTextures['drawTex'] = this.textures[drawTex];


                var gameOptionsTex = this.reader.getString(children[i], 'gameOptionsTex');
                if (!(gameOptionsTex != null && this.textures[gameOptionsTex] != null))
                    return "unable to parse gameOptionsTex for template " + templateType;

                allTextures['gameOptionsTex'] = this.textures[gameOptionsTex];


                var gameTitleTex = this.reader.getString(children[i], 'gameTitleTex');
                if (!(gameTitleTex != null && this.textures[gameTitleTex] != null))
                    return "unable to parse gameTitleTex for template " + templateType;

                allTextures['gameTitleTex'] = this.textures[gameTitleTex];

                var mainMenuTex = this.reader.getString(children[i], 'mainMenuTex');
                if (!(mainMenuTex != null && this.textures[mainMenuTex] != null))
                    return "unable to parse mainMenuTex for template " + templateType;

                allTextures['mainMenuTex'] = this.textures[mainMenuTex];

                var pvpTex = this.reader.getString(children[i], 'pvpTex');
                if (!(pvpTex != null && this.textures[pvpTex] != null))
                    return "unable to parse pvpTex for template " + templateType;

                allTextures['pvpTex'] = this.textures[pvpTex];

                var pvcTex = this.reader.getString(children[i], 'pvcTex');
                if (!(pvcTex != null && this.textures[pvcTex] != null))
                    return "unable to parse pvcTex for template " + templateType;

                allTextures['pvcTex'] = this.textures[pvcTex];

                var movieTex = this.reader.getString(children[i], 'movieTex');
                if (!(movieTex != null && this.textures[movieTex] != null))
                    return "unable to parse movieTex for template " + templateType;

                allTextures['movieTex'] = this.textures[movieTex];

                var playerADiffTex = this.reader.getString(children[i], 'playerADiffTex');
                if (!(playerADiffTex != null && this.textures[playerADiffTex] != null))
                    return "unable to parse playerADiffTex for template " + templateType;

                allTextures['playerADiffTex'] = this.textures[playerADiffTex];

                var playerBDiffTex = this.reader.getString(children[i], 'playerBDiffTex');
                if (!(playerBDiffTex != null && this.textures[playerBDiffTex] != null))
                    return "unable to parse playerBDiffTex for template " + templateType;

                allTextures['playerBDiffTex'] = this.textures[playerBDiffTex];

                var setTurnTimeTex = this.reader.getString(children[i], 'setTurnTimeTex');
                if (!(setTurnTimeTex != null && this.textures[setTurnTimeTex] != null))
                    return "unable to parse setTurnTimeTex for template " + templateType;

                allTextures['setTurnTimeTex'] = this.textures[setTurnTimeTex];

                var winnerATex = this.reader.getString(children[i], 'winnerATex');
                if (!(winnerATex != null && this.textures[winnerATex] != null))
                    return "unable to parse winnerATex for template " + templateType;

                allTextures['winnerATex'] = this.textures[winnerATex];

                var winnerBTex = this.reader.getString(children[i], 'winnerBTex');
                if (!(winnerBTex != null && this.textures[winnerBTex] != null))
                    return "unable to parse winnerBTex for template " + templateType;

                allTextures['winnerBTex'] = this.textures[winnerBTex];

                currentTemplate = new MenuPanelTemplate(allTextures);
            }

            this.templates[templateType] = currentTemplate;
        }

        this.log("Parsed templates");
        return null;
    } 

  /**
   * Parses the <components> block.
   * @param {components block element} componentsNode
   */
    parseComponents(componentsNode) {

        var children = componentsNode.children;

        this.components = [];

        var grandChildren = [];
        var grandgrandChildren = [];
        var nodeNames = [];

        // Any number of components.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "component") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current component.
            var componentID = this.reader.getString(children[i], 'id');
            if (componentID == null)
                return "no ID defined for component";


            var newNode;

            // Node already was declared
            if (this.components[componentID] != null) {

                newNode = this.nodes[componentID];

                if (newNode.loaded)
                    return "ID must be unique for each component (conflict: ID = " + componentID + ")";
                
            }
            // New node; not declared yet
            else {
                newNode = new MyGraphNode(this, componentID);

                // just a placeholder to save the component IDs; real nodes are stored in this.nodes
                this.components[componentID] = 0;
            }


            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var transformationIndex = nodeNames.indexOf("transformation");
            var animationrefIndex = nodeNames.indexOf("animationref");
            var materialsIndex = nodeNames.indexOf("materials");
            var textureIndex = nodeNames.indexOf("texture");
            var childrenIndex = nodeNames.indexOf("children");

            // Transformations
            if (transformationIndex == -1)
                return "'transformation' block not specified for component with ID = " + componentID;

            grandgrandChildren = grandChildren[transformationIndex].children;


            var expTransfUsed = false; // explicit transformations used
            var transfRefUsed = false; // transformation reference used

            for (var j = 0; j < grandgrandChildren.length; j++) {
                switch (grandgrandChildren[j].nodeName) {

                    case 'translate':
                        if (transfRefUsed)
                            return "'transformationref' is meant to be used individually inside a <transformation> block (problem on component with ID = " + componentID + ")";
                        
                        expTransfUsed = true;

                        var coordinates = this.parseCoordinates3D(grandgrandChildren[j], "translate transformation for component with ID = " + componentID);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        newNode.transfMatrix = mat4.translate(newNode.transfMatrix, newNode.transfMatrix, coordinates);
                        break;

                    case 'scale':
                        if (transfRefUsed)
                            return "'transformationref' is meant to be used individually inside a <transformation> block (problem on component with ID = " + componentID + ")";
                                                
                        expTransfUsed = true;

                        var coordinates = this.parseCoordinates3D(grandgrandChildren[j], "scale transformation for component with ID = " + componentID);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                            newNode.transfMatrix = mat4.scale(newNode.transfMatrix, newNode.transfMatrix, coordinates);
                        break;
    
                    case 'rotate':
                        if (transfRefUsed)
                            return "'transformationref' is meant to be used individually inside a <transformation> block (problem on component with ID = " + componentID + ")";
                                                
                        expTransfUsed = true;

                        var axis = this.reader.getString(grandgrandChildren[j], "axis");
                        if (!(axis != null && (axis == 'x' || axis == 'y' || axis == 'z')))
                            return "unable to parse the axis of a rotation for the component with ID = " + componentID;

                        var angle = this.reader.getFloat(grandgrandChildren[j], "angle");
                        if (!(angle != null && !isNaN(angle)))
                            return "unable to parse the angle of a rotation for the component with ID = " + componentID;

                        angle *= DEGREE_TO_RAD;

                        newNode.transfMatrix = mat4.rotate(newNode.transfMatrix, newNode.transfMatrix, angle, this.axisCoords[axis]);
                        break;

                    case 'transformationref':
                        if (expTransfUsed || transfRefUsed)
                            return "'transformationref' is meant to be used individually inside a <transformation> block (problem on component with ID = " + componentID + ")";
                        
                        transfRefUsed = true;
                        
                        var transfID = this.reader.getString(grandgrandChildren[j], 'id');
                        if (transfID == null)
                            return "no id defined for a transformationref for component with ID = " + componentID;
    
                        if (this.transformations[transfID] == null)
                            return "invalid ID (" + transfID + ") in a transformationref for component with ID = " + componentID;
    
    
                        newNode.setTransfMatrix(this.transformations[transfID]);
                        break;

                    default:
                        this.onXMLMinorError("unknown tag <" + grandgrandChildren[j].nodeName + ">");
                        break;

                }
            }

            // Animation
            if (animationrefIndex != -1) {

                var animationIndex = this.reader.getString(grandChildren[animationrefIndex], 'id');
                if (animationIndex == null) {
                    return "no id defined for animation in component with ID = " + componentID;
                }

                if(this.animations[animationIndex] == null)
                    return "reference to non-existent animation (ID = " + animationIndex + ") in component with ID = " + componentID;

                newNode.setKeyframeAnimation(this.animations[animationIndex]);

                // console.log("Component with ID = " + componentID + " uses the animation with ID = " + animationIndex);
            }

            
            // Materials
            var materialsCounter = 0;

            if (materialsIndex == -1)
                return "'materials' block not specified for component with ID = " + componentID;

            grandgrandChildren = grandChildren[materialsIndex].children;
            
            for(var k = 0; k < grandgrandChildren.length; k++) {
                if (grandgrandChildren[k].nodeName == "material") {

                    var matID = this.reader.getString(grandgrandChildren[k], 'id');
                    if (matID == null)
                        return "no id defined for a material reference for component with ID = " + componentID;
                        
                    if (matID == "inherit") {
                        newNode.addMaterial(matID);
                    }
                    else if (this.materials[matID] != null)
                        newNode.addMaterial(this.materials[matID]);
                    else
                        return "invalid ID (" + matID + ") in a material reference for component with ID = " + componentID;

                    materialsCounter++;
                }
                else
                    this.onXMLMinorError("unknown tag <" + grandgrandChildren[k].nodeName + ">");
            }

            if (materialsCounter < 1)
                return "no valid materials defined for component with ID = " + componentID;


            // Texture
            if (textureIndex == -1)
                return "'texture' tag not specified for component with ID = " + componentID;

            var needLengths = true;

            var texID = this.reader.getString(grandChildren[textureIndex], 'id');
            if (texID == null)
                return "no id defined for a texture reference for component with ID = " + componentID;

            if (texID == "inherit" || texID == "none") {
                newNode.setTexture(texID);
                needLengths = false;
            }
            else if (this.textures[texID] != null)
                newNode.setTexture(this.textures[texID]);
            else
                return "invalid ID (" + texID + ") in a texture reference for component with ID = " + componentID;


            if (needLengths) {
                var length_s = this.reader.getFloat(grandChildren[textureIndex], 'length_s');
                if (!(length_s != null && !isNaN(length_s) && length_s > 0)) {
                    return "unable to parse length_s defined for a texture reference for component with ID = " + componentID;
                }

                var length_t = this.reader.getFloat(grandChildren[textureIndex], 'length_t');
                if (!(length_t != null && !isNaN(length_t) && length_t > 0)) {
                    return "unable to parse length_t defined for a texture reference for component with ID = " + componentID;
                }

                newNode.setTextureLengths(length_s, length_t);
            }
            else {
                if (this.reader.hasAttribute(grandChildren[textureIndex], 'length_s'))
                    this.onXMLMinorError(componentID + " has texture ID = " + texID + " - length_s should not exist");

                if (this.reader.hasAttribute(grandChildren[textureIndex], 'length_t'))
                    this.onXMLMinorError(componentID + " has texture ID = " + texID + " - length_t should not exist");
            }


            // Children
            var childrenCounter = 0;

            if (childrenIndex == -1)
                return "'children' tag not specified for component with ID = " + componentID;

            grandgrandChildren = grandChildren[childrenIndex].children;

            for(var w = 0; w < grandgrandChildren.length; w++) {
                if (grandgrandChildren[w].nodeName == "componentref") {

                    var childID = this.reader.getString(grandgrandChildren[w], 'id');
                    if (childID == null)
                        return "no ID specified in a componentref for component with ID = " + componentID;

                    if (childID == componentID)
                        return "a component can't be a child of itself (error in component with ID = " + componentID + ")";


                    var newChildNode;

                    // Child node doesn't exist yet; creates new node and adds it to the data structure
                    if (this.nodes[childID] == null) {
                        newChildNode = new MyGraphNode(this, childID);
                        this.nodes[childID] = newChildNode;
                        this.components[childID] = 0;
                    }
                    // Child node already was declared
                    else {
                        newChildNode = this.nodes[childID];
                    }

                    newNode.addNode(newChildNode);
                    childrenCounter++;
                }
                else if (grandgrandChildren[w].nodeName == "primitiveref") {
                   
                    var primID = this.reader.getString(grandgrandChildren[w], 'id');
                    if (primID == null)
                        return "no ID specified in a primitiveref for component with ID = " + componentID;

                    if (this.primitives[primID] == null)
                        return "invalid ID (" + primID + ") in a primitiveref for component with ID = " + componentID;

                    newNode.addLeaf(this.primitives[primID]);
                    childrenCounter++;
                }
                else
                    this.onXMLMinorError("unknown tag <" + grandgrandChildren[w].nodeName + ">");

            }

            if (childrenCounter < 1)
                return "node with ID = " + componentID + " has no valid children (nodes or primitives)";

        
            newNode.loaded = true;
            this.nodes[componentID] = newNode;
        }


        if (this.nodes[this.idRoot] == null)
            return "root id (" + this.idRoot + ") doesn't match any of the nodes specified in the XML file";


        for(var id in this.nodes) {
            if (!this.nodes[id].loaded) {
                return "invalid ID (" + id + ") in a componentref; node does not exist";
            }
        }
        
        this.log("Parsed components");
        return null;    
    }


    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        // Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    parseControlPoint(node, messageError) {
        var position = [];

        // xx
        var xx = this.reader.getFloat(node, 'xx');
        if (!(xx != null && !isNaN(xx)))
            return "unable to parse xx-coordinate of the " + messageError;

        // yy
        var yy = this.reader.getFloat(node, 'yy');
        if (!(yy != null && !isNaN(yy)))
            return "unable to parse yy-coordinate of the " + messageError;

        // zz
        var zz = this.reader.getFloat(node, 'zz');
        if (!(zz != null && !isNaN(zz)))
            return "unable to parse zz-coordinate of the " + messageError;

        position.push(...[xx, yy, zz, 1.0]);

        return position;

    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }


    /**
     * Animates all the nodes of the graph
     * @param {float} deltaT 
     */
    animateNodes(deltaT) {
        for(var id in this.nodes) {
            this.nodes[id].animate(deltaT);
        }
    }


    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
       this.scene.pushMatrix();
       this.displaySceneRecursive(this.nodes[this.idRoot], this.defaultMaterial, null, null, null);
       this.scene.popMatrix();
    }

    displaySceneRecursive(node, parentMaterial, parentTexture, ls, lt) {

        this.scene.pushMatrix();

        // Material
        var currMaterial;
        var auxMaterial = node.nodeMaterials[this.scene.matIndex % node.nodeMaterials.length];
        var length_s = null;
        var length_t = null;

        if (auxMaterial == "inherit") {
            currMaterial = parentMaterial;
        }
        else {
            currMaterial = auxMaterial;
        }
        currMaterial.apply();
        currMaterial.setTexture(null);

        // Texture
        var currTexture;
        if (node.texture == "none") {
            currTexture = null;

            if (parentTexture != null)
                parentTexture.unbind();
        }
        else {
            if (node.texture == "inherit") {
                currTexture = parentTexture;
                length_s = ls;
                length_t = lt;
            }
            else {
                currTexture = node.texture;
                length_s = node.length_s;
                length_t = node.length_t;
            }

            if (currTexture != null) {
                currTexture.bind();
                currMaterial.setTexture(currTexture);
                currMaterial.setTextureWrap('REPEAT', 'REPEAT');
            }

        }

        // Transformations
        this.scene.multMatrix(node.transfMatrix);
        if(node.keyframeAnimation != null)
            node.keyframeAnimation.apply();
            
        for (var i = 0; i < node.leafs.length; i++) {
            node.leafs[i].display(length_s, length_t);
        }

        for (var j = 0; j < node.childNodes.length; j++) {
            this.displaySceneRecursive(node.childNodes[j], currMaterial, currTexture, length_s, length_t);
        }

        if (currTexture != null) {
            currTexture.unbind();
            currMaterial.setTexture(null);
        }
    
        this.scene.popMatrix();

    }

}
