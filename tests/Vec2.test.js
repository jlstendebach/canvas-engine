import { Vec2 } from "../math/Vec2.js";

const ALLOWED_ERROR = 1e-15; 

let vectors = [
    fromXY( 0,  0),
    fromXY( 1,  2),
    fromXY( 3, -4),
    fromXY(-5,  6),
    fromXY(-7, -8),
    fromRandom(true),
    fromRandom(true),
    fromRandom(true),
    fromRandom(false),
    fromRandom(false),
    fromRandom(false),
];

// --[ alias tests ]------------------------------------------------------------
describe("Vec2 Alias Tests", () => {
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

// --[ factory method tests ]---------------------------------------------------
describe("Vec2 Factory Tests", () => {
    test("Vec2(x, y)", () => {
        expect(new Vec2()).toMatchObject(fromXY(0, 0));
        expect(new Vec2(10)).toMatchObject(fromXY(10, 0));
        expect(new Vec2(3, 4)).toMatchObject(fromXY(3, 4));
    });

    test("Vec2.fromArray(array)", () => {
        expect(Vec2.fromArray()).toMatchObject(fromXY(0, 0));
        expect(Vec2.fromArray(null)).toMatchObject(fromXY(0, 0));
        expect(Vec2.fromArray([])).toMatchObject(fromXY(0, 0));
        expect(Vec2.fromArray([1])).toMatchObject(fromXY(1, 0));
        expect(Vec2.fromArray([1, 2, 3, 4, 5])).toMatchObject(fromXY(1, 2));
        expect(Vec2.fromArray([1, 2, 3, 4, 5], 1)).toMatchObject(fromXY(2, 3));
    });

    test("Vec2.fromObject(object)", () => {
        expect(Vec2.fromObject()).toMatchObject(fromXY(0, 0));
        expect(Vec2.fromObject(null)).toMatchObject(fromXY(0, 0));
        expect(Vec2.fromObject({})).toMatchObject(fromXY(0, 0));
        expect(Vec2.fromObject({x: 1})).toMatchObject(fromXY(1, 0));
        expect(Vec2.fromObject({y: 1})).toMatchObject(fromXY(0, 1));
        expect(Vec2.fromObject({x: 1, y: 2})).toMatchObject(fromXY(1, 2));
    });

    test("Vec2.fromJson(string)", () => {
        expect(Vec2.fromJson()).toMatchObject(fromXY(0, 0));
        expect(Vec2.fromJson(null)).toMatchObject(fromXY(0, 0));
        expect(Vec2.fromJson("asdf")).toMatchObject(fromXY(0, 0));
        expect(Vec2.fromJson("{}")).toMatchObject(fromXY(0, 0));
        expect(Vec2.fromJson('{"x": 1}')).toMatchObject(fromXY(1, 0));
        expect(Vec2.fromJson('{"y": 1}')).toMatchObject(fromXY(0, 1));
        expect(Vec2.fromJson('{"x": 1, "y": 2}')).toMatchObject(fromXY(1, 2));
        expect(Vec2.fromJson('{"x": 1, "y: 2}')).toMatchObject(fromXY(0, 0));
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
        let actualVectors = expectedLengths.map(length => Vec2.random(length));
        let expectedVectors = expectedLengths.map(length => Vec2.random(length));
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
        expect(Vec2.unitX()).toMatchObject(fromXY(1, 0));
        expect(Vec2.unitY()).toMatchObject(fromXY(0, 1));
        expect(Vec2.zero()).toMatchObject(fromXY(0, 0));
        expect(Vec2.one()).toMatchObject(fromXY(1, 1));
    });
});


// --[ math helpers ]-----------------------------------------------------------
/***********/
/* FACTORY */
/***********/
function fromXY(x, y) {
    let v = new Vec2();
    v.x = x;
    v.y = y;
    return v;
}

function fromRandom(round) {
    let v = new Vec2();
    if (round) {
        v.x = Math.round(Math.random()*20 - 10);
        v.y = Math.round(Math.random()*20 - 10);

    } else {
        v.x = Math.random()*20 - 10;
        v.y = Math.random()*20 - 10;
    }
    return v;
}

function fromAngle(radians) {
    let v = new Vec2();
    v.x = Math.cos(radians);
    v.y = Math.sin(radians);
    return v;
}

/********/
/* MATH */
/********/
function add(x1, y1, x2, y2) {
    return fromXY(x1+x2, y1+y2);
}

function subtract(x1, y1, x2, y2) {
    return fromXY(x1-x2, y1-y2);
}

function multiply(x1, y1, x2, y2) {
    return fromXY(x1*x2, y1*y2);
}

function multiplyScalar(x, y, s) {
    return fromXY(x*s, y*s);
}

function divide(x1, y1, x2, y2) {
    return fromXY(x1/x2, y1/y2);
}

function divideScalar(x, y, s) {
    return fromXY(x/s, y/s);
}

function scale(x, y, s) {
    return fromXY(x*s, y*s);
}

function negate(x, y) {
    return fromXY(-x, -y);
}

function floor(x, y) {
    return fromXY(Math.floor(x), Math.floor(y));
}

function ceil(x, y) {
    return fromXY(Math.ceil(x), Math.ceil(y));
}

function round(x, y) {
    return fromXY(Math.round(x), Math.round(y));
}

function rotate(x, y, radians) {
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    return fromXY(
        x * cos - y * sin,
        x * sin + y * cos
    );        
}

function reflect(x1, y1, x2, y2) {
    let dot = dot(x1, y1, x2, y2);
    let scale = 2*dot;
    return fromXY(
        x1 - scale*x2,
        y1 - scale*y2 
    );
}

function mirror(x1, y1, x2, y2) {
    let dot = dot(x1, y1, x2, y2);
    let scale = 2*dot;
    return fromXY(
        scale*x2 - x1,
        scale*y2 - y1 
    );
}

function lerp(x1, y1, x2, y2, a) {
    return fromXY(
        x1 + (x2-x1) * a,
        y1 + (y2-y1) * a
    );
}

function projection(x1, y1, x2, y2) {
    let scale = dot(x1, y1, x2, y2) / lengthSq(x2, y2);
    return fromXY(x2*scale, y2*scale);
}

function rejection(x1, y1, x2, y2) {
    let scale = dot(x1, y1, x2, y2) / lengthSq(x2, y2);
    return fromXY(x1 - x2*scale, y1 - y2*scale);
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

function setLength(x, y, length) {
    const scale = length / length(x, y);
    return fromXY(x*scale, y*scale);
}

function limitLength(x, y, max) {
    const length = length(x, y);
    return (length > max
        ? fromXY(max * x / length, max * y / length)
        : fromXY(x, y)
    );            
}

function clampLength(x, y, min, max = Number.MAX_VALUE) {
    const length = length(x, y);
    if (length < min) {
        return fromXY(min * x / length, min * y / length);

    } else if (length > max) {
        return fromXY(max * x / length, max * y / length);
    }
    return fromXY(x, y);
}

function normalize(x, y) {
    return setLength(x, y, 1);
}

/********/
/* INFO */
/********/
function dot(x1, y1, x2, y2) {
    return x1*x2 + y1*y2;
}

function angle(x1, y1, x2, y2) {
    const dot = dot(x1, y1, x2, y2);
    const length = length(x1, y1) * length(x2, y2);
    return Math.acos(dot / length);
}

function angleTau(x1, y1, x2, y2) {
    const angle = angle(x1, y1, x2, y2);
    return (x1 * y2 - y1 * x2 < 0) 
        ? 2 * Math.PI - angle
        : angle;        
}

