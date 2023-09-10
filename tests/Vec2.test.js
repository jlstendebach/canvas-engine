import { Vec2 } from "../math/Vec2.js";

const ALLOWED_ERROR = 1e-15; 

const VECTORS = [
    new Vec2( 0,  0),
    new Vec2( 1,  2),
    new Vec2( 3, -4),
    new Vec2(-5,  6),
    new Vec2(-7, -8),
    Vec2.random(10),
    Vec2.random(10),
    Vec2.random(10),
    Vec2.random(10).round(),
    Vec2.random(10).round(),
];

// --[ constructor tests ]------------------------------------------------------
describe("Vec2 Constructor", () => {
    test("Vec2(x, y)", () => {
        expect(new Vec2().x).toBe(0);
        expect(new Vec2().y).toBe(0);
        expect(new Vec2(10).x).toBe(10);
        expect(new Vec2(10).y).toBe(0);
        expect(new Vec2(3, 4).x).toBe(3);
        expect(new Vec2(3, 4).y).toBe(4);
    });
});

// --[ alias tests ]------------------------------------------------------------
describe("Vec2 Aliases", () => {
    test("v.width/v.height are alias's of v.x/v.y", () => {
        let v = new Vec2(1, 2);
        expect(v.x).toBe(1);
        expect(v.width).toBe(v.x);
        expect(v.y).toBe(2);
        expect(v.height).toBe(v.y);

        v.width = 20
        expect(v.x).toBe(20);
        expect(v.width).toBe(v.x);
        expect(v.y).toBe(2);
        expect(v.height).toBe(v.y);

        v.height = 30
        expect(v.x).toBe(20);
        expect(v.width).toBe(v.x);
        expect(v.y).toBe(30);
        expect(v.height).toBe(v.y);
    });
});

