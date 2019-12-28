/**
 * PanelsManager - class that manages and displays all the menu and game panels
 */
class PanelsManager {
    /**
     * Constructor of the class
     * @param {GameOrchestrator} orchestrator - reference to the game orchestrator
     */
    constructor(orchestrator) {
        this.orchestrator = orchestrator;
        let scene = this.orchestrator.scene;

        this.panelIDs = Object.freeze({
            "UNDO": 100,
            "ROTATE": 101,
            "DIFF": 102,
            "BACK": 103,
            "EASY_A": 104,
            "MEDIUM_A": 105,
            "EASY_B": 106,
            "MEDIUM_B": 107,
            "TURN_TIME_15": 108,
            "TURN_TIME_30": 109,
            "TURN_TIME_60": 110,
            "SET_TURN_TIME": 111,
            "GAME_OPTIONS": 112,
            "PVP": 113,
            "PVC": 114,
            "CVC": 115,
            "MAIN_MENU": 116,
            "PLAY": 117
        });

        this.panelMaterial = new CGFappearance(this.orchestrator.scene);
        this.panelMaterial.setShininess(1);
        this.panelMaterial.setAmbient(0, 0, 0, 1);
        this.panelMaterial.setDiffuse(0.7, 0.7, 0.7, 1);
        this.panelMaterial.setSpecular(0, 0, 0, 1);
        this.panelMaterial.setEmission(1.0, 1.0, 1.0, 1);

        this.selectedPanelMaterial = new CGFappearance(this.orchestrator.scene);
        this.selectedPanelMaterial.setShininess(1);
        this.selectedPanelMaterial.setAmbient(0, 0, 0, 1);
        this.selectedPanelMaterial.setDiffuse(0, 0.7, 0, 1);
        this.selectedPanelMaterial.setSpecular(0, 0, 0, 1);
        this.selectedPanelMaterial.setEmission(0.2, 0.7, 0.2, 1);


        this.backPanel = new Panel(this.orchestrator, new MyRectangle(scene, "backPanelRec", -1.2, -0.85, -0.75, -0.55, true), this.panelIDs.BACK);

        // menu panels - MAIN MENU
        this.mainTitlePanel = new Panel(this.orchestrator, new MyRectangle(scene, "mainTitlePanelRec", -0.7, 0.7, 0.5, 0.8, true));
        this.difficultyPanel = new Panel(this.orchestrator, new MyRectangle(scene, "difficultyPanelRec", -1.1, -0.5, -0.1, 0.1, true), this.panelIDs.DIFF);
        this.playPanel = new Panel(this.orchestrator, new MyRectangle(scene, "playPanelRec", -0.25, 0.25, 0.1, 0.4, true), this.panelIDs.PLAY);
        this.setTurnTimePanel = new Panel(this.orchestrator, new MyRectangle(scene, "setTurnTimePanelRec", -1.1, -0.5, -0.7, -0.5, true), this.panelIDs.SET_TURN_TIME);
        this.gameOptionsPanel = new Panel(this.orchestrator, new MyRectangle(scene, "gameOptionsPanelRec", 0.5, 1.1, -0.1, 0.1, true), this.panelIDs.GAME_OPTIONS);
        this.chooseScenePanel = new Panel(this.orchestrator, new MyRectangle(scene, "chooseScenePanelRec", 0.5, 1.1, -0.7, -0.5, true));

        // menu panels - DIFFICULTY
        this.playerADiffPanel = new Panel(this.orchestrator, new MyRectangle(scene, "playerADiffPanelRec", -0.6, 0.6, 0.5, 0.7, true));
        this.playerBDiffPanel = new Panel(this.orchestrator, new MyRectangle(scene, "playerBDiffPanelRec", -0.6, 0.6, -0.2, 0, true));
        this.easyPlayerAPanel = new Panel(this.orchestrator, new MyRectangle(scene, "easyPlayerAPanelRec", -0.6, -0.2, 0.2, 0.4, true), this.panelIDs.EASY_A);
        this.mediumPlayerAPanel = new Panel(this.orchestrator, new MyRectangle(scene, "mediumPlayerAPanelRec", 0.0, 0.6, 0.2, 0.4, true), this.panelIDs.MEDIUM_A);
        this.easyPlayerBPanel = new Panel(this.orchestrator, new MyRectangle(scene, "easyPlayerBPanelRec", -0.6, -0.2, -0.5, -0.3, true), this.panelIDs.EASY_B);
        this.mediumPlayerBPanel = new Panel(this.orchestrator, new MyRectangle(scene, "mediumPlayerBPanelRec", 0.0, 0.6, -0.5, -0.3, true), this.panelIDs.MEDIUM_B);


        // menu panels - SET TURN TIME
        this.setTurnTimeTitlePanel = new Panel(this.orchestrator, new MyRectangle(scene, "setTurnTimeTitlePanelRec", -0.4, 0.4, 0.5, 0.7, true));
        this.turnTime15Panel = new Panel(this.orchestrator, new MyRectangle(scene, "turnTime15PanelRec", -0.3, 0.3, 0.2, 0.4, true), this.panelIDs.TURN_TIME_15);
        this.turnTime30Panel = new Panel(this.orchestrator, new MyRectangle(scene, "turnTime30PanelRec", -0.3, 0.3, -0.2, 0.0, true), this.panelIDs.TURN_TIME_30);
        this.turnTime60Panel = new Panel(this.orchestrator, new MyRectangle(scene, "turnTime60PanelRec", -0.3, 0.3, -0.6, -0.4, true), this.panelIDs.TURN_TIME_60);


        // menu panels - GAME OPTIONS
        this.gameOptionsTitlePanel = new Panel(this.orchestrator, new MyRectangle(scene, "gameOptionsTitlePanelRec", -0.4, 0.4, 0.5, 0.7, true));
        this.pvpPanel = new Panel(this.orchestrator, new MyRectangle(scene, "pvpPanelRec", -0.15, 0.15, 0.2, 0.4, true), this.panelIDs.PVP);
        this.pvcPanel = new Panel(this.orchestrator, new MyRectangle(scene, "pvcPanelRec", -0.15, 0.15, -0.2, 0.0, true), this.panelIDs.PVC);
        this.cvcPanel = new Panel(this.orchestrator, new MyRectangle(scene, "cvcPanelRec", -0.15, 0.15, -0.6, -0.4, true), this.panelIDs.CVC);


        // menu panels - SHOW WINNER
        this.winnerPanel = new Panel(this.orchestrator, new MyRectangle(scene, "winnerPanelRec", -0.5, 0.5, 0.1, 0.3, true));
        this.mainMenuPanel = new Panel(this.orchestrator, new MyRectangle(scene, "mainMenuPanelRec", -0.6, 0.0, -0.2, 0, true), this.panelIDs.MAIN_MENU);
        this.moviePanel = new Panel(this.orchestrator, new MyRectangle(scene, "mediumPlayerBPanelRec", 0.2, 0.6, -0.2, 0, true));


        // game panels
        this.undoPanel = new Panel(this.orchestrator, new MyRectangleXZ(scene, 'undoPanelRec', -0.5, 0.5, -0.75, 0.75), this.panelIDs.UNDO);
        this.rotatePanel = new Panel(this.orchestrator, new MyRectangleXZ(scene, 'rotatePanelRec', -0.5, 0.5, -0.75, 0.75), this.panelIDs.ROTATE);
        this.turnPanel = new Panel(this.orchestrator, new MyRectangleXZ(scene, 'turnPanelRec', -0.5, 0.5, -0.75, 0.75));
        
        this.timerPanel = new Panel(this.orchestrator, new MyRectangleXZ(scene, 'timerPanelRec', -0.25, 0.25, -0.75, 0.75));
        this.timerValuePanel1 = new Panel(this.orchestrator, new MyRectangleXZ(scene, 'timerValuePanelRec1', -0.25, 0.25, -0.375, 0.375));
        this.timerValuePanel2 = new Panel(this.orchestrator, new MyRectangleXZ(scene, 'timerValuePanelRec2', -0.25, 0.25, -0.375, 0.375));

        this.scoreAPanel = new Panel(this.orchestrator, new MyRectangleXZ(scene, 'scoreAPanelRec', -0.25, 0.25, -0.75, 0.75));
        this.scoreAValuePanel1 = new Panel(this.orchestrator, new MyRectangleXZ(scene, 'scoreAValuePanelRec1', -0.25, 0.25, -0.375, 0.375));
        this.scoreAValuePanel2 = new Panel(this.orchestrator, new MyRectangleXZ(scene, 'scoreAValuePanelRec2', -0.25, 0.25, -0.375, 0.375));

        this.scoreBPanel = new Panel(this.orchestrator, new MyRectangleXZ(scene, 'scoreBPanelRec', -0.25, 0.25, -0.75, 0.75));
        this.scoreBValuePanel1 = new Panel(this.orchestrator, new MyRectangleXZ(scene, 'scoreBValuePanelRec1', -0.25, 0.25, -0.375, 0.375));
        this.scoreBValuePanel2 = new Panel(this.orchestrator, new MyRectangleXZ(scene, 'scoreBValuePanelRec2', -0.25, 0.25, -0.375, 0.375));


        this.rotateGamePanels = false;
    }


