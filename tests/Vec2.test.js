import { Vec2 } from "../math/Vec2.js";

test("Vec2.add(v1, v2)", () => {
    const v1 = new Vec2(1, 1);
    const v2 = new Vec2(2, 3);
    const result = Vec2.add(v1, v2);

    expect(result.x).toBe(5);
    expect(result.y).toBe(4);
});