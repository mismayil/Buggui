'use strict';

var MIN_LENGTH = 50;
var MAX_LENGTH = 200;
var MIN_WIDTH = 25;
var MAX_WIDTH = 150;
var MID_WIDTH = (MAX_WIDTH + MIN_WIDTH) / 2;
var MID_LENGTH = (MAX_LENGTH + MIN_LENGTH) / 2 + 20;

/**
 * A function that creates and returns the scene graph classes and constants.
 */
function createSceneGraphModule() {

    // Part names. Use these to name your different nodes
    var CAR_PART = 'CAR_PART';
    var FRONT_AXLE_PART = 'FRONT_AXLE_PART';
    var BACK_AXLE_PART = 'BACK_AXLE_PART';
    var FRONT_LEFT_TIRE_PART = 'FRONT_LEFT_TIRE_PART';
    var FRONT_RIGHT_TIRE_PART = 'FRONT_RIGHT_TIRE_PART';
    var BACK_LEFT_TIRE_PART = 'BACK_LEFT_TIRE_PART';
    var BACK_RIGHT_TIRE_PART = 'BACK_RIGHT_TIRE_PART';
    var BUMPER_PART = 'BUMPER_PART';
    var FRONT_PART = 'FRONT_PART';
    var BACK_PART = 'BACK_PART';
    var LEFT_PART = 'LEFT_PART';
    var RIGHT_PART = 'RIGHT_PART';
    var FRONT_BUMPER_PART = 'FRONT_BUMPER_PART';
    var BACK_BUMPER_PART = 'BACK_BUMPER_PART';
    var LEFT_BUMPER_PART = 'LEFT_BUMPER_PART';
    var RIGHT_BUMPER_PART = 'RIGHT_BUMPER_PART';

    var GraphNode = function() {
    };

    _.extend(GraphNode.prototype, {

        /**
         * Subclasses should call this function to initialize the object.
         *
         * @param startPositionTransform The transform that should be applied prior
         * to performing any rendering, so that the component can render in its own,
         * local, object-centric coordinate system.
         * @param nodeName The name of the node. Useful for debugging, but also used to uniquely identify each node
         */
        initGraphNode: function(startPositionTransform, nodeName) {

            this.nodeName = nodeName;

            // The transform that will position this object, relative
            // to its parent
            this.startPositionTransform = startPositionTransform;

            // Any additional transforms of this object after the previous transform
            // has been applied
            this.objectTransform = new AffineTransform();

            // Current transform of this node
            this.currentTransform = startPositionTransform;

            // Any child nodes of this node
            this.children = {};

            this.upperLeftX = 0;
            this.upperLeftY = 0;
            this.width = 0;
            this.length = 0;
        },

        addChild: function(graphNode) {
            this.children[graphNode.nodeName] = graphNode;
        },

        /**
         * Swaps a graph node with a new graph node.
         * @param nodeName The name of the graph node
         * @param newNode The new graph node
         */
        replaceGraphNode: function(nodeName, newNode) {
            if (nodeName in this.children) {
                this.children[nodeName] = newNode;
            } else {
                _.each(
                    _.values(this.children),
                    function(child) {
                        child.replaceGraphNode(nodeName, newNode);
                    }
                );
            }
        },

        /**
         * Render this node using the graphics context provided.
         * Prior to doing any painting, the start_position_transform must be
         * applied, so the component can render itself in its local, object-centric
         * coordinate system. See the assignment specs for more details.
         *
         * This method should also call each child's render method.
         * @param context
         */
        render: function(context) {
            // TODO: Should be overridden by subclass
        },

        /**
         * Determines whether a point lies within this object. Be sure the point is
         * transformed correctly prior to performing the hit test.
         */
        pointInObject: function(point) {
            var inverseTransform = this.currentTransform.createInverse();
            var tpoint = point.transform(inverseTransform);

            return (tpoint.x >= this.upperLeftX && tpoint.x <= this.upperLeftX + this.width &&
                    tpoint.y >= this.upperLeftY && tpoint.y <= this.upperLeftY + this.length);
        },

        /**
         * Sets object transform of a node
         * @param objectTransform
         */
        setObjectTransform: function(objectTransform) {
            this.objectTransform = objectTransform.clone();
        },

        /**
         * Return object transform of this node
         * @returns {AffineTransform|*}
         */
        getObjectTransform: function() {
            return this.objectTransform;
        },

        /**
         * Sets starting position transform of a node
         * @param startPositionTransform
         */
        setStartPositionTransform: function(startPositionTransform) {
            this.startPositionTransform = startPositionTransform.clone();
        },

        /**
         * Return starting position transform of this node
         * @returns {AffineTransform|*}
         */
        getStartPositionTransform: function() {
            return this.startPositionTransform;
        },

        /**
         * Set current transform of this node
         */
        setCurrentTransform: function(transform) {
            this.currentTransform = transform.clone();
        },

        /**
         * Get current transform of this node
         */
        getCurrentTransform: function() {
            return this.currentTransform;
        }

    });

    var CarNode = function() {
        this.initGraphNode(new AffineTransform(1, 0, 0, 1, 200, 200), CAR_PART);
        var bumper = new BumperNode();
        var front_axle = new AxleNode(FRONT_AXLE_PART);
        var back_axle = new AxleNode(BACK_AXLE_PART);
        var front_left_tire = new TireNode(FRONT_LEFT_TIRE_PART);
        var front_right_tire = new TireNode(FRONT_RIGHT_TIRE_PART);
        var back_left_tire = new TireNode(BACK_LEFT_TIRE_PART);
        var back_right_tire = new TireNode(BACK_RIGHT_TIRE_PART);
        var front_part = new PartNode(FRONT_PART);
        var back_part = new PartNode(BACK_PART);
        var front_bumper_part = new BumperPartNode(FRONT_BUMPER_PART);
        var back_bumper_part = new BumperPartNode(BACK_BUMPER_PART);
        var left_bumper_part = new BumperPartNode(LEFT_BUMPER_PART);
        var right_bumper_part = new BumperPartNode(RIGHT_BUMPER_PART);

        this.addChild(front_part);
        this.addChild(back_part);
        this.addChild(front_axle);
        this.addChild(back_axle);
        this.addChild(bumper);
        bumper.addChild(front_bumper_part);
        bumper.addChild(back_bumper_part);
        bumper.addChild(left_bumper_part);
        bumper.addChild(right_bumper_part);
        front_axle.addChild(front_left_tire);
        front_axle.addChild(front_right_tire);
        back_axle.addChild(back_left_tire);
        back_axle.addChild(back_right_tire);

        this.upperLeftX = -MID_WIDTH/2;
        this.upperLeftY = -MID_LENGTH/2;
        this.width = MID_WIDTH;
        this.length = MID_LENGTH;
    };

    _.extend(CarNode.prototype, GraphNode.prototype, {
        // Overrides parent method
        render: function(context) {
            var self = this;
            context.save();
            var transform, translationTransform;

            if (self.objectTransform.getTranslateX() != 0 || self.objectTransform.getTranslateY() != 0) {
                translationTransform = new AffineTransform();
                translationTransform.setToTranslation(-self.currentTransform.getTranslateX(), -self.currentTransform.getTranslateY());
                transform = translationTransform.clone().concatenate(self.currentTransform);
                transform = self.objectTransform.clone().concatenate(transform);
                transform = translationTransform.createInverse().clone().concatenate(transform);
            } else {
                transform = self.currentTransform.clone().concatenate(self.objectTransform);
            }

            self.setCurrentTransform(transform);
            context.transform(transform.m00_, transform.m10_, transform.m01_, transform.m11_, transform.m02_, transform.m12_);
            context.beginPath();
            // car body
            context.fillStyle = 'red';
            context.fillRect(self.upperLeftX, self.upperLeftY, self.width, self.length);
            // car front window
            context.rect(-MID_WIDTH/4, -MID_LENGTH/4, MID_WIDTH/2, MID_LENGTH/6);
            context.fillStyle = 'white';
            context.fill();
            context.lineWidth = 3;
            context.strokeStyle = 'black';
            context.stroke();
            // car back window
            context.fillRect(-MID_WIDTH/4, MID_LENGTH/6, MID_WIDTH/2, MID_LENGTH/6);
            context.closePath();
            context.beginPath();
            // car left headlight
            context.arc(-MID_WIDTH/4, -MID_LENGTH/2+7, 7, 0, 2 * Math.PI, false);
            context.fillStyle = 'yellow';
            context.fill();
            // car right headlight
            context.arc(MID_WIDTH/4, -MID_LENGTH/2+7, 7, 0, 2 * Math.PI, false);
            context.fill();
            context.closePath();
            context.restore();

            _.each(
                self.children,
                function(childNode) {
                    childNode.setObjectTransform(transform);
                    childNode.render(context);
                }
            );
        }
    });

    /**
     * @param axlePartName Which axle this node represents
     * @constructor
     */
    var AxleNode = function(axlePartName) {
        if (axlePartName == FRONT_AXLE_PART) this.initGraphNode(new AffineTransform(1, 0, 0, 1, 0, -MID_LENGTH/4), axlePartName);
        else this.initGraphNode(new AffineTransform(1, 0, 0, 1, 0, MID_LENGTH/4), axlePartName);
    };

    _.extend(AxleNode.prototype, GraphNode.prototype, {
        // Overrides parent method
        render: function(context) {
            var self = this;
            context.save();
            var transform = self.objectTransform.clone().concatenate(self.startPositionTransform);
            self.setCurrentTransform(transform);
            context.transform(transform.m00_, transform.m10_, transform.m01_, transform.m11_, transform.m02_, transform.m12_);
            context.beginPath();
            //context.strokeStyle = 'black';
            //context.moveTo(-MID_WIDTH/2, 0);
            //context.lineTo(MID_WIDTH/2, 0);
            //context.stroke();
            context.closePath();
            context.restore();

            _.each(
                self.children,
                function(childNode) {
                    childNode.setObjectTransform(transform);
                    childNode.render(context);
                }
            );
        }
    });

    /**
     * @param tirePartName Which tire this node represents
     * @constructor
     */
    var TireNode = function(tirePartName) {
        switch (tirePartName) {
            case FRONT_LEFT_TIRE_PART:
            case BACK_LEFT_TIRE_PART:
                this.initGraphNode(new AffineTransform(1, 0, 0, 1, -MID_WIDTH/2-5, 0), tirePartName);
                break;
            case FRONT_RIGHT_TIRE_PART:
            case BACK_RIGHT_TIRE_PART:
                this.initGraphNode(new AffineTransform(1, 0, 0, 1, MID_WIDTH/2+5, 0), tirePartName);
                break;
        }

        this.upperLeftX = -MID_WIDTH/16;
        this.upperLeftY = -MID_LENGTH/8;
        this.width = MID_WIDTH/8;
        this.length = MID_LENGTH/4;
    };

    _.extend(TireNode.prototype, GraphNode.prototype, {
        // Overrides parent method
        render: function(context) {
            var self = this;
            context.save();
            var transform = self.objectTransform.clone().concatenate(self.startPositionTransform);
            self.setCurrentTransform(transform);
            context.transform(transform.m00_, transform.m10_, transform.m01_, transform.m11_, transform.m02_, transform.m12_);
            context.beginPath();
            context.fillStyle = 'black';
            context.fillRect(-MID_WIDTH/16, -MID_LENGTH/8, MID_WIDTH/8, MID_LENGTH/4);
            context.closePath();
            context.restore();

            _.each(
                self.children,
                function(childNode) {
                    childNode.setObjectTransform(transform);
                    childNode.render(context);
                }
            );
        }
    });

    var BumperNode = function() {
        this.initGraphNode(new AffineTransform(), BUMPER_PART);
    };

    _.extend(BumperNode.prototype, GraphNode.prototype, {
        // Overrides parent method
        render: function(context) {
            var self = this;
            context.save();
            var transform = self.objectTransform.clone().concatenate(self.startPositionTransform);
            self.setCurrentTransform(transform);
            context.transform(transform.m00_, transform.m10_, transform.m01_, transform.m11_, transform.m02_, transform.m12_);
            context.beginPath();
            //context.lineWidth = 4;
            //context.strokeStyle = 'black';
            //context.rect(-MID_WIDTH/2, -MID_LENGTH/2, MID_WIDTH, MID_LENGTH);
            //context.stroke();
            context.closePath();
            context.restore();

            _.each(
                self.children,
                function(childNode) {
                    childNode.setObjectTransform(transform);
                    childNode.render(context);
                }
            );
        }
    });

    var PartNode = function(partName) {
        if (partName == FRONT_PART) {
            this.initGraphNode(new AffineTransform(1, 0, 0, 1, 0, -4 * MID_LENGTH / 12), partName);
        }

        if (partName == BACK_PART) {
            this.initGraphNode(new AffineTransform(1, 0, 0, 1, 0, 5 * MID_LENGTH / 12), partName);
        }

        this.upperLeftX = -MID_WIDTH/2;
        this.upperLeftY = -MID_LENGTH/6;
        this.width = MID_WIDTH;
        this.length = MID_LENGTH/4;
    };

    _.extend(PartNode.prototype, GraphNode.prototype, {
        // Overrides parent method
        render: function(context) {
            var self = this;
            context.save();
            var transform = self.objectTransform.clone().concatenate(self.startPositionTransform);
            context.transform(transform.m00_, transform.m10_, transform.m01_, transform.m11_, transform.m02_, transform.m12_);
            self.setCurrentTransform(transform);
            context.beginPath();
            //context.fillStyle = 'blue';
            //context.fillRect(-MID_WIDTH/2, -MID_LENGTH/6, MID_WIDTH, MID_LENGTH/4);
            context.closePath();
            context.restore();

            _.each(
                self.children,
                function(childNode) {
                    childNode.setObjectTransform(transform);
                    childNode.render(context);
                }
            );
        }
    });

    var BumperPartNode = function(bumperPartName) {
        if (bumperPartName == FRONT_BUMPER_PART) {
            this.initGraphNode(new AffineTransform(1, 0, 0, 1, 0, -MID_LENGTH/2), bumperPartName);
            this.upperLeftX = -MID_WIDTH/2;
            this.upperLeftY = -1;
            this.width = MID_WIDTH;
            this.length = 5;
        }

        if (bumperPartName == BACK_BUMPER_PART) {
            this.initGraphNode(new AffineTransform(1, 0, 0, 1, 0, MID_LENGTH/2), bumperPartName);
            this.upperLeftX = -MID_WIDTH/2;
            this.upperLeftY = -1;
            this.width = MID_WIDTH;
            this.length = 5;
        }

        if (bumperPartName == LEFT_BUMPER_PART) {
            this.initGraphNode(new AffineTransform(1, 0, 0, 1, -MID_WIDTH/2, 0), bumperPartName);
            this.upperLeftX = -1;
            this.upperLeftY = -MID_LENGTH/2;
            this.width = 5;
            this.length = MID_LENGTH;
        }

        if (bumperPartName == RIGHT_BUMPER_PART) {
            this.initGraphNode(new AffineTransform(1, 0, 0, 1, MID_WIDTH/2, 0), bumperPartName);
            this.upperLeftX = 1;
            this.upperLeftY = -MID_LENGTH/2;
            this.width = 5;
            this.length = MID_LENGTH;
        }
    };

    _.extend(BumperPartNode.prototype, GraphNode.prototype, {
        // Overrides parent method
        render: function(context) {
            var self = this;
            context.save();
            var transform = self.objectTransform.clone().concatenate(self.startPositionTransform);
            context.transform(transform.m00_, transform.m10_, transform.m01_, transform.m11_, transform.m02_, transform.m12_);
            self.setCurrentTransform(transform);
            context.beginPath();
            context.strokeStyle = 'blue';
            context.lineWidth = 2;
            if (self.nodeName == FRONT_BUMPER_PART || self.nodeName == BACK_BUMPER_PART) context.rect(-MID_WIDTH/2, -1, MID_WIDTH, 2);
            else context.rect(-1, -MID_LENGTH/2, 2, MID_LENGTH);
            context.stroke();
            context.closePath();
            context.restore();

            _.each(
                self.children,
                function(childNode) {
                    childNode.setObjectTransform(transform);
                    childNode.render(context);
                }
            );
        }
    });

    // Return an object containing all of our classes and constants
    return {
        GraphNode: GraphNode,
        CarNode: CarNode,
        AxleNode: AxleNode,
        TireNode: TireNode,
        BumperNode: BumperNode,
        PartNode: PartNode,
        BumperPartNode: BumperPartNode,
        CAR_PART: CAR_PART,
        FRONT_AXLE_PART: FRONT_AXLE_PART,
        BACK_AXLE_PART: BACK_AXLE_PART,
        FRONT_LEFT_TIRE_PART: FRONT_LEFT_TIRE_PART,
        FRONT_RIGHT_TIRE_PART: FRONT_RIGHT_TIRE_PART,
        BACK_LEFT_TIRE_PART: BACK_LEFT_TIRE_PART,
        BACK_RIGHT_TIRE_PART: BACK_RIGHT_TIRE_PART,
        BUMPER_PART: BUMPER_PART,
        FRONT_PART: FRONT_PART,
        BACK_PART: BACK_PART,
        LEFT_PART: LEFT_PART,
        RIGHT_PART: RIGHT_PART,
        FRONT_BUMPER_PART: FRONT_BUMPER_PART,
        BACK_BUMPER_PART: BACK_BUMPER_PART,
        LEFT_BUMPER_PART: LEFT_BUMPER_PART,
        RIGHT_BUMPER_PART: RIGHT_BUMPER_PART,
    };
}

function point(x, y) {
    this.x = x;
    this.y = y;

    this.transform = function(affineTransform) {
        var tx = affineTransform.m00_*this.x + affineTransform.m01_*this.y + affineTransform.m02_;
        var ty = affineTransform.m10_*this.x + affineTransform.m11_*this.y + affineTransform.m12_;

        return new point(tx, ty);
    }
}