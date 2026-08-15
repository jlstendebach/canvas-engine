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

    beforeEach(() => {
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
                transform.set(
                    initialX        + (i === 0 ? 10 : 0),
                    initialY        + (i === 1 ? 10 : 0),
                    initialPivotX   + (i === 2 ? 10 : 0),
                    initialPivotY   + (i === 3 ? 10 : 0),
                    initialScaleX   + (i === 4 ? 10 : 0),
                    initialScaleY   + (i === 5 ? 10 : 0),
                    initialRotation + (i === 6 ? Math.PI / 4 : 0)
                );
                expect(onInvalidated).toHaveBeenCalled();

                transform.getMatrix();
                onInvalidated.mockClear();
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
    });

    describe("translateXY(dx, dy)", () => {
    });

    describe("translate(delta)", () => {
    });

    // -------------------------------------------------------------------------
    // MARK: - Pivot
    // -------------------------------------------------------------------------

    describe("getPivot(out)", () => {
    });

    describe("setPivotX(pivotX)", () => {
    });

    describe("setPivotY(pivotY)", () => {
    });

    describe("setPivotXY(pivotX, pivotY)", () => {
    });

    describe("setPivot(pivot)", () => {
    });

    describe("offsetPivotXY(dx, dy)", () => {
    });

    describe("offsetPivot(offset)", () => {
    });

    // -------------------------------------------------------------------------
    // MARK: - Scale
    // -------------------------------------------------------------------------

    describe("getScale(out)", () => {
    });

    describe("setScaleX(scaleX)", () => {
    });

    describe("setScaleY(scaleY)", () => {
    });

    describe("setScale(scaleOrVector)", () => {
    });

    describe("setScaleXY(scaleX, scaleY)", () => {
    });

    describe("scaleXY(factorX, factorY)", () => {
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
