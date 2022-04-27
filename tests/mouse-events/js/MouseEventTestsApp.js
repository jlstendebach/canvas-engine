import {
    App,
    CircleView,
    LabelView,
    LineStringView,
    MouseButton,
    MouseEvent,
    MouseWheelEvent,
    RectangleView,
} from "../../../src/index.js"

export class MouseEventTestsApp extends App {
    constructor(canvasName) {
        super(canvasName);
        this.initCanvas();

        this.backgroundMargin = 10;
        this.backgroundPadding = 20;

        this.background = this.initBackground();
        this.leftRect = this.initLeftRect();
        this.rightRect = this.initRightRect();

        this.initDragRects(10);          
        this.initClickRects(70);  
        this.initMoveRects(130); 
    }

    initCanvas() {
        this.canvas.setFillStyle("black");
    }

    initBackground() {
        this.background = this.createRect(
            this.backgroundMargin, this.backgroundMargin, 
            this.canvas.getWidth()-this.backgroundMargin*2, 
            this.canvas.getHeight()-this.backgroundMargin*2, 
            "#222"
        );

        this.background.addEventListener(MouseEvent.DRAG, function(t, e) {
            e.target.setX(e.target.getX() + e.dx);
            e.target.setY(e.target.getY() + e.dy);
        }.bind(this));
        
        return this.background;
    }

    initLeftRect() {
        this.leftRect = this.createRect(
            this.backgroundPadding, 
            this.backgroundPadding, 
            this.background.getWidth()/2-this.backgroundPadding*1.5, 
            this.background.getHeight()-this.backgroundPadding*2, 
            "#444",
            this.background
        );

        let cursor = this.createCircle(0, 0, 5, "yellow", this.leftRect);
        this.leftRect.addEventListener(MouseEvent.MOVE, function(t, e) {
            cursor.setX(e.x);
            cursor.setY(e.y);
        }.bind(this));

        return this.leftRect;
    }

    initRightRect() {
        this.rightRect = this.createRect(
            this.leftRect.getX() + this.leftRect.getWidth() + this.backgroundPadding, 
            this.backgroundPadding, 
            this.background.getWidth()/2-this.backgroundPadding*1.5, 
            this.background.getHeight()-this.backgroundPadding*2, 
            "#444",
            this.background
        );

        let blockingView = this.createRect(100, 100, 100, 100, "black", this.rightRect)
        blockingView.addEventListener(MouseEvent.ENTER, function(t, e) {
            this.createCircle(e.x, e.y, 3, "lime", e.target);
        }.bind(this));
        blockingView.addEventListener(MouseEvent.EXIT, function(t, e) {
            this.createCircle(e.x, e.y, 3, "pink", e.target);
        }.bind(this));

        this.rightRect.addView(blockingView);

        let lineString = new LineStringView();
        lineString.setStrokeWidth(3);
        lineString.setStrokeStyle("white");
        this.rightRect.addView(lineString);

        let cursor = this.createCircle(0, 0, 5, "yellow", this.rightRect);
        let mouseDownCircle = this.createCircle(0, 0, 5, "white", this.rightRect);
        let mouseUpCircle = this.createCircle(0, 0, 5, "black", this.rightRect);
        let mouseEnterCircle = this.createCircle(0, 0, 5, "green", this.rightRect);
        let mouseExitCircle = this.createCircle(0, 0, 5, "red", this.rightRect);


        this.rightRect.addEventListener(MouseEvent.DOWN, function(t, e) {
            mouseDownCircle.setX(e.x);
            mouseDownCircle.setY(e.y);
            mouseUpCircle.setVisible(false);
            lineString.clear();
            lineString.addPoint(e.x, e.y);    
        }.bind(this));

        this.rightRect.addEventListener(MouseEvent.UP, function(t, e) {
            mouseUpCircle.setX(e.x);
            mouseUpCircle.setY(e.y);
            mouseUpCircle.setVisible(true);
            lineString.addPoint(e.x, e.y);
        }.bind(this));
        
        this.rightRect.addEventListener(MouseEvent.MOVE, function(t, e) {
            cursor.setX(e.x);
            cursor.setY(e.y);
        }.bind(this));
        
        this.rightRect.addEventListener(MouseEvent.DRAG, function(t, e) {
            lineString.addPoint(e.x, e.y);
            switch (e.button) {
                case MouseButton.LEFT:
                    lineString.setStrokeStyle("white");
                    break;
                case MouseButton.RIGHT:
                    lineString.setStrokeStyle("red");
                    break;
                case MouseButton.MIDDLE:
                    lineString.setStrokeStyle("green");
                    break;
                case MouseButton.MOUSE4:
                    lineString.setStrokeStyle("blue");
                    break;
                case MouseButton.MOUSE5:
                    lineString.setStrokeStyle("yellow");
                    break;
                default:
                    lineString.setStrokeStyle("black");
                    break;
                }
        }.bind(this));
        
        this.rightRect.addEventListener(MouseEvent.ENTER, function(t, e) {
            mouseEnterCircle.setX(e.x);
            mouseEnterCircle.setY(e.y);
        }.bind(this));
        
        this.rightRect.addEventListener(MouseEvent.EXIT, function(t, e) {
            mouseExitCircle.setX(e.x);
            mouseExitCircle.setY(e.y);
        }.bind(this));

        return this.rightRect;
    }