// --[ in-place operations ]----------------------------------------------------
describe("Vec2 In-Place Operations", () => {
    const doTests = (updateActual, getExpected, isValid=()=>{ return true; }) => {
        for (let v of VECTORS) {
            if (!isValid(v)) {
                continue; 
            }
            const old = new Vec2(v.x, v.y);
            const actual = new Vec2(v.x, v.y);
            const actualReturnValue = updateActual(actual); // method is meant to alter its input
            const expected = getExpected(new Vec2(v.x, v.y));
            const xDist = Math.abs(actual.x - expected.x);
            const yDist = Math.abs(actual.y - expected.y);

            // This checks the math is correct
            expect(xDist).toBeLessThanOrEqual(ALLOWED_ERROR);
            expect(yDist).toBeLessThanOrEqual(ALLOWED_ERROR);

            // This checks the original object was changed for future tests
            expect(v).toMatchObject(old);

            // This makes sure the method is returning itself since this is an
            // in-place operation.
            expect(actualReturnValue).toMatchObject(actual);
        }
    };

    test("v.set(x, y)", () => {
        doTests(
            (v) => { return v.set(1, 2); },
            (v) => { return new Vec2(1, 2); }
        );
    });

    test("v1.add(v2)", () => {
        doTests(
            (v) => { return v.add(new Vec2(5, 10)); },
            (v) => { return new Vec2(v.x+5, v.y+10); }
        );
    });

    test("v1.subtract(v2)", () => {
        doTests(
            (v) => { return v.subtract(new Vec2(5, 10)); },
            (v) => { return new Vec2(v.x-5, v.y-10); }
        );
    });

    test("v1.multiply(v2)", () => {
        doTests(
            (v) => { return v.multiply(new Vec2(5, 10)); },
            (v) => { return new Vec2(v.x*5, v.y*10); }
        );
    });

    test("v1.divide(v2)", () => {
        doTests(
            (v) => { return v.divide(new Vec2(5, 10)); },
            (v) => { return new Vec2(v.x/5, v.y/10); }
        );
    });

    test("v.multiplyScalar(s)", () => {
        doTests(
            (v) => { return v.multiplyScalar(12.345); },
            (v) => { return new Vec2(v.x*12.345, v.y*12.345); }
        );
    });

    test("v.divideScalar(s)", () => {
        doTests(
            (v) => { return v.divideScalar(12.345); },
            (v) => { return new Vec2(v.x/12.345, v.y/12.345); }
        );
    });

    test("v.scale(s)", () => {
        doTests(
            (v) => { return v.scale(12.345); },
            (v) => { return v.multiplyScalar(12.345); },
        );
    });

    test("v.negate()", () => {
        doTests(
            (v) => { return v.negate(); },
            (v) => { return new Vec2(-v.x, -v.y); }
        );
    });

    test("v.floor()", () => {
        doTests(
            (v) => { return v.floor(); },
            (v) => { return new Vec2(Math.floor(v.x), Math.floor(v.y)); }
        );
    });

    test("v.ceil()", () => {
        doTests(
            (v) => { return v.ceil(); },
            (v) => { return new Vec2(Math.ceil(v.x), Math.ceil(v.y)); }
        );
    });

    test("v.round()", () => {
        doTests(
            (v) => { return v.round(); },
            (v) => { return new Vec2(Math.round(v.x), Math.round(v.y)); }
        );
    });

    test("v.rotate(radians)", () => {
        const degrees = [
            0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360
        ];
        for (let degree of degrees) {
            const radians = degree * Math.PI / 180.0;
            doTests(
                (v) => { return v.rotate(radians); },
                (v) => { return rotate(v.x, v.y, radians); }
            );
        }
    });

    test("v.reflect(normal)", () => {
        for (let normal of VECTORS) {
            doTests(
                (v) => { return v.reflect(normal); },
                (v) => { return reflect(v.x, v.y, normal.x, normal.y); }
            );    
        }
    });

    test("v.mirror(mirror)", () => {
        for (let m of VECTORS) {
            doTests(
                (v) => { return v.mirror(m); },
                (v) => { return mirror(v.x, v.y, m.x, m.y); }
            );    
        }
    });

    test("v1.lerp(v2, a)", () => {
        for (let v2 of VECTORS) {
            for (let a = -0.25; a <= 1.25; a += 0.25) {
                doTests(
                    (v1) => { return v1.lerp( v2, a); },
                    (v1) => { return lerp(v1.x, v1.y, v2.x, v2.y, a); }
                );    
            }
        }
    });

    test("v1.project(v2)", () => {
        for (let v2 of VECTORS) {
            if (v2.isZero()) { continue; }
            doTests(
                (v1) => { return v1.project(v2); },
                (v1) => { return projection(v1.x, v1.y, v2.x, v2.y); }
            );    
        }
    });

    test("v1.reject(v2)", () => {
        for (let v2 of VECTORS) {
            if (v2.isZero()) { continue; }
            doTests(
                (v1) => { return v1.reject(v2); },
                (v1) => { return rejection(v1.x, v1.y, v2.x, v2.y); }
            );    
        }
    });

    test("v.lengthSq()", () => {
        for (let v of VECTORS) {
            expect(v.lengthSq()).toBe(lengthSq(v.x, v.y));
        }
    });

    test("v.length()", () => {
        for (let v of VECTORS) {
            expect(v.length()).toBe(length(v.x, v.y));
        }
    });

    test("v.setLength(length, current)", () => {
        const lengths = [0, 0.5, 1, 2, 3, Math.PI, 4, 5];
        for (let newLength of lengths) {
            doTests(
                (v) => { return v.setLength(newLength); },
                (v) => { return setLength(v.x, v.y, newLength); },
                (v) => { return v.isNotZero(); }
            );    
        }
    });

    test("v.limitLength(max, current)", () => {
        const lengths = [0, 0.5, 1, 2, 3, Math.PI, 4, 5];
        for (let maxLength of lengths) {
            doTests(
                (v) => { return v.limitLength(maxLength); },
                (v) => { return limitLength(v.x, v.y, maxLength); },
                (v) => { return v.isNotZero(); }
            );    
        }
    });

    test("v.clampLength(min, max, current)", () => {
        const minLengths = [0, 0.5, 1, Math.PI, 4, 5, 10, 20, 100];
        const maxLengths = [0, 0.5, 1, Math.PI, 4, 5, 10, 20, 100];
        for (let minLength of minLengths) {
            doTests(
                (v) => { return v.clampLength(minLength); },
                (v) => { return clampLength(v.x, v.y, minLength); },
                (v) => { return v.isNotZero(); }
            );    
            for (let maxLength of maxLengths) {
                doTests(
                    (v) => { return v.clampLength(minLength, maxLength); },
                    (v) => { return clampLength(v.x, v.y, minLength, maxLength); },
                    (v) => { return v.isNotZero(); }
                );    
            }
        }        
    });

    test("v.normalize(current)", () => {
        doTests(
            (v) => { return v.normalize(); },
            (v) => { return normalize(v.x, v.y); },
            (v) => { return v.isNotZero(); }
        );        
        doTests(
            (v) => { return v.normalize(v.length()); },
            (v) => { return normalize(v.x, v.y); },
            (v) => { return v.isNotZero(); }
        );        
    });
});

