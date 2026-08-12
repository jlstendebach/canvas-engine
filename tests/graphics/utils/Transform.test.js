import { Transform } from "@canvas-engine";
import { describe, expect, test } from "@jest/globals";

describe("Transform", () => {

    // -------------------------------------------------------------------------
    // MARK: - Position Accessors
    // -------------------------------------------------------------------------

    describe("get x()", () => {
    });

    describe("set x(value)", () => {
    });

    describe("get y()", () => {
    });

    describe("set y(value)", () => {
    });

    // -------------------------------------------------------------------------
    // MARK: - Pivot Accessors
    // -------------------------------------------------------------------------

    describe("get pivotX()", () => {
    });

    describe("set pivotX(value)", () => {
    });

    describe("get pivotY()", () => {
    });

    describe("set pivotY(value)", () => {
    });

    // -------------------------------------------------------------------------
    // MARK: - Scale Accessors
    // -------------------------------------------------------------------------

    describe("get scaleX()", () => {
    });

    describe("set scaleX(value)", () => {
    });

    describe("get scaleY()", () => {
    });

    describe("set scaleY(value)", () => {
    });

    // -------------------------------------------------------------------------
    // MARK: - Rotation Accessors
    // -------------------------------------------------------------------------

    describe("get rotation()", () => {
    });

    describe("set rotation(value)", () => {
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
