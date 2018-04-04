class Point {
    constructor(x, y, z) {
        this.x = parseFloat(x);
        this.y = parseFloat(y);
        this.z = parseFloat(z);
        this.ox = this.x;
        this.oy = this.y;
        this.oz = this.z;
    }

    rotate3D(angle_a, angle_b, angle_c, anchor) {
        let radians_a = (Math.PI / 180) * angle_a,
            radians_b = (Math.PI / 180) * angle_b,
            radians_c = (Math.PI / 180) * angle_c,
            cos_a = Math.cos(radians_a),
            cos_b = Math.cos(radians_b),
            cos_c = Math.cos(radians_c),
            sin_a = Math.sin(radians_a),
            sin_b = Math.sin(radians_b),
            sin_c = Math.sin(radians_c);

        this.rotate_around_z(cos_a, sin_a, anchor);
        this.rotate_around_y(cos_b, sin_b, anchor);
        this.rotate_around_x(cos_c, sin_c, anchor);
    }

    rotate_around_z(cos, sin, anchor) {
        let nx = (cos * (this.x - anchor.x)) + (-1 * sin * (this.y - anchor.y)) + anchor.x,
            ny = (sin * (this.x - anchor.x)) + (cos * (this.y - anchor.y)) + anchor.y;

        this.x = nx;
        this.y = ny;
    }

    rotate_around_y(cos, sin, anchor) {
        let nx = (cos * (this.x - anchor.x)) + (sin * (this.z - anchor.z)) + anchor.x,
            nz = (-1 * sin * (this.x - anchor.x)) + (cos * (this.z - anchor.z)) + anchor.z;

        this.x = nx;
        this.z = nz;
    }

    rotate_around_x(cos, sin, anchor) {
        let ny = (cos * (this.y - anchor.y)) + (-1 * sin * (this.z - anchor.z)) + anchor.y,
            nz = (sin * (this.y - anchor.y)) + (cos * (this.z - anchor.z)) + anchor.z;

        this.y = ny;
        this.z = nz;
    }

    reset() {
        this.x = this.ox;
        this.y = this.oy;
        this.z = this.oz;
    }
}