// --[ scalar operation tests ]-------------------------------------------------
describe("Vec2 Scalar Operations", () => {
    const doTests = (getActual, getExpected, isValid = (v)=>{ return true; }) => {
        for (let v of VECTORS) {
            if (!isValid(v)) {
                continue; 
            }
            const old = v.clone();
            const actual = getActual(v);
            const expected = getExpected(v);
            const dist = Math.abs(actual - expected);
            expect(dist).toBeLessThanOrEqual(ALLOWED_ERROR);
            expect(v).toMatchObject(old);
        }
    };    

    test("v1.dot(v2)", () => {
        for (let v2 of VECTORS) {
            doTests(
                (v1) => { return v1.dot(v2); },
                (v1) => { return v1.x*v2.x + v1.y*v2.y; }
            );                
        }
    });

    test("v1.angle(v2)", () => {        
        for (let v2 of VECTORS) {
            if (v2.isZero()) { continue; }
            doTests(
                (v1) => { return v1.angle(v2); },
                (v1) => { return angle(v1.x, v1.y, v2.x, v2.y); },
                (v1) => { return v1.isNotZero(); }
            );                
        }

        doTests(
            (v1) => { return v1.angle(); },
            (v1) => { return angle(v1.x, v1.y, 1, 0); },
            (v1) => { return v1.isNotZero(); }
        );                
    });

    test("v1.angleTau(v2)", () => {        
        for (let v2 of VECTORS) {
            if (v2.isZero()) { continue; }
            doTests(
                (v1) => { return v1.angleTau(v2); },
                (v1) => { return angleTau(v1.x, v1.y, v2.x, v2.y); },
                (v1) => { return v1.isNotZero(); }
            );                
        }

        doTests(
            (v1) => { return v1.angleTau(); },
            (v1) => { return angleTau(v1.x, v1.y, 1, 0); },
            (v1) => { return v1.isNotZero(); }
        );                
    });    

    test("v1.distanceSq(v2)", () => {        
        for (let v2 of VECTORS) {
            doTests(
                (v1) => { return v1.distanceSq(v2); },
                (v1) => { return distanceSq(v1.x, v1.y, v2.x, v2.y); }
            );                
        }           
    });    

    test("v1.distance(v2)", () => {        
        for (let v2 of VECTORS) {
            doTests(
                (v1) => { return v1.distance(v2); },
                (v1) => { return distance(v1.x, v1.y, v2.x, v2.y); }
            );                
        }           
    });    
});

