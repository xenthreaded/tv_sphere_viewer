//TODO : 
//  clean code (let AL = this.AL !!!)
//  check a solution for rotate3D that doesn't need applying a rotation for each axis
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

class Etoile {
    constructor(name, x, y, z, r, color) {
        this.name = name;
        this.r = r;
        this.color = color;
        this.point = new Point(x, y, z);
    }

    draw(target) {
        target.fillStyle = this.color;
        target.beginPath();
        target.arc(this.point.x, this.point.y, this.r, 0, Math.PI*2);
        target.fill()
        target.closePath();
    }
    
}

class Univers {
    constructor(idCanvas, etoiles) {
        this.WIDTH = window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth;
        this.AL = this.WIDTH/300; //grosse approximation
        let AL = this.AL; //degueulasse

        this.canvas = document.getElementById(idCanvas);
        if(!this.canvas) {
            alert("Can't get canvas");
            return;
        }

        this.canvas.setAttribute("width", 400*AL);
        this.canvas.setAttribute("height", 250*AL); 

        this.center_h = this.canvas.width/2;
        this.center_v = this.canvas.height/2;
        this.angle_a = 0;
        this.angle_b = 0;
        this.angle_c = 0;

        this.fantir = new Etoile("fantir", this.center_h, this.center_v, 0, 1*AL, "#ff0"); 
        this.ref_x = new Point(10*AL, 0, 0);
        this.ref_y = new Point(0, 10*AL, 0);
        this.ref_z = new Point(0, 0, 10*AL);

        //{nom, x, y, z, taille, couleur}
        this.etoiles = new Array();
        for (let i = 0; i < etoiles.length; i++) {
            let current = etoiles[i];
            this.etoiles.push(
                new Etoile(
                current.nom,
                this.fantir.point.x + current.x*AL, 
                this.fantir.point.y + current.y*AL, 
                this.fantir.point.z + current.z*AL,
                current.taille*AL,
                current.couleur
            ));
        }

        this.context = this.canvas.getContext('2d');
        if(!this.context) {
            alert("Can't get canvas' context");
            return;
        }
    }

    draw() {
        this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = "#888";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        //Guides
        this.context.strokeStyle = "#fff";
        this.context.beginPath()
            this.context.moveTo(this.fantir.point.x, 0);
            this.context.lineTo(this.fantir.point.x, this.canvas.height);
            this.context.moveTo(0, this.fantir.point.y);
            this.context.lineTo(this.canvas.width, this.fantir.point.y);
            this.context.stroke();
        this.context.closePath();

        //Perimetres
        this.context.strokeStyle = "#fff";
        this.context.beginPath();
            this.context.arc(this.fantir.point.x, this.fantir.point.y, 25*this.AL, 0, Math.PI*2);
            this.context.arc(this.fantir.point.x, this.fantir.point.y, 100*this.AL, 0, Math.PI*2);
            this.context.stroke();
        this.context.closePath();

        this.fantir.draw(this.context);

        for (let i = 0; i < this.etoiles.length; i++) {
            this.etoiles[i].draw(this.context);
        }

    }

    rotate3D(angle_a, angle_b, angle_c) {
        for (let i = 0; i < this.etoiles.length; i++) {
            this.etoiles[i].point.rotate3D(angle_a, angle_b, angle_c, this.fantir.point);
        }

        this.ref_x.rotate3D(angle_a, angle_b, angle_c, this.fantir.point);
        this.ref_y.rotate3D(angle_a, angle_b, angle_c, this.fantir.point);
        this.ref_z.rotate3D(angle_a, angle_b, angle_c, this.fantir.point);

        this.angle_a = this.angle_a + angle_a;
        this.angle_b = this.angle_b + angle_b;
        this.angle_c = this.angle_c + angle_c;
    }

    set_angles(angle_a, angle_b, angle_c) {
        this.reset();
        this.rotate3D(angle_a, angle_b, angle_c);
    }

    reset() {
        for (let i = 0; i < this.etoiles.length; i++) {
            this.etoiles[i].point.reset();
        }

        this.angle_a = 0;
        this.angle_b = 0;
        this.angle_c = 0;
    }
}

window.onload = function() {

    let etoiles = [
        {nom: "sol", x: 15, y: -46.7, z: 35, taille: 1, couleur: "#f00"},
        {nom: "alt", x: 41.7, y: -21.3, z: -1, taille: 1, couleur: "#f00"},
        {nom: "avadi_arag", x: -30, y: 25, z: -30, taille: 1, couleur: "#00f"},
        {nom: "presidium", x: -61, y: 40, z: -60, taille: 1, couleur: "#000"},
        {nom: "cchzlatzsstrill", x: -23.4, y: 16.7, z: -2, taille: 1, couleur: "#f50"}
    ];

    let sphere = new Univers("map", etoiles);
    sphere.draw();

    let around_z = 0,
        around_y = 0,
        around_x = 0,
        range_x = document.getElementById("range_x"),
        range_y = document.getElementById("range_y"),
        range_z = document.getElementById("range_z");

    range_z.onmousedown = function() {
        let set_rotation_around_z = function() {
            window.requestAnimationFrame(function() {
                around_z = parseFloat(range_z.value);
                sphere.set_angles(around_z, around_y, around_x);
                sphere.draw();
            });
        }

        set_rotation_around_z();
        range_z.addEventListener("mousemove", set_rotation_around_z);

        range_z.onmouseup = function(){
            range_z.removeEventListener("mousemove", set_rotation_around_z);
        }
    }

    range_y.onmousedown = function() {
        let set_rotation_around_y = function() {
            window.requestAnimationFrame(function() {
                around_y = parseFloat(range_y.value);
                sphere.set_angles(around_z, around_y, around_x);
                sphere.draw();
            });
        }

        set_rotation_around_y();
        range_y.addEventListener("mousemove", set_rotation_around_y);

        range_y.onmouseup = function(){
            range_y.removeEventListener("mousemove", set_rotation_around_y);
        }
    }

    range_x.onmousedown = function() {
        let set_rotation_around_x = function() {
            window.requestAnimationFrame(function() {
                around_x = parseFloat(range_x.value);
                sphere.set_angles(around_z, around_y, around_x);
                sphere.draw();
            });
        }

        set_rotation_around_x();
        range_x.addEventListener("mousemove", set_rotation_around_x);

        range_x.onmouseup = function(){
            range_x.removeEventListener("mousemove", set_rotation_around_x);
        }
    }

    let interval = setInterval(animate, 1000/60);
    function animate() {
        sphere.rotate3D(1.5,1.5,1.5);
        sphere.draw();
    }
    document.getElementById("reset").addEventListener("click", function(){
        sphere.reset();
        around_z = 0;
        around_y = 0;
        around_x = 0;
        range_x.value = "0";
        range_y.value = "0";
        range_z.value = "0";
        sphere.draw();
    }); 

}

function scale_between(unscaledNum, minAllowed, maxAllowed, min, max) {
  return (maxAllowed - minAllowed) * (unscaledNum - min) / (max - min) + minAllowed;
} 