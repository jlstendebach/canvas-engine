import { Transform, Vec2 } from "@canvas-engine";
import { beforeEach, describe, expect, jest, test } from "@jest/globals";

describe("Transform", () => {
    // -------------------------------------------------------------------------
    // MARK: - Setup
    // -------------------------------------------------------------------------

    let transform;
    const onInvalidated = jest.fn();;
    const initialX = 1;
    const initialY = 2;
    const initialPivotX = 3;
    const initialPivotY = 4;
    const initialScaleX = 5;
    const initialScaleY = 6;
    const initialRotation = Math.PI / 4;

    const resetTransform = () => {
        transform = new Transform(onInvalidated).set(
            initialX,
            initialY,
            initialPivotX,
            initialPivotY,
            initialScaleX,
            initialScaleY,
            initialRotation
        );

        // Force matrix calculation to ensure initial state is set
        transform.getMatrix();

        onInvalidated.mockClear();
    };

    beforeEach(() => {
        resetTransform();
    });

    // -------------------------------------------------------------------------
    // MARK: - Position Accessors
    // -------------------------------------------------------------------------

    describe("get x()", () => {
        test("returns the x position", () => {
            expect(transform.x).toBe(initialX);
        });
    });

    describe("set x(value)", () => {
        test("sets the x position by deferring to setX", () => {
            const setXSpy = jest.spyOn(transform, "setX");
            const newX = initialX + 10;
            transform.x = newX;
            expect(transform.x).toBe(newX);
            expect(transform.getPosition().x).toBe(newX);
            expect(setXSpy).toHaveBeenCalledWith(newX);
        });
    });

    describe("get y()", () => {
        test("returns the y position", () => {
            expect(transform.y).toBe(initialY);
        });
    });

    describe("set y(value)", () => {
        test("sets the y position by deferring to setY", () => {
            const setYSpy = jest.spyOn(transform, "setY");
            const newY = initialY + 10;
            transform.y = newY;
            expect(transform.y).toBe(newY);
            expect(transform.getPosition().y).toBe(newY);
            expect(setYSpy).toHaveBeenCalledWith(newY);
        });
    });

    // -------------------------------------------------------------------------
    // MARK: - Pivot Accessors
    // -------------------------------------------------------------------------

    describe("get pivotX()", () => {
        test("returns the pivotX value", () => {
            expect(transform.pivotX).toBe(initialPivotX);
        });
    });

    describe("set pivotX(value)", () => {
        test("sets the pivotX value by deferring to setPivotX", () => {
            const setPivotXSpy = jest.spyOn(transform, "setPivotX");
            const newPivotX = initialPivotX + 10;
            transform.pivotX = newPivotX;
            expect(transform.pivotX).toBe(newPivotX);
            expect(transform.getPivot().x).toBe(newPivotX);
            expect(setPivotXSpy).toHaveBeenCalledWith(newPivotX);
        });
    });

    describe("get pivotY()", () => {
        test("returns the pivotY value", () => {
            expect(transform.pivotY).toBe(initialPivotY);
        });
    });

    describe("set pivotY(value)", () => {
        test("sets the pivotY value by deferring to setPivotY", () => {
            const setPivotYSpy = jest.spyOn(transform, "setPivotY");
            const newPivotY = initialPivotY + 10;
            transform.pivotY = newPivotY;
            expect(transform.pivotY).toBe(newPivotY);
            expect(transform.getPivot().y).toBe(newPivotY);
            expect(setPivotYSpy).toHaveBeenCalledWith(newPivotY);
        });
    });

    // -------------------------------------------------------------------------
    // MARK: - Scale Accessors
    // -------------------------------------------------------------------------

    describe("get scaleX()", () => {
        test("returns the scaleX value", () => {
            expect(transform.scaleX).toBe(initialScaleX);
        });
    });

    describe("set scaleX(value)", () => {
        test("sets the scaleX value by deferring to setScaleX", () => {
            const setScaleXSpy = jest.spyOn(transform, "setScaleX");
            const newScaleX = initialScaleX + 10;
            transform.scaleX = newScaleX;
            expect(transform.scaleX).toBe(newScaleX);
            expect(transform.getScale().x).toBe(newScaleX);
            expect(setScaleXSpy).toHaveBeenCalledWith(newScaleX);
        });
    });

    describe("get scaleY()", () => {
        test("returns the scaleY value", () => {
            expect(transform.scaleY).toBe(initialScaleY);
        });
    });

    describe("set scaleY(value)", () => {
        test("sets the scaleY value by deferring to setScaleY", () => {
            const setScaleYSpy = jest.spyOn(transform, "setScaleY");
            const newScaleY = initialScaleY + 10;
            transform.scaleY = newScaleY;
            expect(transform.scaleY).toBe(newScaleY);
            expect(transform.getScale().y).toBe(newScaleY);
            expect(setScaleYSpy).toHaveBeenCalledWith(newScaleY);
        });
    });

    // -------------------------------------------------------------------------
    // MARK: - Rotation Accessors
    // -------------------------------------------------------------------------

    describe("get rotation()", () => {
        test("returns the rotation value", () => {
            expect(transform.rotation).toBeCloseTo(initialRotation);
        });
    });

    describe("set rotation(value)", () => {
        test("sets the rotation value by deferring to setRotation", () => {
            const setRotationSpy = jest.spyOn(transform, "setRotation");
            const newRotation = initialRotation + Math.PI / 4;
            transform.rotation = newRotation;
            expect(transform.rotation).toBeCloseTo(newRotation);
            expect(setRotationSpy).toHaveBeenCalledWith(newRotation);
        });
    });

    // -------------------------------------------------------------------------
    // MARK: - Matrix Accessors
    // -------------------------------------------------------------------------

    describe("get a()", () => {
        test("returns the a value", () => {
            const expected = Math.cos(initialRotation) * initialScaleX;
            expect(transform.a).toBeCloseTo(expected);
        });
    });

    describe("get b()", () => {
        test("returns the b value", () => {
            const expected = Math.sin(initialRotation) * initialScaleX;
            expect(transform.b).toBeCloseTo(expected);
        });
    });

    describe("get c()", () => {
        test("returns the c value", () => {
            const expected = -Math.sin(initialRotation) * initialScaleY;
            expect(transform.c).toBeCloseTo(expected);
        });
    });

    describe("get d()", () => {
        test("returns the d value", () => {
            const expected = Math.cos(initialRotation) * initialScaleY;
            expect(transform.d).toBeCloseTo(expected);
        });
    });

    describe("get tx()", () => {
        test("returns the tx value", () => {
            const expected = initialX - (transform.a * initialPivotX + transform.c * initialPivotY);
            expect(transform.tx).toBeCloseTo(expected);
        });
    });

    describe("get ty()", () => {
        test("returns the ty value", () => {
            const expected = initialY - (transform.b * initialPivotX + transform.d * initialPivotY);
            expect(transform.ty).toBeCloseTo(expected);
        });
    });

    // -------------------------------------------------------------------------
    // MARK: - Inverse Matrix Accessors
    // -------------------------------------------------------------------------

    describe("get inverseA()", () => {
        test("returns the inverse a value", () => {
            const determinant = transform.a * transform.d - transform.b * transform.c;
            const expected = transform.d / determinant;
            expect(transform.inverseA).toBeCloseTo(expected);
        });
    });

    describe("get inverseB()", () => {
        test("returns the inverse b value", () => {
            const determinant = transform.a * transform.d - transform.b * transform.c;
            const expected = -transform.b / determinant;
            expect(transform.inverseB).toBeCloseTo(expected);
        });
    });

    describe("get inverseC()", () => {
        test("returns the inverse c value", () => {
            const determinant = transform.a * transform.d - transform.b * transform.c;
            const expected = -transform.c / determinant;
            expect(transform.inverseC).toBeCloseTo(expected);
        });
    });

    describe("get inverseD()", () => {
        test("returns the inverse d value", () => {
            const determinant = transform.a * transform.d - transform.b * transform.c;
            const expected = transform.a / determinant;
            expect(transform.inverseD).toBeCloseTo(expected);
        });
    });

    describe("get inverseTx()", () => {
        test("returns the inverse tx value", () => {
            const determinant = transform.a * transform.d - transform.b * transform.c;
            const expected = (transform.c * transform.ty - transform.d * transform.tx) / determinant;
            expect(transform.inverseTx).toBeCloseTo(expected);
        });
    });

    describe("get inverseTy()", () => {
        test("returns the inverse ty value", () => {
            const determinant = transform.a * transform.d - transform.b * transform.c;
            const expected = (transform.b * transform.tx - transform.a * transform.ty) / determinant;
            expect(transform.inverseTy).toBeCloseTo(expected);
        });
    });

    // -------------------------------------------------------------------------
    // MARK: - Constructor
    // -------------------------------------------------------------------------

    describe("constructor(onInvalidated)", () => {
        test("sets the onInvalidated callback", () => {
            const transform = new Transform(onInvalidated);
            transform.setX(initialX + 10);
            expect(onInvalidated).toHaveBeenCalled();
        });
    });

    // -------------------------------------------------------------------------
    // MARK: - Set 
    // -------------------------------------------------------------------------

    describe("set(x, y, pivotX, pivotY, scaleX, scaleY, rotation)", () => {
        test("sets all properties at once", () => {
            const newX = initialX + 10;
            const newY = initialY + 20;
            const newPivotX = initialPivotX + 30;
            const newPivotY = initialPivotY + 40;
            const newScaleX = initialScaleX + 50;
            const newScaleY = initialScaleY + 60;
            const newRotation = initialRotation + Math.PI / 4;

            transform.set(
                newX,
                newY,
                newPivotX,
                newPivotY,
                newScaleX,
                newScaleY,
                newRotation
            );

            expect(transform.x).toBe(newX);
            expect(transform.y).toBe(newY);
            expect(transform.pivotX).toBe(newPivotX);
            expect(transform.pivotY).toBe(newPivotY);
            expect(transform.scaleX).toBe(newScaleX);
            expect(transform.scaleY).toBe(newScaleY);
            expect(transform.rotation).toBe(newRotation);
        });

        test("returns this for chaining", () => {
            const result = transform.set(1, 2, 3, 4, 5, 6, Math.PI / 4);
            expect(result).toBe(transform);
        });

        test("calls onInvalidated callback", () => {
            transform.set(
                initialX + 10,
                initialY + 10,
                initialPivotX + 10,
                initialPivotY + 10,
                initialScaleX + 10,
                initialScaleY + 10,
                initialRotation + Math.PI / 4
            );
            expect(onInvalidated).toHaveBeenCalled();
        });

        test("calls onInvalidated when only one value changes", () => {
            for (let i = 0; i < 7; i++) {
                resetTransform();
                transform.set(
                    initialX + (i === 0 ? 10 : 0),
                    initialY + (i === 1 ? 10 : 0),
                    initialPivotX + (i === 2 ? 10 : 0),
                    initialPivotY + (i === 3 ? 10 : 0),
                    initialScaleX + (i === 4 ? 10 : 0),
                    initialScaleY + (i === 5 ? 10 : 0),
                    initialRotation + (i === 6 ? Math.PI / 4 : 0)
                );
                expect(onInvalidated).toHaveBeenCalled();
            }
        });

        test("does not call onInvalidated if values are unchanged", () => {
            transform.set(
                initialX,
                initialY,
                initialPivotX,
                initialPivotY,
                initialScaleX,
                initialScaleY,
                initialRotation
            );
            expect(onInvalidated).not.toHaveBeenCalled();
        });
    });

    // -------------------------------------------------------------------------
    // MARK: - Position
    // -------------------------------------------------------------------------

    describe("getPosition(out)", () => {
        test("returns the position as a vector", () => {
            const out = new Vec2();
            const position = transform.getPosition(out);
            expect(position).toBe(out);
            expect(position.x).toBe(initialX);
            expect(position.y).toBe(initialY);
        });

        test("returns a new vector if out is not provided", () => {
            const position = transform.getPosition();
            expect(position).toBeInstanceOf(Vec2);
            expect(position.x).toBe(initialX);
            expect(position.y).toBe(initialY);
        });

        test("changing returned vector does not affect transform", () => {
            const position = transform.getPosition();
            position.x += 10;
            position.y += 20;
            expect(transform.x).toBe(initialX);
            expect(transform.y).toBe(initialY);
        });
    });

    describe("setX(x)", () => {
        test("sets the x position", () => {
            const newX = initialX + 10;
            transform.setX(newX);
            expect(transform.x).toBe(newX);
            expect(transform.getPosition().x).toBe(newX);
        });

        test("returns this for chaining", () => {
            expect(transform.setX(initialX)).toBe(transform);
            expect(transform.setX(initialX + 10)).toBe(transform);
        });

        test("calls onInvalidated callback", () => {
            transform.setX(initialX + 10);
            expect(onInvalidated).toHaveBeenCalled();
        });

        test("does not call onInvalidated if value is unchanged", () => {
            transform.setX(initialX);
            expect(onInvalidated).not.toHaveBeenCalled();
        });

        test("does not call onInvalidated if already dirty", () => {
            transform.setX(initialX + 10);
            onInvalidated.mockClear();
            transform.setX(initialX + 20);
            expect(onInvalidated).not.toHaveBeenCalled();
        });
    });

    describe("setY(y)", () => {
        test("sets the y position", () => {
            const newY = initialY + 10;
            transform.setY(newY);
            expect(transform.y).toBe(newY);
            expect(transform.getPosition().y).toBe(newY);
        });

        test("returns this for chaining", () => {
            expect(transform.setY(initialY)).toBe(transform);
            expect(transform.setY(initialY + 10)).toBe(transform);
        });

        test("calls onInvalidated callback", () => {
            transform.setY(initialY + 10);
            expect(onInvalidated).toHaveBeenCalled();
        });

        test("does not call onInvalidated if value is unchanged", () => {
            transform.setY(initialY);
            expect(onInvalidated).not.toHaveBeenCalled();
        });

        test("does not call onInvalidated if already dirty", () => {
            transform.setY(initialY + 10);
            onInvalidated.mockClear();
            transform.setY(initialY + 20);
            expect(onInvalidated).not.toHaveBeenCalled();
        });
    });

    describe("setPositionXY(x, y)", () => {
        test("sets the position using x and y values", () => {
            const newX = initialX + 10;
            const newY = initialY + 20;
            transform.setPositionXY(newX, newY);
            expect(transform.x).toBe(newX);
            expect(transform.y).toBe(newY);
        });

        test("returns this for chaining", () => {
            expect(transform.setPositionXY(initialX, initialY)).toBe(transform);
            expect(transform.setPositionXY(initialX + 10, initialY + 20)).toBe(transform);
        });

        test("calls onInvalidated callback", () => {
            transform.setPositionXY(initialX + 10, initialY + 20);
            expect(onInvalidated).toHaveBeenCalled();
        });

        test("does not call onInvalidated if values are unchanged", () => {
            transform.setPositionXY(initialX, initialY);
            expect(onInvalidated).not.toHaveBeenCalled();
        });

        test("does not call onInvalidated if already dirty", () => {
            transform.setPositionXY(initialX + 10, initialY + 20);
            onInvalidated.mockClear();
            transform.setPositionXY(initialX + 30, initialY + 40);
            expect(onInvalidated).not.toHaveBeenCalled();
        });
    });

    describe("setPosition(position)", () => {
        test("sets the position by deferring to setPositionXY", () => {
            const newPosition = new Vec2(initialX + 10, initialY + 20);
            const setPositionXYSpy = jest.spyOn(transform, "setPositionXY");
            transform.setPosition(newPosition);
            expect(transform.x).toBe(newPosition.x);
            expect(transform.y).toBe(newPosition.y);
            expect(setPositionXYSpy).toHaveBeenCalledWith(newPosition.x, newPosition.y);
        });

        test("returns this for chaining", () => {
            const newPosition = new Vec2(initialX + 10, initialY + 20);
            expect(transform.setPosition(newPosition)).toBe(transform);
        });
    });

    describe("translateXY(dx, dy)", () => {
        test("translates the position by dx and dy", () => {
            const dx = 10;
            const dy = 20;
            transform.translateXY(dx, dy);
            expect(transform.x).toBe(initialX + dx);
            expect(transform.y).toBe(initialY + dy);
        });

        test("returns this for chaining", () => {
            expect(transform.translateXY(0, 0)).toBe(transform);
            expect(transform.translateXY(10, 20)).toBe(transform);
        });

        test("calls onInvalidated callback", () => {
            transform.translateXY(10, 20);
            expect(onInvalidated).toHaveBeenCalled();
        });

        test("does not call onInvalidated if values are unchanged", () => {
            transform.translateXY(0, 0);
            expect(onInvalidated).not.toHaveBeenCalled();
        });

        test("does not call onInvalidated if already dirty", () => {
            transform.translateXY(10, 20);
            onInvalidated.mockClear();
            transform.translateXY(30, 40);
            expect(onInvalidated).not.toHaveBeenCalled();
        });
    });

    describe("translate(delta)", () => {
        test("translates the position by deferring to translateXY", () => {
            const delta = new Vec2(10, 20);
            const translateXYSpy = jest.spyOn(transform, "translateXY");
            transform.translate(delta);
            expect(transform.x).toBe(initialX + delta.x);
            expect(transform.y).toBe(initialY + delta.y);
            expect(translateXYSpy).toHaveBeenCalledWith(delta.x, delta.y);
        });

        test("returns this for chaining", () => {
            const delta = new Vec2(10, 20);
            expect(transform.translate(delta)).toBe(transform);
        });
    });

    // -------------------------------------------------------------------------
    // MARK: - Pivot
    // -------------------------------------------------------------------------

    describe("getPivot(out)", () => {
        test("returns the pivot as a vector", () => {
            const out = new Vec2();
            const pivot = transform.getPivot(out);
            expect(pivot).toBe(out);
            expect(pivot.x).toBe(initialPivotX);
            expect(pivot.y).toBe(initialPivotY);
        });

        test("returns a new vector if out is not provided", () => {
            const pivot = transform.getPivot();
            expect(pivot).toBeInstanceOf(Vec2);
            expect(pivot.x).toBe(initialPivotX);
            expect(pivot.y).toBe(initialPivotY);
        });

        test("changing returned vector does not affect transform", () => {
            const pivot = transform.getPivot();
            pivot.x += 10;
            pivot.y += 20;
            expect(transform.pivotX).toBe(initialPivotX);
            expect(transform.pivotY).toBe(initialPivotY);
        });
    });

    describe("setPivotX(pivotX)", () => {
        test("sets the pivot x", () => {
            const newPivotX = initialPivotX + 10;
            transform.setPivotX(newPivotX);
            expect(transform.pivotX).toBe(newPivotX);
            expect(transform.getPivot().x).toBe(newPivotX);
        });

        test("returns this for chaining", () => {
            expect(transform.setPivotX(initialPivotX)).toBe(transform);
            expect(transform.setPivotX(initialPivotX + 10)).toBe(transform);
        });

        test("calls onInvalidated callback", () => {
            transform.setPivotX(initialPivotX + 10);
            expect(onInvalidated).toHaveBeenCalled();
        });

        test("does not call onInvalidated if value is unchanged", () => {
            transform.setPivotX(initialPivotX);
            expect(onInvalidated).not.toHaveBeenCalled();
        });

        test("does not call onInvalidated if already dirty", () => {
            transform.setPivotX(initialPivotX + 10);
            onInvalidated.mockClear();
            transform.setPivotX(initialPivotX + 20);
            expect(onInvalidated).not.toHaveBeenCalled();
        });
    });

    describe("setPivotY(pivotY)", () => {
        test("sets the pivot y", () => {
            const newPivotY = initialPivotY + 10;
            transform.setPivotY(newPivotY);
            expect(transform.pivotY).toBe(newPivotY);
            expect(transform.getPivot().y).toBe(newPivotY);
        });

        test("returns this for chaining", () => {
            expect(transform.setPivotY(initialPivotY)).toBe(transform);
            expect(transform.setPivotY(initialPivotY + 10)).toBe(transform);
        });

        test("calls onInvalidated callback", () => {
            transform.setPivotY(initialPivotY + 10);
            expect(onInvalidated).toHaveBeenCalled();
        });

        test("does not call onInvalidated if value is unchanged", () => {
            transform.setPivotY(initialPivotY);
            expect(onInvalidated).not.toHaveBeenCalled();
        });

        test("does not call onInvalidated if already dirty", () => {
            transform.setPivotY(initialPivotY + 10);
            onInvalidated.mockClear();
            transform.setPivotY(initialPivotY + 20);
            expect(onInvalidated).not.toHaveBeenCalled();
        });
    });

    describe("setPivotXY(pivotX, pivotY)", () => {
        test("sets the pivot x and y", () => {
            const newPivotX = initialPivotX + 10;
            const newPivotY = initialPivotY + 10;
            transform.setPivotXY(newPivotX, newPivotY);
            expect(transform.pivotX).toBe(newPivotX);
            expect(transform.pivotY).toBe(newPivotY);
            expect(transform.getPivot().x).toBe(newPivotX);
            expect(transform.getPivot().y).toBe(newPivotY);
        });

        test("returns this for chaining", () => {
            expect(transform.setPivotXY(initialPivotX, initialPivotY)).toBe(transform);
            expect(transform.setPivotXY(initialPivotX + 10, initialPivotY + 10)).toBe(transform);
        });

        test("calls onInvalidated callback", () => {
            transform.setPivotXY(initialPivotX + 10, initialPivotY + 10);
            expect(onInvalidated).toHaveBeenCalled();

            transform.getMatrix();
            onInvalidated.mockClear();
            transform.setPivotXY(transform.pivotX + 10, transform.pivotY);
            expect(onInvalidated).toHaveBeenCalled();

            transform.getMatrix();
            onInvalidated.mockClear();
            transform.setPivotXY(transform.pivotX, transform.pivotY + 10);
            expect(onInvalidated).toHaveBeenCalled();
        });

        test("does not call onInvalidated if values are unchanged", () => {
            transform.setPivotXY(initialPivotX, initialPivotY);
            expect(onInvalidated).not.toHaveBeenCalled();
        });

        test("does not call onInvalidated if already dirty", () => {
            transform.setPivotXY(initialPivotX + 10, initialPivotY + 10);
            onInvalidated.mockClear();
            transform.setPivotXY(initialPivotX + 20, initialPivotY + 20);
            expect(onInvalidated).not.toHaveBeenCalled();
        });
    });

    describe("setPivot(pivot)", () => {
        test("sets the pivot by deferring to setPivotXY", () => {
            const newPivot = new Vec2(initialPivotX + 10, initialPivotY + 20);
            const setPivotXYSpy = jest.spyOn(transform, "setPivotXY");
            transform.setPivot(newPivot);
            expect(transform.pivotX).toBe(newPivot.x);
            expect(transform.pivotY).toBe(newPivot.y);
            expect(setPivotXYSpy).toHaveBeenCalledWith(newPivot.x, newPivot.y);
        });

        test("returns this for chaining", () => {
            const newPivot = new Vec2(initialPivotX + 10, initialPivotY + 20);
            expect(transform.setPivot(newPivot)).toBe(transform);
        });
    });

    describe("translatePivotXY(dx, dy)", () => {
        test("translates the position by dx and dy", () => {
            const dx = 10;
            const dy = 20;
            transform.translatePivotXY(dx, dy);
            expect(transform.pivotX).toBe(initialPivotX + dx);
            expect(transform.pivotY).toBe(initialPivotY + dy);
        });

        test("returns this for chaining", () => {
            expect(transform.translatePivotXY(0, 0)).toBe(transform);
            expect(transform.translatePivotXY(10, 20)).toBe(transform);
        });

        test("calls onInvalidated callback", () => {
            transform.translatePivotXY(10, 20);
            expect(onInvalidated).toHaveBeenCalled();
        });

        test("does not call onInvalidated if values are unchanged", () => {
            transform.translatePivotXY(0, 0);
            expect(onInvalidated).not.toHaveBeenCalled();
        });

        test("does not call onInvalidated if already dirty", () => {
            transform.translatePivotXY(10, 20);
            onInvalidated.mockClear();
            transform.translatePivotXY(30, 40);
            expect(onInvalidated).not.toHaveBeenCalled();
        });
    });

    describe("translatePivot(delta)", () => {
        test("translates the pivot by deferring to translatePivotXY", () => {
            const delta = new Vec2(10, 20);
            const translatePivotXYSpy = jest.spyOn(transform, "translatePivotXY");
            transform.translatePivot(delta);
            expect(transform.pivotX).toBe(initialPivotX + delta.x);
            expect(transform.pivotY).toBe(initialPivotY + delta.y);
            expect(translatePivotXYSpy).toHaveBeenCalledWith(delta.x, delta.y);
        });

        test("returns this for chaining", () => {
            const delta = new Vec2(10, 20);
            expect(transform.translatePivot(delta)).toBe(transform);
        });
    });

    // -------------------------------------------------------------------------
    // MARK: - Scale
    // -------------------------------------------------------------------------

    describe("getScale(out)", () => {
        test("returns the scale as a vector", () => {
            const out = new Vec2();
            const scale = transform.getScale(out);
            expect(scale).toBe(out);
            expect(scale.x).toBe(initialScaleX);
            expect(scale.y).toBe(initialScaleY);
        });

        test("returns a new vector if out is not provided", () => {
            const scale = transform.getScale();
            expect(scale).toBeInstanceOf(Vec2);
            expect(scale.x).toBe(initialScaleX);
            expect(scale.y).toBe(initialScaleY);
        });

        test("changing returned vector does not affect transform", () => {
            const scale = transform.getScale();
            scale.x += 10;
            scale.y += 20;
            expect(transform.scaleX).toBe(initialScaleX);
            expect(transform.scaleY).toBe(initialScaleY);
        });
    });

    describe("setScaleX(scaleX)", () => {
        test("sets the scale x", () => {
            const newScaleX = initialScaleX + 10;
            transform.setScaleX(newScaleX);
            expect(transform.scaleX).toBe(newScaleX);
            expect(transform.getScale().x).toBe(newScaleX);
        });

        test("returns this for chaining", () => {
            expect(transform.setScaleX(initialScaleX)).toBe(transform);
            expect(transform.setScaleX(initialScaleX + 10)).toBe(transform);
        });

        test("calls onInvalidated callback", () => {
            transform.setScaleX(initialScaleX + 10);
            expect(onInvalidated).toHaveBeenCalled();
        });

        test("does not call onInvalidated if value is unchanged", () => {
            transform.setScaleX(initialScaleX);
            expect(onInvalidated).not.toHaveBeenCalled();
        });

        test("does not call onInvalidated if already dirty", () => {
            transform.setScaleX(initialScaleX + 10);
            onInvalidated.mockClear();
            transform.setScaleX(initialScaleX + 20);
            expect(onInvalidated).not.toHaveBeenCalled();
        });
    });

    describe("setScaleY(scaleY)", () => {
        test("sets the scale y", () => {
            const newScaleY = initialScaleY + 10;
            transform.setScaleY(newScaleY);
            expect(transform.scaleY).toBe(newScaleY);
            expect(transform.getScale().y).toBe(newScaleY);
        });

        test("returns this for chaining", () => {
            expect(transform.setScaleY(initialScaleY)).toBe(transform);
            expect(transform.setScaleY(initialScaleY + 10)).toBe(transform);
        });

        test("calls onInvalidated callback", () => {
            transform.setScaleY(initialScaleY + 10);
            expect(onInvalidated).toHaveBeenCalled();
        });

        test("does not call onInvalidated if value is unchanged", () => {
            transform.setScaleY(initialScaleY);
            expect(onInvalidated).not.toHaveBeenCalled();
        });

        test("does not call onInvalidated if already dirty", () => {
            transform.setScaleY(initialScaleY + 10);
            onInvalidated.mockClear();
            transform.setScaleY(initialScaleY + 20);
            expect(onInvalidated).not.toHaveBeenCalled();
        });
    });

    describe("setScaleXY(scaleX, scaleY)", () => {
        test("sets the scale x and y", () => {
            const newScaleX = initialScaleX + 10;
            const newScaleY = initialScaleY + 10;
            transform.setScaleXY(newScaleX, newScaleY);
            expect(transform.scaleX).toBe(newScaleX);
            expect(transform.scaleY).toBe(newScaleY);
            expect(transform.getScale().x).toBe(newScaleX);
            expect(transform.getScale().y).toBe(newScaleY);
        });

        test("returns this for chaining", () => {
            expect(transform.setScaleXY(initialScaleX, initialScaleY)).toBe(transform);
            expect(transform.setScaleXY(initialScaleX + 10, initialScaleY + 10)).toBe(transform);
        });

        test("calls onInvalidated callback", () => {
            transform.setScaleXY(initialScaleX + 10, initialScaleY + 10);
            expect(onInvalidated).toHaveBeenCalled();

            transform.getMatrix();
            onInvalidated.mockClear();
            transform.setScaleXY(transform.scaleX + 10, transform.scaleY);
            expect(onInvalidated).toHaveBeenCalled();

            transform.getMatrix();
            onInvalidated.mockClear();
            transform.setScaleXY(transform.scaleX, transform.scaleY + 10);
            expect(onInvalidated).toHaveBeenCalled();
        });

        test("does not call onInvalidated if values are unchanged", () => {
            transform.setScaleXY(initialScaleX, initialScaleY);
            expect(onInvalidated).not.toHaveBeenCalled();
        });

        test("does not call onInvalidated if already dirty", () => {
            transform.setScaleXY(initialScaleX + 10, initialScaleY + 10);
            onInvalidated.mockClear();
            transform.setScaleXY(initialScaleX + 20, initialScaleY + 20);
            expect(onInvalidated).not.toHaveBeenCalled();
        });
    });

    describe("setScale(scaleOrVector)", () => {
        test("sets the scale vector by deferring to setScaleXY", () => {
            const newScale = new Vec2(initialScaleX + 10, initialScaleY + 20);
            const setScaleXYSpy = jest.spyOn(transform, "setScaleXY");
            transform.setScale(newScale);
            expect(transform.scaleX).toBe(newScale.x);
            expect(transform.scaleY).toBe(newScale.y);
            expect(setScaleXYSpy).toHaveBeenCalledWith(newScale.x, newScale.y);
        });

        test("sets the scale value by deferring to setScaleXY", () => {
            const newScale = initialScaleX + 100;
            const setScaleXYSpy = jest.spyOn(transform, "setScaleXY");
            transform.setScale(newScale);
            expect(transform.scaleX).toBe(newScale);
            expect(transform.scaleY).toBe(newScale);
            expect(setScaleXYSpy).toHaveBeenCalledWith(newScale, newScale);
        });

        test("returns this for chaining", () => {
            const newScale = new Vec2(initialScaleX + 10, initialScaleY + 20);
            expect(transform.setScale(newScale)).toBe(transform);
        });
    });

    describe("scaleXY(factorX, factorY)", () => {
        test("scales the scale by factorX and factorY", () => {
            const factorX = 2;
            const factorY = 3;
            transform.scaleXY(factorX, factorY);
            expect(transform.scaleX).toBe(initialScaleX * factorX);
            expect(transform.scaleY).toBe(initialScaleY * factorY);
        });

        test("returns this for chaining", () => {
            expect(transform.scaleXY(1, 1)).toBe(transform);
            expect(transform.scaleXY(2, 3)).toBe(transform);
        });

        test("calls onInvalidated callback", () => {
            transform.scaleXY(2, 3);
            expect(onInvalidated).toHaveBeenCalled();
        });

        test("does not call onInvalidated if values are unchanged", () => {
            transform.scaleXY(1, 1);
            expect(onInvalidated).not.toHaveBeenCalled();
        });

        test("does not call onInvalidated if already dirty", () => {
            transform.scaleXY(2, 3);
            onInvalidated.mockClear();
            transform.scaleXY(4, 5);
            expect(onInvalidated).not.toHaveBeenCalled();
        });
    });

    describe("scale(factorOrVector)", () => {
    });

    // -------------------------------------------------------------------------
    // MARK: - Rotation
    // -------------------------------------------------------------------------

    describe("setRotation(radians)", () => {
    });

    describe("rotate(deltaRadians)", () => {
    });

    // -------------------------------------------------------------------------
    // MARK: - Transformations
    // -------------------------------------------------------------------------

    describe("transformPointXY(x, y, out)", () => {
    });

    describe("transformPoint(point, out)", () => {
    });

    describe("transformVectorXY(x, y, out)", () => {
    });

    describe("transformVector(vector, out)", () => {
    });

    describe("transformBounds(bounds, out)", () => {
    });

    describe("transformMatrix(inputMatrix, out)", () => {
    });

    // -------------------------------------------------------------------------
    // MARK: - Inverse Transformations
    // -------------------------------------------------------------------------

    describe("inverseTransformPointXY(x, y, out)", () => {
    });

    describe("inverseTransformPoint(point, out)", () => {
    });

    describe("inverseTransformVectorXY(x, y, out)", () => {
    });

    describe("inverseTransformVector(vector, out)", () => {
    });

    describe("inverseTransformBounds(bounds, out)", () => {
    });

    describe("inverseTransformMatrix(inputMatrix, out)", () => {
    });

    // -------------------------------------------------------------------------
    // MARK: - Utilities
    // -------------------------------------------------------------------------

    describe("getMatrix(out)", () => {
    });

    describe("unsafeGetMatrix()", () => {
    });

    describe("getInverseMatrix(out)", () => {
    });

    describe("unsafeGetInverseMatrix()", () => {
    });

    describe("copy(other)", () => {
    });

    describe("clone()", () => {
    });

});