    /**
     * Method that updates all panel textures when a new template is loaded
     * @param {NumbersTemplate} numbersTemplate - template that stores all the textures that represent numbers
     * @param {GamePanelTemplate} gamePanelTemplate - template that stores all the textures for the game panels
     * @param {MenuPanelTemplate} menuPanelTemplate - template that stores all the textures for the menu panels
     */
    loadTemplate(numbersTemplate, gamePanelTemplate, menuPanelTemplate) {
        this.numbersTemplate = numbersTemplate;
        this.gamePanelTemplate = gamePanelTemplate;
        this.menuPanelTemplate = menuPanelTemplate;

        this.undoPanel.loadPanelTexture(this.gamePanelTemplate.undoTexture);
        this.rotatePanel.loadPanelTexture(this.gamePanelTemplate.rotateTexture);
        this.timerPanel.loadPanelTexture(this.gamePanelTemplate.timerTexture);
        this.scoreAPanel.loadPanelTexture(this.gamePanelTemplate.scoreATexture);
        this.scoreBPanel.loadPanelTexture(this.gamePanelTemplate.scoreBTexture);


        this.backPanel.loadPanelTexture(this.menuPanelTemplate.getMenuTexture('backTex'));
        
        this.mainTitlePanel.loadPanelTexture(this.menuPanelTemplate.getMenuTexture('gameTitleTex'));
        this.difficultyPanel.loadPanelTexture(this.menuPanelTemplate.getMenuTexture('difficultyTex'));
        this.playPanel.loadPanelTexture(this.menuPanelTemplate.getMenuTexture('playTex'));
        this.setTurnTimePanel.loadPanelTexture(this.menuPanelTemplate.getMenuTexture('setTurnTimeTex'));
        this.gameOptionsPanel.loadPanelTexture(this.menuPanelTemplate.getMenuTexture('gameOptionsTex'));
        this.chooseScenePanel.loadPanelTexture(this.menuPanelTemplate.getMenuTexture('chooseSceneTex'));

        this.playerADiffPanel.loadPanelTexture(this.menuPanelTemplate.getMenuTexture('playerADiffTex'));
        this.playerBDiffPanel.loadPanelTexture(this.menuPanelTemplate.getMenuTexture('playerBDiffTex'));
        this.easyPlayerAPanel.loadPanelTexture(this.menuPanelTemplate.getMenuTexture('easyTex'));
        this.mediumPlayerAPanel.loadPanelTexture(this.menuPanelTemplate.getMenuTexture('mediumTex'));
        this.easyPlayerBPanel.loadPanelTexture(this.menuPanelTemplate.getMenuTexture('easyTex'));
        this.mediumPlayerBPanel.loadPanelTexture(this.menuPanelTemplate.getMenuTexture('mediumTex'));

        this.setTurnTimeTitlePanel.loadPanelTexture(this.menuPanelTemplate.getMenuTexture('setTurnTimeTex'));
        this.turnTime15Panel.loadPanelTexture(this.menuPanelTemplate.getMenuTexture('timer15Tex'));
        this.turnTime30Panel.loadPanelTexture(this.menuPanelTemplate.getMenuTexture('timer30Tex'));
        this.turnTime60Panel.loadPanelTexture(this.menuPanelTemplate.getMenuTexture('timer60Tex'));
    
        this.gameOptionsTitlePanel.loadPanelTexture(this.menuPanelTemplate.getMenuTexture('gameOptionsTex'));
        this.pvpPanel.loadPanelTexture(this.menuPanelTemplate.getMenuTexture('pvpTex'));
        this.pvcPanel.loadPanelTexture(this.menuPanelTemplate.getMenuTexture('pvcTex'));
        this.cvcPanel.loadPanelTexture(this.menuPanelTemplate.getMenuTexture('cvcTex'));
    
        this.mainMenuPanel.loadPanelTexture(this.menuPanelTemplate.getMenuTexture('mainMenuTex'));
        this.moviePanel.loadPanelTexture(this.menuPanelTemplate.getMenuTexture('movieTex'));
    }


