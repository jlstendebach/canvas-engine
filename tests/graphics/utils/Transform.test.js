import { Bounds, Matrix2, Transform, Vec2 } from "@canvas-engine";
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

    const expectVectorsToMatch = (expected, actual) => {
        expect(actual.x).toBeCloseTo(expected.x);
        expect(actual.y).toBeCloseTo(expected.y);
    };

    const expectBoundsToMatch = (expected, actual) => {
        expect(actual.minX).toBeCloseTo(expected.minX);
        expect(actual.minY).toBeCloseTo(expected.minY);
        expect(actual.maxX).toBeCloseTo(expected.maxX);
        expect(actual.maxY).toBeCloseTo(expected.maxY);
    };

    const expectMatricesToMatch = (expected, actual) => {
        expect(actual.a).toBeCloseTo(expected.a);
        expect(actual.b).toBeCloseTo(expected.b);
        expect(actual.c).toBeCloseTo(expected.c);
        expect(actual.d).toBeCloseTo(expected.d);
        expect(actual.tx).toBeCloseTo(expected.tx);
        expect(actual.ty).toBeCloseTo(expected.ty);
    };

    // Generates the standard 5-test suite for a setter that assigns a single
    // number-valued property, verified against transform[propertyName] and the
    // corresponding vector getter's component.
    const testSingleAxisSetter = ({
        setterName,
        propertyName,
        getVectorName,
        vectorComponent,
        initialValue
    }) => {
        test(`sets the ${propertyName}`, () => {
            const newValue = initialValue + 10;
            transform[setterName](newValue);
            expect(transform[propertyName]).toBe(newValue);
            expect(transform[getVectorName]()[vectorComponent]).toBe(newValue);
        });

        test("returns this for chaining", () => {
            expect(transform[setterName](initialValue)).toBe(transform);
            expect(transform[setterName](initialValue + 10)).toBe(transform);
        });

        test("calls onInvalidated callback", () => {
            transform[setterName](initialValue + 10);
            expect(onInvalidated).toHaveBeenCalled();
        });

        test("does not call onInvalidated if value is unchanged", () => {
            transform[setterName](initialValue);
            expect(onInvalidated).not.toHaveBeenCalled();
        });

        test("does not call onInvalidated if already dirty", () => {
            transform[setterName](initialValue + 10);
            onInvalidated.mockClear();
            transform[setterName](initialValue + 20);
            expect(onInvalidated).not.toHaveBeenCalled();
        });
    };

    // Generates the standard 5-test suite for a setter that assigns a pair of
    // number-valued properties (x/y axes), verified against transform's own
    // x/y properties and the corresponding vector getter.
    const testTwoAxisSetter = ({
        setterName,
        propertyNameX,
        propertyNameY,
        getVectorName,
        initialValueX,
        initialValueY
    }) => {
        test(`sets the ${propertyNameX} and ${propertyNameY}`, () => {
            const newX = initialValueX + 10;
            const newY = initialValueY + 10;
            transform[setterName](newX, newY);
            expect(transform[propertyNameX]).toBe(newX);
            expect(transform[propertyNameY]).toBe(newY);
            expect(transform[getVectorName]().x).toBe(newX);
            expect(transform[getVectorName]().y).toBe(newY);
        });

        test("returns this for chaining", () => {
            expect(transform[setterName](initialValueX, initialValueY)).toBe(transform);
            expect(transform[setterName](initialValueX + 10, initialValueY + 10)).toBe(transform);
        });

        test("calls onInvalidated callback", () => {
            transform[setterName](initialValueX + 10, initialValueY + 10);
            expect(onInvalidated).toHaveBeenCalled();

            transform.getMatrix();
            onInvalidated.mockClear();
            transform[setterName](transform[propertyNameX] + 10, transform[propertyNameY]);
            expect(onInvalidated).toHaveBeenCalled();

            transform.getMatrix();
            onInvalidated.mockClear();
            transform[setterName](transform[propertyNameX], transform[propertyNameY] + 10);
            expect(onInvalidated).toHaveBeenCalled();
        });

        test("does not call onInvalidated if values are unchanged", () => {
            transform[setterName](initialValueX, initialValueY);
            expect(onInvalidated).not.toHaveBeenCalled();
        });

        test("does not call onInvalidated if already dirty", () => {
            transform[setterName](initialValueX + 10, initialValueY + 10);
            onInvalidated.mockClear();
            transform[setterName](initialValueX + 20, initialValueY + 20);
            expect(onInvalidated).not.toHaveBeenCalled();
        });
    };

    // -------------------------------------------------------------------------
    // MARK: - beforeEach
    // -------------------------------------------------------------------------

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
        testSingleAxisSetter({
            setterName: "setX",
            propertyName: "x",
            getVectorName: "getPosition",
            vectorComponent: "x",
            initialValue: initialX,
        });
    });

    describe("setY(y)", () => {
        testSingleAxisSetter({
            setterName: "setY",
            propertyName: "y",
            getVectorName: "getPosition",
            vectorComponent: "y",
            initialValue: initialY,
        });
    });

    describe("setPositionXY(x, y)", () => {
        testTwoAxisSetter({
            setterName: "setPositionXY",
            propertyNameX: "x",
            propertyNameY: "y",
            getVectorName: "getPosition",
            initialValueX: initialX,
            initialValueY: initialY,
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
        testSingleAxisSetter({
            setterName: "setPivotX",
            propertyName: "pivotX",
            getVectorName: "getPivot",
            vectorComponent: "x",
            initialValue: initialPivotX,
        });
    });

    describe("setPivotY(pivotY)", () => {
        testSingleAxisSetter({
            setterName: "setPivotY",
            propertyName: "pivotY",
            getVectorName: "getPivot",
            vectorComponent: "y",
            initialValue: initialPivotY,
        });
    });

    describe("setPivotXY(pivotX, pivotY)", () => {
        testTwoAxisSetter({
            setterName: "setPivotXY",
            propertyNameX: "pivotX",
            propertyNameY: "pivotY",
            getVectorName: "getPivot",
            initialValueX: initialPivotX,
            initialValueY: initialPivotY,
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
        testSingleAxisSetter({
            setterName: "setScaleX",
            propertyName: "scaleX",
            getVectorName: "getScale",
            vectorComponent: "x",
            initialValue: initialScaleX,
        });
    });

    describe("setScaleY(scaleY)", () => {
        testSingleAxisSetter({
            setterName: "setScaleY",
            propertyName: "scaleY",
            getVectorName: "getScale",
            vectorComponent: "y",
            initialValue: initialScaleY,
        });
    });

    describe("setScaleXY(scaleX, scaleY)", () => {
        testTwoAxisSetter({
            setterName: "setScaleXY",
            propertyNameX: "scaleX",
            propertyNameY: "scaleY",
            getVectorName: "getScale",
            initialValueX: initialScaleX,
            initialValueY: initialScaleY,
        });
    });

    describe("setScale(scaleOrVector)", () => {
        test("sets the scale by deferring to setScaleXY with a vector", () => {
            const newScale = new Vec2(initialScaleX + 10, initialScaleY + 20);
            const setScaleXYSpy = jest.spyOn(transform, "setScaleXY");
            transform.setScale(newScale);
            expect(transform.scaleX).toBe(newScale.x);
            expect(transform.scaleY).toBe(newScale.y);
            expect(setScaleXYSpy).toHaveBeenCalledWith(newScale.x, newScale.y);
        });

        test("sets the scale by deferring to setScaleXY with a number", () => {
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
        test("scales by deferring to scaleXY with a vector", () => {
            const vector = new Vec2(2, 3);
            const scaleXYSpy = jest.spyOn(transform, "scaleXY");
            transform.scale(vector);
            expect(transform.scaleX).toBe(initialScaleX * vector.x);
            expect(transform.scaleY).toBe(initialScaleY * vector.y);
            expect(scaleXYSpy).toHaveBeenCalledWith(vector.x, vector.y);
        });

        test("scales by deferring to scaleXY with a number", () => {
            const factor = 2;
            const scaleXYSpy = jest.spyOn(transform, "scaleXY");
            transform.scale(factor);
            expect(transform.scaleX).toBe(initialScaleX * factor);
            expect(transform.scaleY).toBe(initialScaleY * factor);
            expect(scaleXYSpy).toHaveBeenCalledWith(factor, factor);
        });

        test("returns this for chaining", () => {
            const vector = new Vec2(2, 3);
            expect(transform.scale(vector)).toBe(transform);
        });
    });

    // -------------------------------------------------------------------------
    // MARK: - Rotation
    // -------------------------------------------------------------------------

    describe("setRotation(radians)", () => {
        test("sets the rotation", () => {
            const newRotation = initialRotation + Math.PI / 4;
            transform.setRotation(newRotation);
            expect(transform.rotation).toBe(newRotation);
        });

        test("normalizes the rotation to be within [0, 2*PI]", () => {
            const testCases = [
                { input: 2 * Math.PI, expected: 0 },
                { input: -2 * Math.PI, expected: 0 },
                { input: 3 * Math.PI, expected: Math.PI },
                { input: -3 * Math.PI, expected: Math.PI },
                { input: 5 * Math.PI / 2, expected: Math.PI / 2 },
                { input: -5 * Math.PI / 2, expected: 3 * Math.PI / 2 },
            ];

            for (const { input, expected } of testCases) {
                transform.setRotation(input);
                expect(transform.rotation).toBeCloseTo(expected);
            }
        });

        test("returns this for chaining", () => {
            expect(transform.setRotation(initialRotation)).toBe(transform);
            expect(transform.setRotation(initialRotation + Math.PI / 4)).toBe(transform);
        });

        test("calls onInvalidated callback", () => {
            transform.setRotation(initialRotation + Math.PI / 4);
            expect(onInvalidated).toHaveBeenCalled();
        });

        test("does not call onInvalidated if value is unchanged", () => {
            transform.setRotation(initialRotation);
            expect(onInvalidated).not.toHaveBeenCalled();
        });

        test("does not call onInvalidated if already dirty", () => {
            transform.setRotation(initialRotation + Math.PI / 4);
            onInvalidated.mockClear();
            transform.setRotation(transform.rotation + Math.PI / 2);
            expect(onInvalidated).not.toHaveBeenCalled();
        });
    });

    describe("rotate(deltaRadians)", () => {
        test("rotates by deferring to setRotation with the new rotation", () => {
            const delta = Math.PI / 4;
            const setRotationSpy = jest.spyOn(transform, "setRotation");
            transform.rotate(delta);
            expect(transform.rotation).toBeCloseTo(initialRotation + delta);
            expect(setRotationSpy).toHaveBeenCalledWith(initialRotation + delta);
        });

        test("returns this for chaining", () => {
            const delta = Math.PI / 4;
            expect(transform.rotate(delta)).toBe(transform);
        });
    });

    // -------------------------------------------------------------------------
    // MARK: - Transformations
    // -------------------------------------------------------------------------

    const testTransformations = ({
        applyMatrixMethod,
        applyTransformMethod,
        expectMatch,
        createOutObject
    }) => {
        test.each([
            {
                name: "identity",
                values: [0, 0, 0, 0, 1, 1, 0],
            },
            {
                name: "translation",
                values: [12, -8, 0, 0, 1, 1, 0],
            },
            {
                name: "pivoted rotation and scale",
                values: [12, -8, 3, -2, 2, 0.5, Math.PI / 3],
            },
        ])("matches Matrix2 for $name", (testCase) => {
            const [x, y, pivotX, pivotY, scaleX, scaleY, rotation] = testCase.values;
            const expectedMatrix = new Matrix2().setTransform(
                x, y, pivotX, pivotY, scaleX, scaleY, rotation
            );
            const actualTransform = transform.set(
                x, y, pivotX, pivotY, scaleX, scaleY, rotation
            );
            const expected = applyMatrixMethod(expectedMatrix);
            const actual = applyTransformMethod(actualTransform);
            expectMatch(expected, actual);
        });

        test("reuses the output object", () => {
            const expected = applyMatrixMethod(new Matrix2().setTransform(
                initialX, initialY,
                initialPivotX, initialPivotY,
                initialScaleX, initialScaleY,
                initialRotation
            ));
            const out = createOutObject();
            const actual = applyTransformMethod(transform, out);
            expect(actual).toBe(out);
            expectMatch(expected, out);
        });

        test("returns independent objects", () => {
            const first = applyTransformMethod(transform);
            const second = applyTransformMethod(transform);
            expect(first).not.toBe(second);
            expectMatch(first, second);
        });
    };

    const testObjectTransformations = ({ createInput, methodName }) => {
        test("does not modify the input object", () => {
            const input = createInput();
            const snapshot = input.clone();
            transform[methodName](input);
            expect(input.equals(snapshot)).toBe(true);
        });

        test("supports using the input object as the output object", () => {
            const input = createInput();
            const expected = transform[methodName](input.clone());
            const actual = transform[methodName](input, input);
            expect(actual).toBe(input);
            expect(input.equals(expected)).toBe(true);
        });
    };

    describe("transformPointXY(x, y, out)", () => {
        const x = 10;
        const y = 20;
        testTransformations({
            applyMatrixMethod: (matrix) => matrix.transformPointXY(x, y),
            applyTransformMethod: (transform, out) => transform.transformPointXY(x, y, out),
            expectMatch: expectVectorsToMatch,
            createOutObject: () => new Vec2(100, 200)
        });
    });

    describe("transformPoint(point, out)", () => {
        const point = new Vec2(10, 20);
        testTransformations({
            applyMatrixMethod: (matrix) => matrix.transformPoint(point),
            applyTransformMethod: (transform, out) => transform.transformPoint(point, out),
            expectMatch: expectVectorsToMatch,
            createOutObject: () => new Vec2(100, 200)
        });

        testObjectTransformations({
            createInput: () => new Vec2(10, 20),
            methodName: "transformPoint"
        });
    });

    describe("transformVectorXY(x, y, out)", () => {
        const x = 10;
        const y = 20;
        testTransformations({
            applyMatrixMethod: (matrix) => matrix.transformVectorXY(x, y),
            applyTransformMethod: (transform, out) => transform.transformVectorXY(x, y, out),
            expectMatch: expectVectorsToMatch,
            createOutObject: () => new Vec2(100, 200)
        });
    });

    describe("transformVector(vector, out)", () => {
        const vector = new Vec2(10, 20);
        testTransformations({
            applyMatrixMethod: (matrix) => matrix.transformVector(vector),
            applyTransformMethod: (transform, out) => transform.transformVector(vector, out),
            expectMatch: expectVectorsToMatch,
            createOutObject: () => new Vec2(100, 200)
        });

        testObjectTransformations({
            createInput: () => new Vec2(10, 20),
            methodName: "transformVector"
        });
    });

    describe("transformBounds(bounds, out)", () => {
        const bounds = new Bounds(10, 20, 30, 40);
        testTransformations({
            applyMatrixMethod: (matrix) => matrix.transformBounds(bounds),
            applyTransformMethod: (transform, out) => transform.transformBounds(bounds, out),
            expectMatch: expectBoundsToMatch,
            createOutObject: () => new Bounds(100, 200, 300, 400)
        });

        testObjectTransformations({
            createInput: () => new Bounds(10, 20, 30, 40),
            methodName: "transformBounds"
        });
    });

    describe("transformMatrix(inputMatrix, out)", () => {
        const inputMatrix = new Matrix2(1, 2, 3, 4, 5, 6);
        testTransformations({
            applyMatrixMethod: (matrix) => inputMatrix.clone().append(matrix),
            applyTransformMethod: (transform, out) => transform.transformMatrix(inputMatrix, out),
            expectMatch: expectMatricesToMatch,
            createOutObject: () => new Matrix2(100, 200, 300, 400, 500, 600)
        });

        testObjectTransformations({
            createInput: () => new Matrix2(1, 2, 3, 4, 5, 6),
            methodName: "transformMatrix"
        });
    });

    // -------------------------------------------------------------------------
    // MARK: - Inverse Transformations
    // -------------------------------------------------------------------------

    describe("inverseTransformPointXY(x, y, out)", () => {
        const x = 10;
        const y = 20;
        testTransformations({
            applyMatrixMethod: (matrix) => matrix.clone().invert().transformPointXY(x, y),
            applyTransformMethod: (transform, out) => transform.inverseTransformPointXY(x, y, out),
            expectMatch: expectVectorsToMatch,
            createOutObject: () => new Vec2(100, 200)
        });
    });

    describe("inverseTransformPoint(point, out)", () => {
        const point = new Vec2(10, 20);
        testTransformations({
            applyMatrixMethod: (matrix) => matrix.clone().invert().transformPoint(point),
            applyTransformMethod: (transform, out) => transform.inverseTransformPoint(point, out),
            expectMatch: expectVectorsToMatch,
            createOutObject: () => new Vec2(100, 200)
        });

        testObjectTransformations({
            createInput: () => new Vec2(10, 20),
            methodName: "inverseTransformPoint"
        });
    });

    describe("inverseTransformVectorXY(x, y, out)", () => {
        const x = 10;
        const y = 20;
        testTransformations({
            applyMatrixMethod: (matrix) => matrix.clone().invert().transformVectorXY(x, y),
            applyTransformMethod: (transform, out) => transform.inverseTransformVectorXY(x, y, out),
            expectMatch: expectVectorsToMatch,
            createOutObject: () => new Vec2(100, 200)
        });
    });

    describe("inverseTransformVector(vector, out)", () => {
        const vector = new Vec2(10, 20);
        testTransformations({
            applyMatrixMethod: (matrix) => matrix.clone().invert().transformVector(vector),
            applyTransformMethod: (transform, out) => transform.inverseTransformVector(vector, out),
            expectMatch: expectVectorsToMatch,
            createOutObject: () => new Vec2(100, 200)
        });

        testObjectTransformations({
            createInput: () => new Vec2(10, 20),
            methodName: "inverseTransformVector"
        });
    });

    describe("inverseTransformBounds(bounds, out)", () => {
        const bounds = new Bounds(10, 20, 30, 40);
        testTransformations({
            applyMatrixMethod: (matrix) => matrix.clone().invert().transformBounds(bounds),
            applyTransformMethod: (transform, out) => transform.inverseTransformBounds(bounds, out),
            expectMatch: expectBoundsToMatch,
            createOutObject: () => new Bounds(100, 200, 300, 400)
        });

        testObjectTransformations({
            createInput: () => new Bounds(10, 20, 30, 40),
            methodName: "inverseTransformBounds"
        });        
    });

    describe("inverseTransformMatrix(inputMatrix, out)", () => {
        const inputMatrix = new Matrix2(1, 2, 3, 4, 5, 6);
        testTransformations({
            applyMatrixMethod: (matrix) => inputMatrix.clone().append(matrix.clone().invert()),
            applyTransformMethod: (transform, out) => transform.inverseTransformMatrix(inputMatrix, out),
            expectMatch: expectMatricesToMatch,
            createOutObject: () => new Matrix2(100, 200, 300, 400, 500, 600)
        });

        testObjectTransformations({
            createInput: () => new Matrix2(1, 2, 3, 4, 5, 6),
            methodName: "inverseTransformMatrix"
        });        
    });

    // -------------------------------------------------------------------------
    // MARK: - Utilities
    // -------------------------------------------------------------------------

    describe("getMatrix(out)", () => {
        test("returns a matrix equivalent in value to the internal matrix", () => {
            const matrix = transform.getMatrix();
            const internalMatrix = transform.unsafeGetMatrix();

            expect(matrix).toBeInstanceOf(Matrix2);
            expect(matrix.equals(internalMatrix)).toBe(true);
        });

        test("returns a matrix that is not a reference to the internal matrix", () => {
            const initialMatrix = transform.unsafeGetMatrix();
            const initialMatrixSnapshot = initialMatrix.clone();
            const matrix = transform.getMatrix();

            expect(matrix).not.toBe(initialMatrix);

            matrix.a += 10;
            matrix.b += 20;
            matrix.c += 30;
            matrix.d += 40;
            matrix.tx += 50;
            matrix.ty += 60;

            expect(transform.unsafeGetMatrix().equals(initialMatrixSnapshot)).toBe(true);
        });

        test("creates a new matrix when out is not provided", () => {
            const matrix = transform.getMatrix();
            const internalMatrix = transform.unsafeGetMatrix();

            expect(matrix).toBeInstanceOf(Matrix2);
            expect(matrix).not.toBe(internalMatrix);
            expect(matrix.equals(internalMatrix)).toBe(true);
        });

        test("uses the provided out matrix when provided", () => {
            const out = new Matrix2();
            const returnedMatrix = transform.getMatrix(out);
            const internalMatrix = transform.unsafeGetMatrix();

            expect(returnedMatrix).toBe(out);
            expect(returnedMatrix.equals(internalMatrix)).toBe(true);
        });
    });

    describe("unsafeGetMatrix()", () => {
        test("returns the internal matrix", () => {
            const internalMatrix = transform.unsafeGetMatrix();
            internalMatrix.set(100, 100, 100, 100, 100, 100);
            expect(transform.a).toBe(100);
            expect(transform.b).toBe(100);
            expect(transform.c).toBe(100);
            expect(transform.d).toBe(100);
            expect(transform.tx).toBe(100);
            expect(transform.ty).toBe(100);
        });

        test("returns the same matrix instance on subsequent calls", () => {
            const internalMatrix1 = transform.unsafeGetMatrix();
            const internalMatrix2 = transform.unsafeGetMatrix();
            const internalMatrix3 = transform.unsafeGetMatrix();
            expect(internalMatrix1).toBe(internalMatrix2);
            expect(internalMatrix1).toBe(internalMatrix3);
            expect(internalMatrix2).toBe(internalMatrix3);
        });
    });

    describe("getInverseMatrix(out)", () => {
        test("returns a matrix equivalent in value to the internal matrix", () => {
            const matrix = transform.getInverseMatrix();
            const internalMatrix = transform.unsafeGetInverseMatrix();

            expect(matrix).toBeInstanceOf(Matrix2);
            expect(matrix.equals(internalMatrix)).toBe(true);
        });

        test("returns a matrix that is not a reference to the internal matrix", () => {
            const initialMatrix = transform.unsafeGetInverseMatrix();
            const initialMatrixSnapshot = initialMatrix.clone();
            const matrix = transform.getInverseMatrix();

            expect(matrix).not.toBe(initialMatrix);

            matrix.a += 10;
            matrix.b += 20;
            matrix.c += 30;
            matrix.d += 40;
            matrix.tx += 50;
            matrix.ty += 60;

            expect(transform.unsafeGetInverseMatrix().equals(initialMatrixSnapshot)).toBe(true);
        });

        test("creates a new matrix when out is not provided", () => {
            const matrix = transform.getInverseMatrix();
            const internalMatrix = transform.unsafeGetInverseMatrix();

            expect(matrix).toBeInstanceOf(Matrix2);
            expect(matrix).not.toBe(internalMatrix);
            expect(matrix.equals(internalMatrix)).toBe(true);
        });

        test("uses the provided out matrix when provided", () => {
            const out = new Matrix2();
            const returnedMatrix = transform.getInverseMatrix(out);
            const internalMatrix = transform.unsafeGetInverseMatrix();

            expect(returnedMatrix).toBe(out);
            expect(returnedMatrix.equals(internalMatrix)).toBe(true);
        });
    });

    describe("unsafeGetInverseMatrix()", () => {
        test("returns the internal inverse matrix", () => {
            const internalMatrix = transform.unsafeGetInverseMatrix();
            internalMatrix.set(100, 100, 100, 100, 100, 100);
            expect(transform.inverseA).toBe(100);
            expect(transform.inverseB).toBe(100);
            expect(transform.inverseC).toBe(100);
            expect(transform.inverseD).toBe(100);
            expect(transform.inverseTx).toBe(100);
            expect(transform.inverseTy).toBe(100);
        });

        test("returns the same matrix instance on subsequent calls", () => {
            const internalMatrix1 = transform.unsafeGetInverseMatrix();
            const internalMatrix2 = transform.unsafeGetInverseMatrix();
            const internalMatrix3 = transform.unsafeGetInverseMatrix();
            expect(internalMatrix1).toBe(internalMatrix2);
            expect(internalMatrix1).toBe(internalMatrix3);
            expect(internalMatrix2).toBe(internalMatrix3);
        });
    });

    describe("copy(other)", () => {
        test("copies the values from another transform", () => {
            const newTransform = new Transform().copy(transform);
            expect(newTransform.x).toBe(transform.x);
            expect(newTransform.y).toBe(transform.y);
            expect(newTransform.pivotX).toBe(transform.pivotX);
            expect(newTransform.pivotY).toBe(transform.pivotY);
            expect(newTransform.scaleX).toBe(transform.scaleX);
            expect(newTransform.scaleY).toBe(transform.scaleY);
            expect(newTransform.rotation).toBeCloseTo(transform.rotation);
        });

        test("returns the same instance", () => {
            const newTransform = new Transform();
            const result = newTransform.copy(transform);
            expect(result).toBe(newTransform);
            expect(newTransform).toBeInstanceOf(Transform);
            expect(newTransform).not.toBe(transform);
        });

        test("does not copy internal matrices", () => {
            const newTransform = new Transform().copy(transform);
            const oldMatrix = transform.unsafeGetMatrix();
            const oldInverseMatrix = transform.unsafeGetInverseMatrix();
            const newMatrix = newTransform.unsafeGetMatrix();
            const newInverseMatrix = newTransform.unsafeGetInverseMatrix();
            expect(newMatrix).not.toBe(oldMatrix);
            expect(newInverseMatrix).not.toBe(oldInverseMatrix);
        });

        test("does not modify the original transform", () => {
            const oldX = transform.x;
            const oldY = transform.y;
            const oldPivotX = transform.pivotX;
            const oldPivotY = transform.pivotY;
            const oldScaleX = transform.scaleX;
            const oldScaleY = transform.scaleY;
            const oldRotation = transform.rotation;

            new Transform()
                .copy(transform)
                .translateXY(100, 100)
                .translatePivotXY(100, 100)
                .scaleXY(2, 2)
                .rotate(Math.PI / 4);

            expect(transform.x).toBe(oldX);
            expect(transform.y).toBe(oldY);
            expect(transform.pivotX).toBe(oldPivotX);
            expect(transform.pivotY).toBe(oldPivotY);
            expect(transform.scaleX).toBe(oldScaleX);
            expect(transform.scaleY).toBe(oldScaleY);
            expect(transform.rotation).toBeCloseTo(oldRotation);
        });

        test("does not copy onInvalidate callbacks", () => {
            const newOnInvalidate = jest.fn();
            const newTransform = new Transform(newOnInvalidate).copy(transform);

            // Test newTransform's onInvalidate.
            transform.getMatrix();
            newTransform.getMatrix();
            onInvalidated.mockClear();
            newOnInvalidate.mockClear();

            newTransform.translateXY(100, 100);
            expect(onInvalidated).not.toHaveBeenCalled();
            expect(newOnInvalidate).toHaveBeenCalled();

            // Test transform's onInvalidate.
            transform.getMatrix();
            newTransform.getMatrix();
            onInvalidated.mockClear();
            newOnInvalidate.mockClear();

            transform.translateXY(100, 100);
            expect(onInvalidated).toHaveBeenCalled();
            expect(newOnInvalidate).not.toHaveBeenCalled();
        });
    });

    describe("clone()", () => {
        test("creates a new transform with the same properties", () => {
            const clone = transform.clone();
            expect(clone).toBeInstanceOf(Transform);
            expect(clone).not.toBe(transform);
            expect(clone.x).toBe(transform.x);
            expect(clone.y).toBe(transform.y);
            expect(clone.pivotX).toBe(transform.pivotX);
            expect(clone.pivotY).toBe(transform.pivotY);
            expect(clone.scaleX).toBe(transform.scaleX);
            expect(clone.scaleY).toBe(transform.scaleY);
            expect(clone.rotation).toBeCloseTo(transform.rotation);
        });

        test("does not share state with the original transform", () => {
            const clone = transform.clone();

            const matrix = transform.unsafeGetMatrix();
            const inverseMatrix = transform.unsafeGetInverseMatrix();
            const cloneMatrix = clone.unsafeGetMatrix();
            const cloneInverseMatrix = clone.unsafeGetInverseMatrix();

            expect(cloneMatrix).not.toBe(matrix);
            expect(cloneInverseMatrix).not.toBe(inverseMatrix);
            expect(cloneMatrix).toEqual(matrix);
            expect(cloneInverseMatrix).toEqual(inverseMatrix);

            clone.translateXY(100, 100)
                .translatePivotXY(100, 100)
                .scaleXY(2, 2)
                .rotate(Math.PI / 4);

            expect(clone.x).not.toBe(transform.x);
            expect(clone.y).not.toBe(transform.y);
            expect(clone.pivotX).not.toBe(transform.pivotX);
            expect(clone.pivotY).not.toBe(transform.pivotY);
            expect(clone.scaleX).not.toBe(transform.scaleX);
            expect(clone.scaleY).not.toBe(transform.scaleY);
            expect(clone.rotation).not.toBe(transform.rotation);
        });

        test("uses the supplied onInvalidated callback", () => {
            const newOnInvalidate = jest.fn();
            const clone = transform.clone(newOnInvalidate);

            transform.getMatrix();
            clone.getMatrix();
            onInvalidated.mockClear();
            newOnInvalidate.mockClear();

            clone.translateXY(100, 100);
            expect(onInvalidated).not.toHaveBeenCalled();
            expect(newOnInvalidate).toHaveBeenCalled();

            transform.getMatrix();
            clone.getMatrix();
            onInvalidated.mockClear();
            newOnInvalidate.mockClear();

            transform.translateXY(100, 100);
            expect(onInvalidated).toHaveBeenCalled();
            expect(newOnInvalidate).not.toHaveBeenCalled();
        });

        test("clones by deferring to the copy() method", () => {
            const copySpy = jest.spyOn(Transform.prototype, "copy");
            transform.clone();
            expect(copySpy).toHaveBeenCalledWith(transform);
            copySpy.mockRestore();
        });
    });

});
