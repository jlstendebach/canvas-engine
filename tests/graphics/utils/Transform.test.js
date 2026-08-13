import { Transform } from "@canvas-engine";
import { beforeEach, describe, expect, jest, test } from "@jest/globals";

describe("Transform", () => {
    // -------------------------------------------------------------------------
    // MARK: - Setup
    // -------------------------------------------------------------------------

    let transform;
    const onInvalidated = jest.fn();
    const initialX = 1;
    const initialY = 2;
    const initialPivotX = 3;
    const initialPivotY = 4;
    const initialScaleX = 5;
    const initialScaleY = 6;
    const initialRotation = Math.PI / 4;

    beforeEach(() => {
        onInvalidated.mockClear();
        transform = new Transform(onInvalidated).set(
            initialX,
            initialY,
            initialPivotX,
            initialPivotY,
            initialScaleX,
            initialScaleY,
            initialRotation
        );
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

        test("calls onInvalidated when only translation changes", () => {
            transform.set(
                initialX + 10,
                initialY + 10,
                initialPivotX,
                initialPivotY,
                initialScaleX,
                initialScaleY,
                initialRotation
            );
            expect(onInvalidated).toHaveBeenCalled();
        });

        test("calls onInvalidated when only pivot changes", () => {
            transform.set(
                initialX,
                initialY,
                initialPivotX + 10,
                initialPivotY + 10,
                initialScaleX,
                initialScaleY,
                initialRotation
            );
            expect(onInvalidated).toHaveBeenCalled();
        });

        test("calls onInvalidated when only scale changes", () => {
            transform.set(
                initialX,
                initialY,
                initialPivotX,
                initialPivotY,
                initialScaleX + 10,
                initialScaleY + 10,
                initialRotation
            );
            expect(onInvalidated).toHaveBeenCalled();
        });

        test("calls onInvalidated when only rotation changes", () => {
            transform.set(
                initialX,
                initialY,
                initialPivotX,
                initialPivotY,
                initialScaleX,
                initialScaleY,
                initialRotation + Math.PI / 4,
            );
            expect(onInvalidated).toHaveBeenCalled();
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
    });

    describe("setX(x)", () => {
    });

    describe("setY(y)", () => {
    });

    describe("setPositionXY(x, y)", () => {
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
