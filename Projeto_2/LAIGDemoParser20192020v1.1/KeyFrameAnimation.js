/**
 * KeyframeAnimation - class that implements keyframe animations
 */
class KeyframeAnimation extends Animation {
    /**
     * Constructor of the class
     * @param {*} keyframes - Array of keyframes for the animation
     */
    constructor(keyframes) {
        this.keyframes = [new MyKeyframe([0, 0, 0], [0, 0, 0], [1, 1, 1], 0)]; // creates the default initial keyframe of the animation
        this.keyframes.push(...keyframes); // adds the rest of the keyframes
        this.anteriorKeyframeIndex = 0;
        this.posteriorKeyframeIndex = 1;
        this.sumT = 0;
        this.segmentTime = this.keyframes[this.posteriorKeyframeIndex].instant - this.keyframes[this.anteriorKeyframeIndex].instant;
        this.calculateSegmentValues();
        this.calculateBaseKeyframeMatrix();
        this.animationDone = false;
    }


    /**
     * Function that calculates the matrix relative to the anterior keyframe (of the current segment)
     */
    calculateBaseKeyframeMatrix() {
        mat4.identity(this.baseKeyframeMatrix);
        var lastKeyframe = this.keyframes[this.anteriorKeyframeIndex];
        mat4.scale(this.baseKeyframeMatrix, this.baseKeyframeMatrix, lastKeyframe.scaleValues);
        mat4.rotate(this.baseKeyframeMatrix, this.baseKeyframeMatrix, lastKeyframe.rotationValueX, [1, 0, 0]);
        mat4.rotate(this.baseKeyframeMatrix, this.baseKeyframeMatrix, lastKeyframe.rotationValueY, [0, 1, 0]);
        mat4.rotate(this.baseKeyframeMatrix, this.baseKeyframeMatrix, lastKeyframe.rotationValueZ, [0, 0, 1]);
        mat4.translate(this.baseKeyframeMatrix, this.baseKeyframeMatrix, lastKeyframe.translationValues);
    }

    
    /**
     * Function that updates the current segment (anterior and posterior keyframes) where the animation is
     */
    updateSegment() {
        if(this.sumT > this.segmentTime) {
            this.sumT -= this.segmentTime;

            // moves to the next segment
            this.anteriorKeyframeIndex++;
            this.posteriorKeyframeIndex++;
            this.calculateBaseKeyframeMatrix();
            if(this.posteriorKeyframeIndex >= this.keyframes.length) { // if the end of the animation was reached
                this.posteriorKeyframeIndex = this.anteriorKeyframeIndex;
                this.animationDone = true;
            }
            else { // animation didn't end
                this.segmentTime = this.keyframes[this.posteriorKeyframeIndex].instant - this.keyframes[this.anteriorKeyframeIndex].instant;
                this.calculateSegmentValues();
            }
        }
    }


    /**
     * Function that calculates the transformation values of the current segment, that is, the difference of the values of the current keyframes, in order to do a linear interpolation 
     */
    calculateSegmentValues() {
        var anteriorKeyframe = this.keyframes[this.anteriorKeyframeIndex];
        var posteriorKeyframe = this.keyframes[this.posteriorKeyframeIndex];

        // calculates scale values
        var scaleAnterior = anteriorKeyframe.scaleValues;
        var scalePosterior = posteriorKeyframe.scaleValues;
        this.segScaleValues = scalePosterior.map(function(v, i) { return v - scaleAnterior[i] });
        
        // calculates rotation values
        this.segRotationXValue = posteriorKeyframe.rotationValueX - anteriorKeyframe.rotationValueX;
        this.segRotationYValue = posteriorKeyframe.rotationValueY - anteriorKeyframe.rotationValueY;
        this.segRotationZValue = posteriorKeyframe.rotationValueZ - anteriorKeyframe.rotationValueZ;
        
        // calculates translation values
        var translationAnterior = anteriorKeyframe.translationValues;
        var translationPosterior = posteriorKeyframe.translationValues;
        this.segTranslationValues = translationPosterior.map(function(v, i) { return v - translationAnterior[i] });
    }


    /**
     * Function that calculates and changes the animation matrix
     */
    calculateNewMatrix() {
        var newMatrix;
        mat4.identity(newMatrix);

        if(this.animationDone) { // if animation is over
            newMatrix = this.baseKeyframeMatrix;
        }
        else { // animation didn't end
            var segPercentage = this.sumT / this.segmentTime;

            // calculate scale values
            var newScaleValues = this.segScaleValues.map(function(v) { v * segPercentage; });

            // calculate rotation values
            var newRotationXValue = this.segRotationXValue * segPercentage;
            var newRotationYValue = this.segRotationYValue * segPercentage;
            var newRotationZValue = this.segRotationZValue * segPercentage;

            // calculate translation values
            var newTranslationValues = this.segTranslationValues.map(function(v) { v * segPercentage; });


            // generate auxiliar interpolation matrix
            mat4.scale(newMatrix, newMatrix, newScaleValues);
            mat4.rotate(newMatrix, newMatrix, newRotationXValue, [1, 0, 0]);
            mat4.rotate(newMatrix, newMatrix, newRotationYValue, [0, 1, 0]);
            mat4.rotate(newMatrix, newMatrix, newRotationZValue, [0, 0, 1]);
            mat4.translate(newMatrix, newMatrix, newTranslationValues); 
            
            // multiplies it with the base keyframe matrix, in order to get the final animation matrix
            mat4.multiply(newMatrix, this.baseKeyframeMatrix, newMatrix);
        }

        this.animationMatrix = newMatrix;
    }


    /**
     * Function inherited by the Animation class that defines how to update the animation matrix, given the time difference between calls
     * @param {*} deltaT - The time difference between function calls
     */
    generateAnimationMatrix(deltaT) {
        // don't do anything if the animation is over
        if(this.animationDone)
            return;

        this.sumT += deltaT;
        this.updateSegment();
        this.calculateNewMatrix();
    }

}