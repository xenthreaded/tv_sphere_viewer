class Universe {
    constructor(stars) {
        this.center_w = 2000;
        this.center_h = 1250;

        //{name, x, y, z, r, classes}
        this.stars = new Array();
        for (let i = 0; i < stars.length; i++) {

            let current = stars[i],
                star = new Star(
                    current.name,
                    this.center_w + current.x, 
                    this.center_h - current.y, 
                    -current.z,
                    current.r,
                    current.classes
                );

            this.stars.push(star);

            if(current.x == 0 && current.y == 0 && current.z == 0) {
                this.center = star;
            }

            this.adjust_size();
        }
    }

    update() {
        for(let star in this.stars) {
            this.stars[star].update();
        }
    }

    rotate3D(angle_a, angle_b, angle_c) {
        for (let i = 0; i < this.stars.length; i++) {
            this.stars[i].point.rotate3D(angle_a, angle_b, angle_c, this.center.point);
        }

        this.adjust_size();
    }

    set_angles(angle_a, angle_b, angle_c) {
        this.reset();
        this.rotate3D(angle_a, angle_b, angle_c);
    }

    reset() {
        for (let i = 0; i < this.stars.length; i++) {
            this.stars[i].point.reset();
        }

        this.update();
        this.adjust_size();
    }

    merge_sort(stars) {
        let list_star = Array.prototype.slice.call(stars, 0);

        if(list_star.length <= 1) {
            return list_star;
        }

        const middle = Math.floor(list_star.length / 2);
        const left = list_star.slice(0, middle);
        const right = list_star.slice(middle);

        return this.merge(
            this.merge_sort(left),
            this.merge_sort(right)
        )
    }

    merge(left, right) {

        let result = [],
            index_left = 0,
            index_right = 0;

        while(index_left < left.length && index_right < right.length) {
            let l = left[index_left],
                r = right[index_right];

            if(parseFloat(l.getAttribute("cz")) < parseFloat(r.getAttribute("cz"))) {
                result.push(l);
                index_left++
            } else {
                result.push(r);
                index_right++
            }
        }

        return result.concat(left.slice(index_left)).concat(right.slice(index_right))
    }

    adjust_size() {
        let stars = document.getElementById("stars"),
            output = this.merge_sort(stars.children).reverse();

        stars.innerHTML = "";

        for(let i = 0; i < output.length; i++) {
            let z = parseFloat(output[i].getAttribute("cz"));
            output[i].setAttributeNS(null, "r", scale_between(z, 10, 50, 4000, -4000));
            stars.appendChild(output[i]);
        }
    }
}
