'use strict';

// This should be your main point of entry for your app

window.addEventListener('load', function() {
    var sceneGraphModule = createSceneGraphModule();
    var appContainer = document.getElementById('app-container');
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var car = new sceneGraphModule.CarNode();
    var bumper = car.children[sceneGraphModule.BUMPER_PART];//new sceneGraphModule.BumperNode();
    var front_axle = car.children[sceneGraphModule.FRONT_AXLE_PART];//new sceneGraphModule.AxleNode(sceneGraphModule.FRONT_AXLE_PART);
    var back_axle = car.children[sceneGraphModule.BACK_AXLE_PART];//new sceneGraphModule.AxleNode(sceneGraphModule.BACK_AXLE_PART);
    var front_left_tire = front_axle.children[sceneGraphModule.FRONT_LEFT_TIRE_PART];//new sceneGraphModule.TireNode(sceneGraphModule.FRONT_LEFT_TIRE_PART);
    var front_right_tire = front_axle.children[sceneGraphModule.FRONT_RIGHT_TIRE_PART];//new sceneGraphModule.TireNode(sceneGraphModule.FRONT_RIGHT_TIRE_PART);
    var back_left_tire = back_axle.children[sceneGraphModule.BACK_LEFT_TIRE_PART];//new sceneGraphModule.TireNode(sceneGraphModule.BACK_LEFT_TIRE_PART);
    var back_right_tire = back_axle.children[sceneGraphModule.BACK_RIGHT_TIRE_PART];//new sceneGraphModule.TireNode(sceneGraphModule.BACK_RIGHT_TIRE_PART);
    var front_part = car.children[sceneGraphModule.FRONT_PART];//new sceneGraphModule.PartNode(sceneGraphModule.FRONT_PART);
    var back_part = car.children[sceneGraphModule.BACK_PART]; //new sceneGraphModule.PartNode(sceneGraphModule.BACK_PART);
    var front_bumper_part = bumper.children[sceneGraphModule.FRONT_BUMPER_PART];//new sceneGraphModule.BumperPartNode(sceneGraphModule.FRONT_BUMPER_PART);
    var back_bumper_part = bumper.children[sceneGraphModule.BACK_BUMPER_PART];//new sceneGraphModule.BumperPartNode(sceneGraphModule.BACK_BUMPER_PART);
    var left_bumper_part = bumper.children[sceneGraphModule.LEFT_BUMPER_PART];//new sceneGraphModule.BumperPartNode(sceneGraphModule.LEFT_BUMPER_PART);
    var right_bumper_part = bumper.children[sceneGraphModule.RIGHT_BUMPER_PART];//new sceneGraphModule.BumperPartNode(sceneGraphModule.RIGHT_BUMPER_PART);
    var oldMouseMovePoint, mouseMovePoint, mouseX, mouseY;
    var isMouseDownOnCar = false, isMouseDownOnFront = false, isMouseDownOnBack = false;
    var isMouseDownOnFrontBumper = false, isMouseDownOnBackBumper = false, isMouseDownOnLeftBumper = false, isMouseDownOnRightBumper = false;
    var isMouseDownOnFrontTire = false, isMouseDownOnBackTire = false;
    var canvasOffsetLeft = appContainer.offsetLeft + canvas.offsetLeft;
    var canvasOffsetTop = appContainer.offsetTop + canvas.offsetTop;

    canvas.width = 800;
    canvas.height = 600;

    context.fillStyle = 'grey';
    context.fillRect(0, 0, canvas.width, canvas.height);

    car.render(context);

    canvas.addEventListener('mousedown', function(event) {
        mouseX = event.pageX - canvasOffsetLeft;
        mouseY = event.pageY - canvasOffsetTop;
        var mouseDownPoint = new point(mouseX, mouseY);

        oldMouseMovePoint = mouseDownPoint;

        if (car.pointInObject(mouseDownPoint)) {
            isMouseDownOnCar = true;
        }

        if (front_part.pointInObject(mouseDownPoint)) {
            isMouseDownOnFront = true;
        }

        if (back_part.pointInObject(mouseDownPoint)) {
            isMouseDownOnBack = true;
        }

        if (front_bumper_part.pointInObject(mouseDownPoint)) {
            isMouseDownOnFrontBumper = true;
        }

        if (back_bumper_part.pointInObject(mouseDownPoint)) {
            isMouseDownOnBackBumper = true;
        }

        if (left_bumper_part.pointInObject(mouseDownPoint)) {
            isMouseDownOnLeftBumper = true;
        }

        if (right_bumper_part.pointInObject(mouseDownPoint)) {
            isMouseDownOnRightBumper = true;
        }

        if (front_left_tire.pointInObject(mouseDownPoint) || front_right_tire.pointInObject(mouseDownPoint)) {
            isMouseDownOnFrontTire = true;
        }

        if (back_left_tire.pointInObject(mouseDownPoint) || back_right_tire.pointInObject(mouseDownPoint)) {
            isMouseDownOnBackTire = true;
        }
    });

    canvas.addEventListener('mousemove', function(event) {
        mouseX = event.pageX - canvasOffsetLeft;
        mouseY = event.pageY - canvasOffsetTop;
        var transform = new AffineTransform();
        mouseMovePoint = new point(mouseX, mouseY);

        var newWidth, newLength, center, centerX, centerY, theta;

        if (car.pointInObject(mouseMovePoint)) {
            canvas.style.cursor = 'move';
        } else {
            canvas.style.cursor = 'default';
        }

        if (front_part.pointInObject(mouseMovePoint) || back_part.pointInObject(mouseMovePoint)) {
            canvas.style.cursor = 'crosshair';
        }

        if (front_bumper_part.pointInObject(mouseMovePoint) || back_bumper_part.pointInObject(mouseMovePoint)) {
            canvas.style.cursor = 'ns-resize';
        } else if (left_bumper_part.pointInObject(mouseMovePoint) || right_bumper_part.pointInObject(mouseMovePoint)) {
            canvas.style.cursor = 'ew-resize';
        }

        if (isMouseDownOnFrontTire || isMouseDownOnBackTire) {

            transform.scale(Math.abs(oldMouseMovePoint.x / mouseMovePoint.x), 1);
            centerX = back_left_tire.getCurrentTransform().getTranslateX();
            centerY = back_left_tire.getCurrentTransform().getTranslateY();
            center = new point(centerX, centerY);

            theta = findAngle(center, oldMouseMovePoint, mouseMovePoint);

            newWidth = back_left_tire.width * back_left_tire.getCurrentTransform().getScaleX() * transform.getScaleX();

            if (newWidth >= MID_WIDTH/8 && newWidth <= 75) {
                back_left_tire.setStartPositionTransform(transform.clone().preConcatenate(back_left_tire.getStartPositionTransform()));
                back_right_tire.setStartPositionTransform(transform.clone().preConcatenate(back_right_tire.getStartPositionTransform()));

                if (theta >= -Math.PI / 4 && theta <= Math.PI / 4) {
                    transform.rotate(theta, 1, 1);
                    front_left_tire.setStartPositionTransform(transform.clone().preConcatenate(front_left_tire.getStartPositionTransform()));
                    front_right_tire.setStartPositionTransform(transform.clone().preConcatenate(front_right_tire.getStartPositionTransform()));
                }

                car.setObjectTransform(new AffineTransform());
                clear(canvas);
                car.render(context);
            }

        } else

        if (isMouseDownOnFrontBumper || isMouseDownOnBackBumper) {

            transform.scale(1, Math.abs(oldMouseMovePoint.y / mouseMovePoint.y));

            newLength = car.length * car.getCurrentTransform().getScaleY() * transform.getScaleY();

            if (newLength >= MIN_LENGTH && newLength <= MAX_LENGTH) {
                car.setObjectTransform(transform);
                clear(canvas);
                car.render(context);
            }

        } else

        if (isMouseDownOnLeftBumper || isMouseDownOnRightBumper) {

            transform.scale(Math.abs(oldMouseMovePoint.x / mouseMovePoint.x), 1);
            newWidth = car.width * car.getCurrentTransform().getScaleX() * transform.getScaleX();

            if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
                car.setObjectTransform(transform);
                clear(canvas);
                car.render(context);
            }
        } else {

            if (isMouseDownOnFront || isMouseDownOnBack) {
                centerX = car.getCurrentTransform().getTranslateX();
                centerY = car.getCurrentTransform().getTranslateY();
                center = new point(centerX, centerY);

                theta = findAngle(center, oldMouseMovePoint, mouseMovePoint);
                transform.rotate(theta, 1, 1);
                car.setObjectTransform(transform);
                clear(canvas);
                car.render(context);
            } else

            if (isMouseDownOnCar) {
                transform.translate(mouseMovePoint.x - oldMouseMovePoint.x, mouseMovePoint.y - oldMouseMovePoint.y);
                car.setObjectTransform(transform);
                clear(canvas);
                car.render(context);
            }
        }

        oldMouseMovePoint = mouseMovePoint;
    });

    window.addEventListener('mouseup', function(event) {
        isMouseDownOnCar = false;
        isMouseDownOnFront = false;
        isMouseDownOnBack = false;
        isMouseDownOnFrontBumper = false;
        isMouseDownOnBackBumper = false;
        isMouseDownOnLeftBumper = false;
        isMouseDownOnRightBumper = false;
        isMouseDownOnFrontTire = false;
        isMouseDownOnBackTire = false;
        canvas.style.cursor = 'default';
    });
});

function clear(canvas) {
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'grey';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function findAngle(center, p1, p2) {

    if (p1.x - center.x == 0 || p2.x - center.x == 0) return 0;

    var s1 = (p1.y - center.y) / (p1.x - center.x);
    var s2 = (p2.y - center.y) / (p2.x - center.x);

    var theta = Math.atan((s2-s1)/(1+s2*s1));
    return theta;
}