    /**
     * Method that updates the texture used to display the winner of the game
     * @param {String} winner - string indicating the outcome of the game (player A won, player B won, or draw)
     */
    changeWinnerPanelTexture(winner) {
        if(winner == 'A') {
            this.winnerPanel.loadPanelTexture(this.menuPanelTemplate.getMenuTexture('winnerATex'));
        }
        else if(winner == 'B') {
            this.winnerPanel.loadPanelTexture(this.menuPanelTemplate.getMenuTexture('winnerBTex'));
        }
        else if(winner == 'draw') {
            this.winnerPanel.loadPanelTexture(this.menuPanelTemplate.getMenuTexture('drawTex'));
        }
    }


    /**
     * Method that updates the panel texture showing which player has the current turn
     * @param {char} player - player A or B
     */
    changeTurnPanelTexture(player) {
        let turnTexture = player == 'A' ? this.gamePanelTemplate.playerATurnTexture : this.gamePanelTemplate.playerBTurnTexture;
        this.turnPanel.loadPanelTexture(turnTexture);
    }


    /**
     * Method that, given the current score, updates the textures to be used in the panels that display the score
     * @param {int} pointsA - player A's score
     * @param {int} pointsB - player B's score
     */
    updateScoreTextures(pointsA, pointsB) {
        this.scoreAValuePanel1.loadPanelTexture(this.numbersTemplate.getNumberTextureDozens(pointsA));
        this.scoreAValuePanel2.loadPanelTexture(this.numbersTemplate.getNumberTextureUnits(pointsA));

        this.scoreBValuePanel1.loadPanelTexture(this.numbersTemplate.getNumberTextureDozens(pointsB));
        this.scoreBValuePanel2.loadPanelTexture(this.numbersTemplate.getNumberTextureUnits(pointsB));
    }


