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

    /*
    let interval = setInterval(animate, 1000/60);
    function animate() {
        sphere.rotate2D(2);
        sphere.draw();
    }
    */
}