    initDragRects(y) {
        let w = 70; 
        let h = 50;
        let dragRects = [
            this.createDragRect(0*w + 1*10, y, w, h, MouseButton.LEFT  , this.leftRect),
            this.createDragRect(1*w + 2*10, y, w, h, MouseButton.RIGHT , this.leftRect),
            this.createDragRect(2*w + 3*10, y, w, h, MouseButton.MIDDLE, this.leftRect),
            this.createDragRect(3*w + 4*10, y, w, h, MouseButton.MOUSE4, this.leftRect),
            this.createDragRect(4*w + 5*10, y, w, h, MouseButton.MOUSE5, this.leftRect),
        ];

        dragRects[0].addView(this.createLabel(w, h, "left click drag"));
        dragRects[1].addView(this.createLabel(w, h, "right click drag"));
        dragRects[2].addView(this.createLabel(w, h, "middle click drag"));
        dragRects[3].addView(this.createLabel(w, h, "mouse4 click drag"));
        dragRects[4].addView(this.createLabel(w, h, "mouse5 click drag"));
    }

    initClickRects(y) {
        let w = 70; 
        let h = 50;
        let clickRects = [
            this.createClickRect(0*w + 1*10, y, w, h, MouseButton.LEFT  , this.leftRect),
            this.createClickRect(1*w + 2*10, y, w, h, MouseButton.RIGHT , this.leftRect),
            this.createClickRect(2*w + 3*10, y, w, h, MouseButton.MIDDLE, this.leftRect),
            this.createClickRect(3*w + 4*10, y, w, h, MouseButton.MOUSE4, this.leftRect),
            this.createClickRect(4*w + 5*10, y, w, h, MouseButton.MOUSE5, this.leftRect),
        ];

        clickRects[0].addView(this.createLabel(w, h, "left click"));
        clickRects[1].addView(this.createLabel(w, h, "right click"));
        clickRects[2].addView(this.createLabel(w, h, "middle click"));
        clickRects[3].addView(this.createLabel(w, h, "mouse4 click"));
        clickRects[4].addView(this.createLabel(w, h, "mouse5 click"));
    }

    initMoveRects(y) {
        let w = 70; 
        let h = 50;
        let enterExitRect = this.createRect(0*w + 1*10, y, w, h, "#00f", this.leftRect);
        enterExitRect.addEventListener(MouseEvent.ENTER, function(t, e) {
            enterExitRect.setFillStyle("#00a");
        });
        enterExitRect.addEventListener(MouseEvent.EXIT, function(t, e) {
            enterExitRect.setFillStyle("#00f");
        });
        enterExitRect.addView(this.createLabel(w, h, "enter/exit"));

        let wheelRect = this.createRect(1*w + 2*10, y, w, h, "#00f", this.leftRect);
        wheelRect.addEventListener(MouseWheelEvent.name, function(t, e) {
            wheelRect.setWidth(wheelRect.getWidth() + 3*e.amount);
            wheelRect.setHeight(wheelRect.getHeight() + 3*e.amount);
        });
        wheelRect.addView(this.createLabel(w, h, "scroll wheel"));
    }


    // --[ helpers ]------------------------------------------------
    createClickRect(x, y, w, h, button, parent) {
        let rect = this.createRect(x, y, w, h, "#0f0", parent);
        rect.addEventListener(MouseEvent.DOWN, function(t, e) {
            if (e.button == button) {
                rect.setFillStyle("#0a0");
            }
        });
        rect.addEventListener(MouseEvent.UP, function(t, e) {
            if (e.button == button) {
                rect.setFillStyle(e.target == e.related ? "#0f0" : "#020");
            }
        });
        return rect;
    }

    createDragRect(x, y, w, h, button, parent) {
        let rect = this.createRect(x, y, w, h, "#f00", parent);
        rect.addEventListener(MouseEvent.DRAG, function(t, e) {
            if (e.button == button) {
                let pos = e.getParentXY();
                rect.setX(pos.x);
                rect.setY(pos.y);
            }
        });
        rect.addEventListener(MouseEvent.DOWN, function(t, e) {
            if (e.button == button) {
                rect.setFillStyle("#a00");
            }
        });
        rect.addEventListener(MouseEvent.UP, function(t, e) {
            if (e.button == button) {
                rect.setFillStyle(e.target == e.related ? "#f00" : "#200");
            }

        });
        return rect;
    }

    createRect(x, y, w, h, color, parent = this.canvas) {
        let rect = new RectangleView(w, h);
        rect.setX(x);
        rect.setY(y);
        rect.setFillStyle(color);  
        parent.addView(rect);
        return rect;
    }

    createLabel(w, h, text) {
        let label = new LabelView();
        label.setX(5);
        label.setY(5);
        label.setWidth(w-10);
        label.setHeight(h-10);
        label.setText(text);
        label.setWordWrap(true);
        label.setPickable(false);
        label.setFillColor("black");
        return label;
    }

    createCircle(x, y, radius, color, parent) {
        let circle = new CircleView(radius);
        circle.setX(x);
        circle.setY(y);
        circle.setFillStyle(color);
        circle.setStrokeStyle(null);
        circle.setPickable(false);
        parent.addView(circle);
        return circle;
    }

}