    /**
     * Method that, given the current time, updates the textures to be used in the panels that display the timer value
     * @param {int} time - timer value, in seconds
     */
    updateTimer(time) {
        this.timerValuePanel1.loadPanelTexture(this.numbersTemplate.getNumberTextureDozens(time));
        this.timerValuePanel2.loadPanelTexture(this.numbersTemplate.getNumberTextureUnits(time));
    }


    /**
     * Method that manages picking operations and actions for the panels
     * @param {Panel} panel - panel that was picked/selected 
     * @param {int} uniqueId - unique ID of that panel
     */
    onPanelSelected(panel, uniqueId) {
        switch(uniqueId) {
            case this.panelIDs.ROTATE: // rotate panel
                if(this.orchestrator.gameState != this.orchestrator.gameStates.GAME && this.orchestrator.gameState != this.orchestrator.gameStates.MOVIE)
                    return;

                this.orchestrator.rotateCamera();
                break;

            case this.panelIDs.UNDO: // undo panel
                if(this.orchestrator.gameState != this.orchestrator.gameStates.GAME || 
                    (this.orchestrator.board.pickState != this.orchestrator.board.pickStates.PICK_PIECE && this.orchestrator.board.pickState != this.orchestrator.board.pickStates.PICK_PLAYER_MOVE)) {
                    return;
                }    

                if(this.orchestrator.undo()) {
                    this.orchestrator.board.pickState = this.orchestrator.board.pickStates.PICK_PIECE;
                    this.orchestrator.board.resetTiles();
                }
                break;

            case this.panelIDs.DIFF: // difficulty panel
                if(this.orchestrator.gameState != this.orchestrator.gameStates.MENU)
                    return;

                this.orchestrator.gameState = this.orchestrator.gameStates.DIFFICULTY;
                break;

            case this.panelIDs.BACK: // back panel
                if(this.orchestrator.gameState == this.orchestrator.gameStates.GAME)
                    return;
                    
                this.orchestrator.gameState = this.orchestrator.gameStates.MENU;
                break;


            case this.panelIDs.EASY_A: // "easy" difficulty option panel for player A
                if(this.orchestrator.gameState != this.orchestrator.gameStates.DIFFICULTY)
                    return;

                this.orchestrator.changeDifficulty('A', 1);
                break;

            case this.panelIDs.MEDIUM_A: // "medium" difficulty option panel for player A
                if(this.orchestrator.gameState != this.orchestrator.gameStates.DIFFICULTY)
                    return;

                this.orchestrator.changeDifficulty('A', 2);
                break;

            case this.panelIDs.EASY_B: // "easy" difficulty option panel for player B
                if(this.orchestrator.gameState != this.orchestrator.gameStates.DIFFICULTY)
                    return;

                this.orchestrator.changeDifficulty('B', 1);
                break;

            case this.panelIDs.MEDIUM_B: // "medium" difficulty option panel for player B
                if(this.orchestrator.gameState != this.orchestrator.gameStates.DIFFICULTY)
                    return;

                this.orchestrator.changeDifficulty('B', 2);
                break;

            case this.panelIDs.SET_TURN_TIME: // set turn time panel
                if(this.orchestrator.gameState != this.orchestrator.gameStates.MENU)
                    return;

                this.orchestrator.gameState = this.orchestrator.gameStates.SET_TIMER;
                break;

            case this.panelIDs.TURN_TIME_15: // set turn time to 15 secs panel
                if(this.orchestrator.gameState != this.orchestrator.gameStates.SET_TIMER)
                    return;

                this.orchestrator.changeMaxTurnDuration(0);
                break;

            case this.panelIDs.TURN_TIME_30: // set turn time to 30 secs panel
                if(this.orchestrator.gameState != this.orchestrator.gameStates.SET_TIMER)
                    return;

                this.orchestrator.changeMaxTurnDuration(1);
                break;

            case this.panelIDs.TURN_TIME_60: // set turn time to 60 secs panel
                if(this.orchestrator.gameState != this.orchestrator.gameStates.SET_TIMER)
                    return;

                this.orchestrator.changeMaxTurnDuration(2);
                break;

            case this.panelIDs.GAME_OPTIONS: // game options panel
                if(this.orchestrator.gameState != this.orchestrator.gameStates.MENU)
                    return;

                this.orchestrator.gameState = this.orchestrator.gameStates.GAME_OPTIONS;
                break;

            case this.panelIDs.PVP: // pvp panel
                if(this.orchestrator.gameState != this.orchestrator.gameStates.GAME_OPTIONS)
                    return;

                this.orchestrator.changeGameOption(1);
                break;

            case this.panelIDs.PVC: // pvc panel
                if(this.orchestrator.gameState != this.orchestrator.gameStates.GAME_OPTIONS)
                    return;

                this.orchestrator.changeGameOption(2);
                break;

            case this.panelIDs.CVC: // cvc panel
                if(this.orchestrator.gameState != this.orchestrator.gameStates.GAME_OPTIONS)
                    return;

                this.orchestrator.changeGameOption(3);
                break;

            case this.panelIDs.MAIN_MENU: // main menu panel
                if(this.orchestrator.gameState != this.orchestrator.gameStates.SHOW_WINNER)
                    return;

                this.orchestrator.gameState = this.orchestrator.gameStates.MENU;
                break;

            case this.panelIDs.PLAY: // play panel
                if(this.orchestrator.gameState != this.orchestrator.gameStates.MENU)
                    return;

                this.orchestrator.resetGame();
                this.orchestrator.scene.activeCameraID = "PlayerPerspective";
                this.orchestrator.scene.changeCamera();
                this.orchestrator.gameState = this.orchestrator.gameStates.GAME;
                break;

            default:
                break;
        }
    }


