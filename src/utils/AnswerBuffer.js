/**
 * Class for ordering tokens that might arrive out of order from WebSocket streaming
 */
export class AnswerBuffer {
    constructor() {
        this.partList = []
        this.output = ""
        this.lastEndOutputIndex = 0
        this.lastBeginOutputIndex = 0
    }

    /**
     * Add a token part at a specific sequence position
     * @param {number} index - The sequence number of the token
     * @param {string} value - The token text
     */
    addPart(index, value) {
        if (this.output === "") {
            // First token received
            this.output += value
            this.lastEndOutputIndex = index
            this.lastBeginOutputIndex = index
        } else if (index === this.lastEndOutputIndex + 1) {
            // Token belongs right after our current end - append it
            this.output += value
            this.lastEndOutputIndex = index
            this.lookFurther()
        } else if (index === this.lastBeginOutputIndex - 1) {
            // Token belongs right before our current beginning - prepend it
            this.output = value + this.output
            this.lastBeginOutputIndex = index
            this.lookBefore()
        } else {
            // Token is out of order - store it until we get to it
            this.partList[index] = value
        }
    }

    /**
     * Look for tokens after the current end that might be in the buffer
     * and append them if found
     */
    lookFurther() {
        const index = this.lastEndOutputIndex + 1
        if (this.partList[index]) {
            this.output += this.partList[index]
            delete this.partList[index]
            this.lastEndOutputIndex = index
            this.lookFurther()
        }
    }

    /**
     * Look for tokens before the current beginning that might be in the buffer
     * and prepend them if found
     */
    lookBefore() {
        const index = this.lastBeginOutputIndex - 1
        if (this.partList[index]) {
            this.output = this.partList[index] + this.output
            delete this.partList[index]
            this.lastBeginOutputIndex = index
            this.lookBefore()
        }
    }
}