// --[ helper tests ]-----------------------------------------------------------
describe("Vec2 Helper Methods", () => {
    test("v.isZero()", () => {
        for (let v of VECTORS) {
            expect(v.isZero()).toBe(v.x == 0 && v.y == 0);
        }
    });

    test("v.isNotZero()", () => {
        for (let v of VECTORS) {
            expect(v.isNotZero()).toBe(v.x != 0 || v.y != 0);
        }
    });

    test("v.clone()", () => {
        for (let v of VECTORS) {
            expect(v.clone()).toMatchObject(v);
            let cloned = v.clone();
            cloned.x += 1;
            cloned.y += 1;
            expect(cloned).not.toMatchObject(v);
        }
    });

    test("v1.copy(v2)", () => {
        for (let v2 of VECTORS) {
            let v1 = new Vec2(v2.x+1, v2.y-1);
            expect(v1).not.toMatchObject(v2);
            v1.copy(v2);
            expect(v1).toMatchObject(v2);
            v1.x += 1;
            v1.y -= 1;
            expect(v1).not.toMatchObject(v2);
        }
    });

    test("v1.equals(v2)", () => {
        for (let v1 of VECTORS) {
            expect(v1.equals(new Vec2(v1.x, v1.y))).toBe(true);
            expect(v1.equals(new Vec2(v1.x+1, v1.y))).toBe(false);
            expect(v1.equals(new Vec2(v1.x, v1.y+1))).toBe(false);
            expect(v1.equals(new Vec2(v1.x+1, v1.y+1))).toBe(false);
        }        
    });

    test("v.toArray()", () => {
        for (let v of VECTORS) {
            expect(v.toArray()).toMatchObject([v.x, v.y]);
        }
    });

    test("v.toJson()", () => {
        for (let v of VECTORS) {
            expect(v.toJson()).toBe(`{"x":${v.x},"y":${v.y}}`);
        }
    });

    test("v.toString()", () => {
        for (let v of VECTORS) {
            expect(v.toString()).toBe(`(${v.x},${v.y})`);
        }
    });
});

// --[ factory method tests ]---------------------------------------------------
describe("Vec2 Static Factories", () => {
    test("Vec2.fromArray(array)", () => {
        expect(Vec2.fromArray()).toMatchObject(new Vec2(0, 0));
        expect(Vec2.fromArray(null)).toMatchObject(new Vec2(0, 0));
        expect(Vec2.fromArray([])).toMatchObject(new Vec2(0, 0));
        expect(Vec2.fromArray([1])).toMatchObject(new Vec2(1, 0));
        expect(Vec2.fromArray([1, 2, 3, 4, 5])).toMatchObject(new Vec2(1, 2));
        expect(Vec2.fromArray([1, 2, 3, 4, 5], 1)).toMatchObject(new Vec2(2, 3));
    });

    test("Vec2.fromObject(object)", () => {
        expect(Vec2.fromObject()).toMatchObject(new Vec2(0, 0));
        expect(Vec2.fromObject(null)).toMatchObject(new Vec2(0, 0));
        expect(Vec2.fromObject({})).toMatchObject(new Vec2(0, 0));
        expect(Vec2.fromObject({x: 1})).toMatchObject(new Vec2(1, 0));
        expect(Vec2.fromObject({y: 1})).toMatchObject(new Vec2(0, 1));
        expect(Vec2.fromObject({x: 1, y: 2})).toMatchObject(new Vec2(1, 2));
    });

    test("Vec2.fromJson(string)", () => {
        expect(Vec2.fromJson()).toMatchObject(new Vec2(0, 0));
        expect(Vec2.fromJson(null)).toMatchObject(new Vec2(0, 0));
        expect(Vec2.fromJson("asdf")).toMatchObject(new Vec2(0, 0));
        expect(Vec2.fromJson("{}")).toMatchObject(new Vec2(0, 0));
        expect(Vec2.fromJson('{"x": 1}')).toMatchObject(new Vec2(1, 0));
        expect(Vec2.fromJson('{"y": 1}')).toMatchObject(new Vec2(0, 1));
        expect(Vec2.fromJson('{"x": 1, "y": 2}')).toMatchObject(new Vec2(1, 2));
        expect(Vec2.fromJson('{"x": 1, "y: 2}')).toMatchObject(new Vec2(0, 0));
    });

    test("Vec2.fromAngle(radians)", () => {
        let degreesList = [
            0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360
        ];

        let actual = [];
        let expected = [];
        for (let degrees of degreesList) {
            let radians = degrees * Math.PI / 180.0;
            actual.push(Vec2.fromAngle(radians));
            expected.push(fromAngle(radians));
        }

        expect(actual).toMatchObject(expected);
    });

    test("Vec2.random()", () => {
        let expectedLengths = [1, 1, 1, 2, 2, 2, 3, 3, 3];
        let actualVectors = expectedLengths.map(length => {
            return length == 1 ? Vec2.random() : Vec2.random(length);
        });
        let expectedVectors = expectedLengths.map(length => {
            return length == 1 ? Vec2.random() : Vec2.random(length);
        });
        let actualLengths = actualVectors.map(vec => vec.length());

        // The two vectors shouldn't be the same because they were both randomly
        // generated.
        for (let i = 0; i < actualVectors.length; i++) {
            const actual = actualVectors[i];
            const expected = expectedVectors[i];
            expect(actual).not.toMatchObject(expected);
        }

        // However, their lengths should be the same (within an allowed error).
        for (let i = 0; i < actualVectors.length; i++) {
            const actual = actualLengths[i];
            const expected = expectedLengths[i];
            const distance = Math.abs(actual-expected);
            expect(distance).toBeLessThanOrEqual(ALLOWED_ERROR);
        }        
    });

    test("Misc factory methods", () => {
        expect(Vec2.unitX()).toMatchObject(new Vec2(1, 0));
        expect(Vec2.unitY()).toMatchObject(new Vec2(0, 1));
        expect(Vec2.zero()).toMatchObject(new Vec2(0, 0));
        expect(Vec2.one()).toMatchObject(new Vec2(1, 1));
    });
});

