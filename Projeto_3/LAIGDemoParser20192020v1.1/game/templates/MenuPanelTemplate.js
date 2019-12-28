/**
 * MenuPanelTemplate - class that represents all the menu panel texture templates
 */
class MenuPanelTemplate {
    /**
     * Constructor of the class
     * @param {Array} menuTexturesArray - Array containing all the menu panel textures
     */
    constructor(menuTexturesArray) {
        this.menuTexturesArray = menuTexturesArray;

        console.log(this.menuTexturesArray);
    }


    /**
     * Method that retrieves the texture that corresponds to the given value
     * @param {String} value - value passed
     */
    getMenuTexture(value) {
        return this.menuTexturesArray[value];
    }
}