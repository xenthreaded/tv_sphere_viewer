//TODO : 
//  clean code (let AL = this.AL !!!)
//  check a solution for rotate3D that doesn't need applying a rotation for each axis

class Etoile {
    constructor(name, x, y, z, r, color) {
        this.name = name;
        this.x = parseFloat(x);
        this.y = parseFloat(y);
        this.z = parseFloat(z);
        this.ox = this.x;
        this.oy = this.y;
        this.oz = this.z;
        this.r = r;
        this.color = color;

    }

    draw(target) {
        target.fillStyle = this.color;
        target.beginPath();
        target.arc(this.x, this.y, this.r, 0, Math.PI*2);
        target.fill()
        target.closePath();
    }
    
    rotate2D(angle, anchor) {
        let radians = (Math.PI / 180) * angle,
            cos = Math.cos(radians),
            sin = Math.sin(radians),
            nx = (cos * (this.x - anchor.x)) + (sin * (this.y - anchor.y)) + anchor.x,
            ny = (cos * (this.y - anchor.y)) - (sin * (this.x - anchor.x)) + anchor.y;

        this.x = nx;
        this.y = ny;
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
            sin_c = Math.sin(radians_c),
            nx = (cos_a * cos_b * 1 * (this.x - anchor.x)) + (-1 * sin_a * (this.y - anchor.y)) + (sin_b * (this.z - anchor.z)) + anchor.x,
            ny = (sin_a * (this.x - anchor.x)) + (cos_a * 1 * cos_c * (this.y - anchor.y)) + (-1 * sin_c * (this.z - anchor.z)) + anchor.y,
            nz = (-1 * sin_b * (this.x - anchor.x)) + (sin_c * (this.y - anchor.y)) + (1 * cos_b * cos_c * (this.z - anchor.z)) + anchor.z;
            //putain d'opérations de matrices

            this.x = nx;
            this.y = ny;
            this.z = nz;
    }

    reset() {
        this.x = this.ox;
        this.y = this.oy;
        this.z = this.oz;
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

        this.fantir = new Etoile("fantir", this.center_h, this.center_v, 0, 1*AL, "#ff0"); 

        //{nom, x, y, z, taille, couleur}
        this.etoiles = new Array();
        for (let i = 0; i < etoiles.length; i++) {
            let current = etoiles[i];
            this.etoiles.push(
                new Etoile(
                current.nom,
                this.fantir.x + current.x*AL, 
                this.fantir.y + current.y*AL, 
                this.fantir.z + current.z*AL,
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

        //Axes
        this.context.strokeStyle = "#fff";
        this.context.beginPath()
            this.context.moveTo(this.fantir.x, 0);
            this.context.lineTo(this.fantir.x, this.canvas.height);
            this.context.moveTo(0, this.fantir.y);
            this.context.lineTo(this.canvas.width, this.fantir.y);
            this.context.stroke();
        this.context.closePath();

        //Perimetres
        this.context.beginPath();
            this.context.arc(this.fantir.x, this.fantir.y, 25*this.AL, 0, Math.PI*2);
            this.context.arc(this.fantir.x, this.fantir.y, 100*this.AL, 0, Math.PI*2);
            this.context.stroke();
        this.context.closePath();

        this.fantir.draw(this.context);

        for (let i = 0; i < this.etoiles.length; i++) {
            this.etoiles[i].draw(this.context);
        }

    }

    rotate2D(angle) {
        for (let i = 0; i < this.etoiles.length; i++) {
            this.etoiles[i].rotate2D(angle, this.fantir);
        }
    }

    rotate3D(angle_a, angle_b, angle_c) {
        for (let i = 0; i < this.etoiles.length; i++) {
            this.etoiles[i].rotate3D(angle_a, 0, 0, this.fantir);
            this.etoiles[i].rotate3D(0, angle_b, 0, this.fantir);
            this.etoiles[i].rotate3D(0, 0, angle_c, this.fantir);
        }
    }

    set_angles(angle_a, angle_b, angle_c) {
        this.reset();
        this.rotate3D(angle_a, angle_b, angle_c);
    }

    reset() {
        for (let i = 0; i < this.etoiles.length; i++) {
            this.etoiles[i].reset();
        }
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

    let ang_x = 0,
        ang_y = 0,
        ang_z = 0,
        range_x = document.getElementById("range_x"),
        range_y = document.getElementById("range_y"),
        range_z = document.getElementById("range_z");

    range_x.onmousedown = function() {
        let set_ang_x = function() {
            window.requestAnimationFrame(function() {
                ang_x = parseFloat(range_x.value);
                sphere.set_angles(ang_x, ang_y, ang_z);
                sphere.draw();
            });
        }

        set_ang_x();
        range_x.addEventListener("mousemove", set_ang_x);

        range_x.onmouseup = function(){
            range_x.removeEventListener("mousemove", set_ang_x);
        }
    }

    range_y.onmousedown = function() {
        let set_ang_y = function() {
            window.requestAnimationFrame(function() {
                ang_y = parseFloat(range_y.value);
                sphere.set_angles(ang_x, ang_y, ang_z);
                sphere.draw();
            });
        }

        set_ang_y();
        range_y.addEventListener("mousemove", set_ang_y);

        range_y.onmouseup = function(){
            range_y.removeEventListener("mousemove", set_ang_y);
        }
    }

    range_z.onmousedown = function() {
        let set_ang_z = function() {
            window.requestAnimationFrame(function() {
                ang_z = parseFloat(range_z.value);
                sphere.set_angles(ang_x, ang_y, ang_z);
                sphere.draw();
            });
        }

        set_ang_z();
        range_z.addEventListener("mousemove", set_ang_z);

        range_z.onmouseup = function(){
            range_z.removeEventListener("mousemove", set_ang_z);
        }
    }

    //let interval = setInterval(animate, 1000/60);
    function animate() {
        sphere.rotate3D(2,2,2);
        sphere.draw();
    }
    document.getElementById("reset").addEventListener("click", function(){
        sphere.reset();
        ang_x = 0;
        ang_y = 0;
        ang_z = 0;
        range_x.value = "0";
        range_y.value = "0";
        range_z.value = "0";
        sphere.draw();
    }); 

}

function scale_between(unscaledNum, minAllowed, maxAllowed, min, max) {
  return (maxAllowed - minAllowed) * (unscaledNum - min) / (max - min) + minAllowed;
} 