    /**
     * Method that displays all main menu panels
     * @param {XMLscene} scene - reference to the scene object
     */
    displayMainMenuPanels(scene) {

        this.panelMaterial.apply();

        scene.pushMatrix();
        scene.translate(40, 8, 0);
        scene.rotate(Math.PI / 2, 0, 1, 0);

        this.mainTitlePanel.display();
        this.difficultyPanel.display();
        this.playPanel.display();
        this.setTurnTimePanel.display();
        this.gameOptionsPanel.display();
        this.chooseScenePanel.display();

        scene.popMatrix();
    }


    /**
     * Method that displays all difficulty menu panels
     * @param {XMLscene} scene - reference to the scene object
     */
    displayDifficultyPanels(scene) {

        this.panelMaterial.apply();

        scene.pushMatrix();
        scene.translate(40, 8, 0);
        scene.rotate(Math.PI / 2, 0, 1, 0);

        this.playerADiffPanel.display();
        this.playerBDiffPanel.display();
        this.backPanel.display();

        let materialFirstOption, materialSecondOption;

        if(this.orchestrator.difficultyA == 1) {
            materialFirstOption = this.selectedPanelMaterial;
            materialSecondOption = this.panelMaterial;
        }
        else if(this.orchestrator.difficultyA == 2) {
            materialFirstOption = this.panelMaterial;
            materialSecondOption = this.selectedPanelMaterial;  
        }

        materialFirstOption.apply();
        this.easyPlayerAPanel.display();
        materialSecondOption.apply();
        this.mediumPlayerAPanel.display();


        if(this.orchestrator.difficultyB == 1) {
            materialFirstOption = this.selectedPanelMaterial;
            materialSecondOption = this.panelMaterial;
        }
        else if(this.orchestrator.difficultyB == 2) {
            materialFirstOption = this.panelMaterial;
            materialSecondOption = this.selectedPanelMaterial;  
        }

        materialFirstOption.apply();
        this.easyPlayerBPanel.display();
        materialSecondOption.apply();
        this.mediumPlayerBPanel.display();

        scene.popMatrix();
    }


