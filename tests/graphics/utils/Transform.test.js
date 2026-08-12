import { Transform } from "@canvas-engine";
import { beforeEach, describe, expect, jest, test } from "@jest/globals";

describe("Transform", () => {
    // -------------------------------------------------------------------------
    // MARK: - Setup
    // -------------------------------------------------------------------------

    let transform;

    beforeEach(() => {
        transform = new Transform();
    });

    // -------------------------------------------------------------------------
    // MARK: - Position Accessors
    // -------------------------------------------------------------------------

    describe("get x()", () => {
        test("returns the x position", () => {
            transform.setPositionXY(10, 20);
            expect(transform.x).toBe(10);
        });
    });

    describe("set x(value)", () => {
        test("sets the x position by deferring to setX", () => {
            const setXSpy = jest.spyOn(transform, "setX");
            transform.x = 10;
            expect(transform.x).toBe(10);
            expect(transform.getPosition().x).toBe(10);
            expect(setXSpy).toHaveBeenCalledWith(10);
        });
    });

    describe("get y()", () => {
        test("returns the y position", () => {
            transform.setPositionXY(10, 20);
            expect(transform.y).toBe(20);
        });
    });

    describe("set y(value)", () => {
        test("sets the y position by deferring to setY", () => {
            const setYSpy = jest.spyOn(transform, "setY");
            transform.y = 20;
            expect(transform.y).toBe(20);
            expect(transform.getPosition().y).toBe(20);
            expect(setYSpy).toHaveBeenCalledWith(20);
        });
    });

    // -------------------------------------------------------------------------
    // MARK: - Pivot Accessors
    // -------------------------------------------------------------------------

    describe("get pivotX()", () => {
        test("returns the pivotX value", () => {
            transform.setPivotXY(5, 10);
            expect(transform.pivotX).toBe(5);
        });
    });

    describe("set pivotX(value)", () => {
        test("sets the pivotX value by deferring to setPivotX", () => {
            const setPivotXSpy = jest.spyOn(transform, "setPivotX");
            transform.pivotX = 5;
            expect(transform.pivotX).toBe(5);
            expect(transform.getPivot().x).toBe(5);
            expect(setPivotXSpy).toHaveBeenCalledWith(5);
        });
    });

    describe("get pivotY()", () => {
        test("returns the pivotY value", () => {
            transform.setPivotXY(5, 10);
            expect(transform.pivotY).toBe(10);
        });
    });

    describe("set pivotY(value)", () => {
        test("sets the pivotY value by deferring to setPivotY", () => {
            const setPivotYSpy = jest.spyOn(transform, "setPivotY");
            transform.pivotY = 10;
            expect(transform.pivotY).toBe(10);
            expect(transform.getPivot().y).toBe(10);
            expect(setPivotYSpy).toHaveBeenCalledWith(10);
        });
    });

    // -------------------------------------------------------------------------
    // MARK: - Scale Accessors
    // -------------------------------------------------------------------------

    describe("get scaleX()", () => {
        test("returns the scaleX value", () => {
            transform.setScaleXY(2, 3);
            expect(transform.scaleX).toBe(2);
        });
    });

    describe("set scaleX(value)", () => {
        test("sets the scaleX value by deferring to setScaleX", () => {
            const setScaleXSpy = jest.spyOn(transform, "setScaleX");
            transform.scaleX = 2;
            expect(transform.scaleX).toBe(2);
            expect(transform.getScale().x).toBe(2);
            expect(setScaleXSpy).toHaveBeenCalledWith(2);
        });
    });

    describe("get scaleY()", () => {
        test("returns the scaleY value", () => {
            transform.setScaleXY(2, 3);
            expect(transform.scaleY).toBe(3);
        });
    });

    describe("set scaleY(value)", () => {
        test("sets the scaleY value by deferring to setScaleY", () => {
            const setScaleYSpy = jest.spyOn(transform, "setScaleY");
            transform.scaleY = 3;
            expect(transform.scaleY).toBe(3);
            expect(transform.getScale().y).toBe(3);
            expect(setScaleYSpy).toHaveBeenCalledWith(3);
        });
    });

    // -------------------------------------------------------------------------
    // MARK: - Rotation Accessors
    // -------------------------------------------------------------------------

    describe("get rotation()", () => {
        test("returns the rotation value", () => {
            const rotation = Math.PI / 4;
            transform.setRotation(rotation);
            expect(transform.rotation).toBeCloseTo(rotation);
        });
    });

    describe("set rotation(value)", () => {
        test("sets the rotation value by deferring to setRotation", () => {
            const setRotationSpy = jest.spyOn(transform, "setRotation");
            const rotation = Math.PI / 4;
            transform.rotation = rotation;
            expect(transform.rotation).toBeCloseTo(rotation);
            expect(setRotationSpy).toHaveBeenCalledWith(rotation);
        });
    });

    // -------------------------------------------------------------------------
    // MARK: - Matrix Accessors
    // -------------------------------------------------------------------------

    describe("get a()", () => {
    });

    describe("get b()", () => {
    });

    describe("get c()", () => {
    });

    describe("get d()", () => {
    });

    describe("get tx()", () => {
    });

    describe("get ty()", () => {
    });

    // -------------------------------------------------------------------------
    // MARK: - Inverse Matrix Accessors
    // -------------------------------------------------------------------------

    describe("get inverseA()", () => {
    });

    describe("get inverseB()", () => {
    });

    describe("get inverseC()", () => {
    });

    describe("get inverseD()", () => {
    });

    describe("get inverseTx()", () => {
    });

    describe("get inverseTy()", () => {
    });

    // -------------------------------------------------------------------------
    // MARK: - Constructor
    // -------------------------------------------------------------------------

    describe("constructor(onInvalidated)", () => {
    });

    describe("set(x, y, pivotX, pivotY, scaleX, scaleY, rotation)", () => {
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
