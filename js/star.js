class Star {
    constructor(name, x, y, z, r, classes) {
        let self = this;
        this.name = name;
        this.r = r;
        this.point = new Point(x, y, z);

        this.svg = document.createElementNS("http://www.w3.org/2000/svg", "circle");

        this.svg.setAttributeNS(null, "id", name);
        this.svg.setAttributeNS(null, "class", classes);
        this.svg.setAttributeNS(null, "stroke", "none");
        this.svg.setAttributeNS(null, "r", r);

        this.update();

/*        this.svg.onclick = function() {
            console.log(self.name);
        }
*/
        document.getElementById("stars").appendChild(this.svg);
    }

    update() {
        this.svg.setAttributeNS(null, "cx", this.point.x);
        this.svg.setAttributeNS(null, "cy", this.point.y);
        this.svg.setAttributeNS(null, "cz", this.point.z);
    }
}