    /**
     * Method that displays all set turn time panels
     * @param {XMLscene} scene - reference to the scene object
     */
    displaySetTurnTimerPanels(scene) {
        this.panelMaterial.apply();

        scene.pushMatrix();
        scene.translate(40, 8, 0);
        scene.rotate(Math.PI / 2, 0, 1, 0);

        this.setTurnTimeTitlePanel.display();
        this.backPanel.display();

        let materialFirstOption, materialSecondOption, materialThirdOption;

        if(this.orchestrator.maxTimeID == 0) {
            materialFirstOption = this.selectedPanelMaterial;
            materialSecondOption = this.panelMaterial;
            materialThirdOption = this.panelMaterial;
        }
        else if(this.orchestrator.maxTimeID == 1) {
            materialFirstOption = this.panelMaterial;
            materialSecondOption = this.selectedPanelMaterial;
            materialThirdOption = this.panelMaterial;  
        }
        else if(this.orchestrator.maxTimeID == 2) {
            materialFirstOption = this.panelMaterial;
            materialSecondOption = this.panelMaterial; 
            materialThirdOption = this.selectedPanelMaterial;
        }

        materialFirstOption.apply();
        this.turnTime15Panel.display();
        materialSecondOption.apply();
        this.turnTime30Panel.display();
        materialThirdOption.apply();
        this.turnTime60Panel.display();

        scene.popMatrix();
    }


    /**
     * Method that displays all game options panels
     * @param {XMLscene} scene - reference to the scene object
     */
    displayGameOptionsPanels(scene) {
        this.panelMaterial.apply();

        scene.pushMatrix();
        scene.translate(40, 8, 0);
        scene.rotate(Math.PI / 2, 0, 1, 0);

        this.gameOptionsTitlePanel.display();
        this.backPanel.display();

        let materialFirstOption, materialSecondOption, materialThirdOption;

        if(this.orchestrator.playerAStatus == 'H' && this.orchestrator.playerBStatus == 'H') {
            materialFirstOption = this.selectedPanelMaterial;
            materialSecondOption = this.panelMaterial;
            materialThirdOption = this.panelMaterial;
        }
        else if(this.orchestrator.playerAStatus == 'H' && this.orchestrator.playerBStatus == 'C') {
            materialFirstOption = this.panelMaterial;
            materialSecondOption = this.selectedPanelMaterial;
            materialThirdOption = this.panelMaterial;  
        }
        else if(this.orchestrator.playerAStatus == 'C' && this.orchestrator.playerBStatus == 'C') {
            materialFirstOption = this.panelMaterial;
            materialSecondOption = this.panelMaterial; 
            materialThirdOption = this.selectedPanelMaterial;
        }

        materialFirstOption.apply();
        this.pvpPanel.display();
        materialSecondOption.apply();
        this.pvcPanel.display();
        materialThirdOption.apply();
        this.cvcPanel.display();

        scene.popMatrix();
    }



    displayShowWinnerPanels(scene) {
        this.panelMaterial.apply();

        scene.pushMatrix();
        scene.translate(40, 8, 0);
        scene.rotate(Math.PI / 2, 0, 1, 0);

        this.winnerPanel.display();
        this.mainMenuPanel.display();
        this.moviePanel.display();

        scene.popMatrix();
    }