// --[ static vector operation tests ]------------------------------------------
describe("Vec2 Static Vector Operations", () => {
    const doTests = (getActual, getExpected, isValid=()=>{ return true; }) => {
        for (let v of VECTORS) {
            if (!isValid(v)) {
                continue; 
            }
            const old = new Vec2(v.x, v.y);
            const actual = getActual(v);
            const expected = getExpected(v);
            const xDist = Math.abs(actual.x - expected.x);
            const yDist = Math.abs(actual.y - expected.y);
            expect(xDist).toBeLessThanOrEqual(ALLOWED_ERROR);
            expect(yDist).toBeLessThanOrEqual(ALLOWED_ERROR);
            expect(v).toMatchObject(old);
        }
    };

    test("Vec2.add(v1, v2)", () => {
        doTests(
            (v) => { return Vec2.add(v, new Vec2(5, 10)); },
            (v) => { return new Vec2(v.x+5, v.y+10); }
        );
    });

    test("Vec2.subtract(v1, v2)", () => {
        doTests(
            (v) => { return Vec2.subtract(v, new Vec2(5, 10)); },
            (v) => { return new Vec2(v.x-5, v.y-10); }
        );
    });

    test("Vec2.multiply(v1, v2)", () => {
        doTests(
            (v) => { return Vec2.multiply(v, new Vec2(5, 10)); },
            (v) => { return new Vec2(v.x*5, v.y*10); }
        );
    });

    test("Vec2.divide(v1, v2)", () => {
        doTests(
            (v) => { return Vec2.divide(v, new Vec2(5, 10)); },
            (v) => { return new Vec2(v.x/5, v.y/10); }
        );
    });

    test("Vec2.multiplyScalar(v, s)", () => {
        doTests(
            (v) => { return Vec2.multiplyScalar(v, 12.345); },
            (v) => { return new Vec2(v.x*12.345, v.y*12.345); }
        );
    });

    test("Vec2.divideScalar(v, s)", () => {
        doTests(
            (v) => { return Vec2.divideScalar(v, 12.345); },
            (v) => { return new Vec2(v.x/12.345, v.y/12.345); }
        );
    });

    test("Vec2.scale(v, s)", () => { // alias of multiplyScalar
        doTests(
            (v) => { return Vec2.scale(v, 12.345); },
            (v) => { return Vec2.multiplyScalar(v, 12.345); }
        );
    });

    test("Vec2.negate(v)", () => {
        doTests(
            (v) => { return Vec2.negate(v); },
            (v) => { return new Vec2(-v.x, -v.y); }
        );
    });

    test("Vec2.floor(v)", () => {
        doTests(
            (v) => { return Vec2.floor(v); },
            (v) => { return new Vec2(Math.floor(v.x), Math.floor(v.y)); }
        );
    });

    test("Vec2.ceil(v)", () => {
        doTests(
            (v) => { return Vec2.ceil(v); },
            (v) => { return new Vec2(Math.ceil(v.x), Math.ceil(v.y)); }
        );
    });

    test("Vec2.round(v)", () => {
        doTests(
            (v) => { return Vec2.round(v); },
            (v) => { return new Vec2(Math.round(v.x), Math.round(v.y)); }
        );
    });

    test("Vec2.rotate(v, radians)", () => {
        const degrees = [
            0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360
        ];
        for (let degree of degrees) {
            const radians = degree * Math.PI / 180.0;
            doTests(
                (v) => { return Vec2.rotate(v, radians); },
                (v) => { return rotate(v.x, v.y, radians); }
            );
        }
    });

    test("Vec2.reflect(v, normal)", () => {
        for (let normal of VECTORS) {
            doTests(
                (v) => { return Vec2.reflect(v, normal); },
                (v) => { return reflect(v.x, v.y, normal.x, normal.y); }
            );    
        }
    });
    
    test("Vec2.mirror(v, mirror)", () => {
        for (let m of VECTORS) {
            doTests(
                (v) => { return Vec2.mirror(v, m); },
                (v) => { return mirror(v.x, v.y, m.x, m.y); }
            );    
        }
    });

    test("Vec2.lerp(v1, v2, a)", () => {
        for (let v2 of VECTORS) {
            for (let a = -0.25; a <= 1.25; a += 0.25) {
                doTests(
                    (v1) => { return Vec2.lerp(v1, v2, a); },
                    (v1) => { return lerp(v1.x, v1.y, v2.x, v2.y, a); }
                );    
            }
        }
    });

    test("Vec2.projection(v1, v2)", () => {
        for (let v2 of VECTORS) {
            if (v2.isZero()) { continue; }
            doTests(
                (v1) => { return Vec2.projection(v1, v2); },
                (v1) => { return projection(v1.x, v1.y, v2.x, v2.y); }
            );    
        }
    });

    test("Vec2.rejection(v1, v2)", () => {
        for (let v2 of VECTORS) {
            if (v2.isZero()) { continue; }
            doTests(
                (v1) => { return Vec2.rejection(v1, v2); },
                (v1) => { return rejection(v1.x, v1.y, v2.x, v2.y); }
            );    
        }
    });

    test("Vec2.normalize(v, length)", () => {
        doTests(
            (v) => { return Vec2.normalize(v); },
            (v) => { return normalize(v.x, v.y); },
            (v) => { return !v.equals(Vec2.zero()); }
        );
    });

    test("Vec2.normal(v)", () => {
        doTests(
            (v) => { return Vec2.normal(v); },
            (v) => { return new Vec2(-v.y, v.x); }
        );
    });

    test("Vec2.unitNormal(v, length)", () => {
        doTests(
            (v) => { return Vec2.unitNormal(v); },
            (v) => { return setLength(-v.y, v.x, 1); },
            (v) => { return !v.isZero(); }
        );
    });
    
});

