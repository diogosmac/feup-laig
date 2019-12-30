/**
 * MyKeyframe - class that represents a keyframe and all informations relative to it
 */
class MyKeyframe {
    /**
     * Constructor of the class
     * @param {*} translationValues Array with the translation values for the keyframe
     * @param {*} rotationValues Array with the rotation values for the keyframe
     * @param {*} scaleValues Array with the scale values for the keyframe
     * @param {*} instant Time instant of the keyframe
     */
    constructor(translationValues, rotationValues, scaleValues, instant) {
        this.translationValues = translationValues;
        this.rotationValueX = rotationValues[0];
        this.rotationValueY = rotationValues[1];
        this.rotationValueZ = rotationValues[2];
        this.scaleValues = scaleValues;
        this.instant = instant;
    }
}