    /**
     * Method that displays all game panels
     * @param {XMLscene} scene - reference to the scene object
     */
    displayGamePanels(scene) {

        this.panelMaterial.apply();

        scene.translate(0, 2.5, 0);

        if(this.rotateGamePanels)
            scene.rotate(Math.PI, 0, 1, 0);

        scene.pushMatrix();
        scene.translate(4, 0, -3.75);
        scene.rotate(-Math.PI / 4, 0, 0, 1);
        this.rotatePanel.display();
        scene.popMatrix();

        scene.pushMatrix();
        scene.translate(4, 0, -2.25);
        scene.rotate(-Math.PI / 4, 0, 0, 1);
        this.undoPanel.display();
        scene.popMatrix();
        
        scene.pushMatrix();
        scene.translate(4, 0, -0.75);
        scene.rotate(-Math.PI / 4, 0, 0, 1);
        this.turnPanel.display();
        scene.popMatrix();

        scene.pushMatrix();
        scene.translate(4 - (Math.sqrt(2) / 8), Math.sqrt(2) / 8, 0.75);
        scene.rotate(-Math.PI / 4, 0, 0, 1);
        this.timerPanel.display();
        scene.popMatrix();

        scene.pushMatrix();
        scene.translate(4 + (Math.sqrt(2) / 8), -Math.sqrt(2) / 8, 0.375);
        scene.rotate(-Math.PI / 4, 0, 0, 1);
        this.timerValuePanel2.display();
        scene.popMatrix();

        scene.pushMatrix();
        scene.translate(4 + (Math.sqrt(2) / 8), -Math.sqrt(2) / 8, 1.125);
        scene.rotate(-Math.PI / 4, 0, 0, 1);
        this.timerValuePanel1.display();
        scene.popMatrix();

        scene.pushMatrix();
        scene.translate(4 - (Math.sqrt(2) / 8), Math.sqrt(2) / 8, 2.25);
        scene.rotate(-Math.PI / 4, 0, 0, 1);
        this.scoreBPanel.display();
        scene.popMatrix();
        
        scene.pushMatrix();
        scene.translate(4 + (Math.sqrt(2) / 8), -Math.sqrt(2) / 8, 1.875);
        scene.rotate(-Math.PI / 4, 0, 0, 1);
        this.scoreBValuePanel2.display();
        scene.popMatrix();
        
        scene.pushMatrix();
        scene.translate(4 + (Math.sqrt(2) / 8), -Math.sqrt(2) / 8, 2.625);
        scene.rotate(-Math.PI / 4, 0, 0, 1);
        this.scoreBValuePanel1.display();
        scene.popMatrix();
        
        scene.pushMatrix();
        scene.translate(4 - (Math.sqrt(2) / 8), Math.sqrt(2) / 8, 3.75);
        scene.rotate(-Math.PI / 4, 0, 0, 1);
        this.scoreAPanel.display();
        scene.popMatrix();
        
        scene.pushMatrix();
        scene.translate(4 + (Math.sqrt(2) / 8), -Math.sqrt(2) / 8, 3.375);
        scene.rotate(-Math.PI / 4, 0, 0, 1);
        this.scoreAValuePanel2.display();
        scene.popMatrix();
        
        scene.pushMatrix();
        scene.translate(4 + (Math.sqrt(2) / 8), -Math.sqrt(2) / 8, 4.125);
        scene.rotate(-Math.PI / 4, 0, 0, 1);
        this.scoreAValuePanel1.display();
        scene.popMatrix();
    }




    /**
     * Display method for all the panels
     */
    display() {
        let scene = this.orchestrator.scene;
        scene.pushMatrix();
        
        switch(this.orchestrator.gameState) {
            case this.orchestrator.gameStates.MENU:
                this.displayMainMenuPanels(scene);
                break;

            case this.orchestrator.gameStates.DIFFICULTY:
                this.displayDifficultyPanels(scene);
                break;

            case this.orchestrator.gameStates.SET_TIMER:
                this.displaySetTurnTimerPanels(scene);
                break;

            case this.orchestrator.gameStates.GAME_OPTIONS:
                this.displayGameOptionsPanels(scene);
                break;

            case this.orchestrator.gameStates.SHOW_WINNER:
                this.displayShowWinnerPanels(scene);
                break;

            case this.orchestrator.gameStates.GAME:
                this.displayGamePanels(scene);
                break;

            default:
                break;
        }

        scene.popMatrix();
    }
}