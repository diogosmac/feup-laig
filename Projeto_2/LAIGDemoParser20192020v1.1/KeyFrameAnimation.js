/**
 * KeyframeAnimation - class that implements keyframe animations
 */
class KeyframeAnimation extends Animation {
    /**
     * Constructor of the class
     * @param {*} keyframes - Array of keyframes for the animation
     */
    constructor(keyframes) {
        super();
        this.keyframes = [new MyKeyframe([0, 0, 0], [0, 0, 0], [1, 1, 1], 0)]; // creates the default initial keyframe of the animation
        this.keyframes.push(...keyframes); // adds the rest of the keyframes
        this.anteriorKeyframeIndex = 0;
        this.posteriorKeyframeIndex = 1;
        this.sumT = 0;
        this.segmentTime = this.keyframes[this.posteriorKeyframeIndex].instant - this.keyframes[this.anteriorKeyframeIndex].instant;
        this.baseKeyframeMatrix = mat4.create();
        this.calculateSegmentValues();
        this.animationDone = false;
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
        this.segScaleValues = scalePosterior.map(function(v, i) { return v - scaleAnterior[i]; });

        // calculates rotation values
        this.segRotationXValue = posteriorKeyframe.rotationValueX - anteriorKeyframe.rotationValueX;
        this.segRotationYValue = posteriorKeyframe.rotationValueY - anteriorKeyframe.rotationValueY;
        this.segRotationZValue = posteriorKeyframe.rotationValueZ - anteriorKeyframe.rotationValueZ;
        
        // calculates translation values
        var translationAnterior = anteriorKeyframe.translationValues;
        var translationPosterior = posteriorKeyframe.translationValues;
        this.segTranslationValues = translationPosterior.map(function(v, i) { return v - translationAnterior[i]; });
    }


    /**
     * Function that calculates and changes the animation matrix
     */
    calculateNewMatrix() {
        var newMatrix = mat4.create();
        mat4.identity(newMatrix);
        var curKeyframe = this.keyframes[this.anteriorKeyframeIndex];

        if(this.animationDone) { // if animation is over
            mat4.translate(newMatrix, newMatrix, curKeyframe.translationValues);
            mat4.rotate(newMatrix, newMatrix, curKeyframe.rotationValueX, [1, 0, 0]);
            mat4.rotate(newMatrix, newMatrix, curKeyframe.rotationValueY, [0, 1, 0]);
            mat4.rotate(newMatrix, newMatrix, curKeyframe.rotationValueZ, [0, 0, 1]);
            mat4.scale(newMatrix, newMatrix, curKeyframe.scaleValues);
        }
        else { // animation didn't end
            var segPercentage = this.sumT / this.segmentTime;

            // calculate scale values (segment values + base matrix values)
            var newScaleValues = this.segScaleValues.map(function(v) { return v * segPercentage; });
            newScaleValues = curKeyframe.scaleValues.map(function(v, i) { return v + newScaleValues[i]; })

            // calculate rotation values (segment values + base matrix values)
            var newRotationXValue = curKeyframe.rotationValueX + (this.segRotationXValue * segPercentage);
            var newRotationYValue = curKeyframe.rotationValueY + (this.segRotationYValue * segPercentage);
            var newRotationZValue = curKeyframe.rotationValueZ + (this.segRotationZValue * segPercentage);


            // calculate translation values (segment values + base matrix values)
            var newTranslationValues = this.segTranslationValues.map(function(v) { return v * segPercentage; });
            newTranslationValues = curKeyframe.translationValues.map(function(v, i) { return v + newTranslationValues[i]; })

            // generate animation matrix
            mat4.translate(newMatrix, newMatrix, newTranslationValues); 
            mat4.rotate(newMatrix, newMatrix, newRotationXValue, [1, 0, 0]);
            mat4.rotate(newMatrix, newMatrix, newRotationYValue, [0, 1, 0]);
            mat4.rotate(newMatrix, newMatrix, newRotationZValue, [0, 0, 1]);
            mat4.scale(newMatrix, newMatrix, newScaleValues);
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