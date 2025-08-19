/**
 * A node in grid. 
 * This class holds some basic information about a node and custom 
 * attributes may be added, depending on the algorithms' needs.
 * @constructor
 * @param {number} x - The x coordinate of the node on the grid.
 * @param {number} y - The y coordinate of the node on the grid.
 * @param {boolean} [walkable] - Whether this node is walkable.
 */
function Node(x, y, walkable) {
    /*! edit by meta3d */

    // /**
    //  * The x coordinate of the node on the grid.
    //  * @type number
    //  */
    // this.x = x;
    // /**
    //  * The y coordinate of the node on the grid.
    //  * @type number
    //  */
    // this.y = y;
    // /**
    //  * Whether this node can be walked through.
    //  * @type boolean
    //  */
    // this.walkable = (walkable === undefined ? true : walkable);


    // // /*!edit by meta3d */
    // // this.clone = () => {
    // //     return new Node(this.x, this.y, this.walkable)
    // // }

    // /*! edit by meta3d */
    // // this.g = null
    // this.g = -1000

    throw new Error("err")
}

module.exports = Node;