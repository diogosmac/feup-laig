/**
 * NumbersTemplate - class that represents the number textures of the current template
 */
class NumbersTemplate {
    /**
     * Constructor of the class
     * @param {Array} numberTexturesArray - array with all the number textures (from 0 to 9)
     */
    constructor(numberTexturesArray) {
        this.numberTexturesArray = numberTexturesArray;
    }


    /**
     * Method that, given the number argument, returns the righ texture for the dozens number
     * @param {int} number - the whole number (dozens and units)
     * @return The right number texture for that number
     */
    getNumberTextureDozens(number) {
        let dozensNumber = Math.floor(number / 10);
        return this.numberTexturesArray[dozensNumber];
    }


    /**
     * Method that, given the number argument, returns the righ texture for the units number
     * @param {int} number - the whole number (dozens and units)
     * @return The right number texture for that number
     */
    getNumberTextureUnits(number) {
        let unitsNumber = number % 10;
        return this.numberTexturesArray[unitsNumber];
    }
}