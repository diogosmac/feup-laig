/**
 * GamePanelTemplate - class that represents the template for all the textures for game panels
 */
class GamePanelTemplate {
    /**
     * Constructor of the class
     * @param {CGFtexture} playerATurnTexture - texture for the turn panel (when it's player A's turn)
     * @param {CGFtexture} playerBTurnTexture - texture for the turn panel (when it's player B's turn) 
     * @param {CGFtexture} rotateTexture - texture for the rotate panel
     * @param {CGFtexture} scoreATexture - texture for the panel showing player A's score
     * @param {CGFtexture} scoreBTexture - texture for the panel showing player B's score
     * @param {CGFtexture} timerTexture - texture for the timer panel
     * @param {CGFtexture} undoTexture - texture for the undo panel
     * @param {CGFtexture} movieTexture - texture for the movie panel
     */
    constructor(playerATurnTexture, playerBTurnTexture, rotateTexture, scoreATexture, scoreBTexture, timerTexture, undoTexture, movieTexture) {
        this.playerATurnTexture = playerATurnTexture;
        this.playerBTurnTexture = playerBTurnTexture;
        this.rotateTexture = rotateTexture;
        this.scoreATexture = scoreATexture;
        this.scoreBTexture = scoreBTexture;
        this.timerTexture = timerTexture;
        this.undoTexture = undoTexture;
        this.movieTexture = movieTexture;
    }
}