// --[ static scalar operation tests ]------------------------------------------
describe("Vec2 Static Scalar Operations", () => {
    const doTests = (getActual, getExpected, isValid = (v)=>{ return true; }) => {
        for (let v of VECTORS) {
            if (!isValid(v)) {
                continue; 
            }
            const old = v.clone();
            const actual = getActual(v);
            const expected = getExpected(v);
            const dist = Math.abs(actual - expected);
            expect(dist).toBeLessThanOrEqual(ALLOWED_ERROR);
            expect(v).toMatchObject(old);
        }
    };    

    test("Vec2.dot(v1, v2)", () => {
        for (let v2 of VECTORS) {
            doTests(
                (v1) => { return Vec2.dot(v1, v2); },
                (v1) => { return v1.x*v2.x + v1.y*v2.y; }
            );                
        }
    });

    test("Vec2.angle(v1, v2)", () => {        
        for (let v2 of VECTORS) {
            if (v2.isZero()) { continue; }
            doTests(
                (v1) => { return Vec2.angle(v1, v2); },
                (v1) => { return angle(v1.x, v1.y, v2.x, v2.y); },
                (v1) => { return v1.isNotZero(); }
            );                
        }

        doTests(
            (v1) => { return Vec2.angle(v1); },
            (v1) => { return angle(v1.x, v1.y, 1, 0); },
            (v1) => { return v1.isNotZero(); }
        );                
    });

    test("Vec2.angleTau(v1, v2)", () => {        
        for (let v2 of VECTORS) {
            if (v2.isZero()) { continue; }
            doTests(
                (v1) => { return Vec2.angleTau(v1, v2); },
                (v1) => { return angleTau(v1.x, v1.y, v2.x, v2.y); },
                (v1) => { return v1.isNotZero(); }
            );                
        }

        doTests(
            (v1) => { return Vec2.angleTau(v1); },
            (v1) => { return angleTau(v1.x, v1.y, 1, 0); },
            (v1) => { return v1.isNotZero(); }
        );                
    });    

    test("Vec2.distanceSq(v1, v2)", () => {        
        for (let v2 of VECTORS) {
            doTests(
                (v1) => { return Vec2.distanceSq(v1, v2); },
                (v1) => { return distanceSq(v1.x, v1.y, v2.x, v2.y); }
            );                
        }           
    });    

    test("Vec2.distance(v1, v2)", () => {        
        for (let v2 of VECTORS) {
            doTests(
                (v1) => { return Vec2.distance(v1, v2); },
                (v1) => { return distance(v1.x, v1.y, v2.x, v2.y); }
            );                
        }           
    });    
});

