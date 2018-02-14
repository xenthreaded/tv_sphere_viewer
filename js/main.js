//TODO : clean code (let AL = this.AL !!!)

class Etoile {
    constructor(name, x, y, z, r, color) {
        this.name = name;
        this.x = parseFloat(x);
        this.y = parseFloat(y);
        this.z = parseFloat(z);
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

    rotate3D(angle_a, angle_b, anchor) {
        let radians_a = (Math.PI / 180) * angle_a,
            radians_b = (Math.PI / 180) * angle_b,
            cos_a = Math.cos(radians_a),
            cos_b = Math.cos(radians_b),
            sin_a = Math.sin(radians_a),
            sin_b = Math.sin(radians_b),
            nx = (cos_a * (this.x - anchor.x)) - (sin_a * cos_b * (this.y - anchor.y)) + (sin_a * sin_b * (this.z - anchor.z)) + anchor.x,
            ny = (sin_a * (this.x - anchor.x)) + (cos_a * cos_b * (this.y - anchor.y)) - (cos_a * sin_b * (this.z - anchor.z)) + anchor.y,
            nz = (sin_b * (this.y - anchor.y)) + (cos_b * (this.z - anchor.z)) + anchor.z;
            //putain d'opérations de matrices

            this.x = nx;
            this.y = ny;
            this.z = nz;
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

    rotate3D(angle_a, angle_b) {
        for (let i = 0; i < this.etoiles.length; i++) {
            this.etoiles[i].rotate3D(angle_a, angle_b, this.fantir);
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

    let interval = setInterval(animate, 1000/60);
    function animate() {
        sphere.rotate3D(2,2);
        sphere.draw();
    }
}