// --[ math helpers ]-----------------------------------------------------------
/***********/
/* FACTORY */
/***********/
function fromAngle(radians) {
    let v = new Vec2();
    v.x = Math.cos(radians);
    v.y = Math.sin(radians);
    return v;
}

/********/
/* MATH */
/********/
function rotate(x, y, radians) {
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    return new Vec2(
        x * cos - y * sin,
        x * sin + y * cos
    );        
}

function reflect(x1, y1, x2, y2) {
    const dot = x1*x2 + y1*y2;
    const scale = 2*dot;
    return new Vec2(
        x1 - scale*x2,
        y1 - scale*y2 
    );
}

function mirror(x1, y1, x2, y2) {
    const dot = x1*x2 + y1*y2;
    const scale = 2*dot;
    return new Vec2(
        scale*x2 - x1,
        scale*y2 - y1 
    );
}

function lerp(x1, y1, x2, y2, a) {
    return new Vec2(
        (1-a)*x1 + a*x2,
        (1-a)*y1 + a*y2,
    );
}

function projection(x1, y1, x2, y2) {
    const lengthSq = x2**2 + y2**2;
    const dot = x1*x2 + y1*y2;
    const scale = dot / lengthSq;
    return new Vec2(x2*scale, y2*scale);
}

function rejection(x1, y1, x2, y2) {
    const lengthSq = x2**2 + y2**2;
    const dot = x1*x2 + y1*y2;
    const scale = dot / lengthSq;    
    return new Vec2(x1 - x2*scale, y1 - y2*scale);
}

function angle(x1, y1, x2, y2) {
    // a . b = |a|*|b|*cos(angle)
    // angle = acos((a . b) / (|a| * |b|))

    const dot = x1*x2 + y1*y2;
    const lengthSq1 = lengthSq(x1, y1) 
    const lengthSq2 = lengthSq(x2, y2);
    return Math.acos(dot / Math.sqrt(lengthSq1*lengthSq2));
}

function angleTau(x1, y1, x2, y2) {
    return (x1 * y2 - y1 * x2 < 0) 
        ? 2 * Math.PI - angle(x1, y1, x2, y2)
        : angle(x1, y1, x2, y2);        
}

function distanceSq(x1, y1, x2, y2) {
    return (x1-x2)**2 + (y1-y2)**2;
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt(distanceSq(x1, y1, x2, y2));    
}

/**********/
/* LENGTH */
/**********/
function lengthSq(x, y) {
    return x**2 + y**2;
}

function length(x, y) {
    return Math.sqrt(lengthSq(x, y));
}

function setLength(x, y, newLength) {
    const scale = newLength / length(x, y);
    return new Vec2(x*scale, y*scale);
}

function limitLength(x, y, max) {
    const current = length(x, y);
    return (current > max
        ? new Vec2(max * x / current, max * y / current)
        : new Vec2(x, y)
    );            
}

function clampLength(x, y, min, max = null) {
    const current = length(x, y);
    if (current < min) {
        return setLength(x, y, min);

    } else if (max != null && current > max) {
        return setLength(x, y, max);
    }
    return new Vec2(x, y);
}

function normalize(x, y) {
    return setLength(x, y, 1);
}
