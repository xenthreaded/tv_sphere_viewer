class Etoile {
    constructor(x, y, z, r, color) {
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

}

window.onload = function() {
    var WIDTH = window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth,
        HEIGHT = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
    var AL = WIDTH/300; //grosse approximation

    var canvas = document.getElementById('map');
    if(!canvas) {
        alert("Impossible de récupérer le canvas");
        return;
    }

    canvas.setAttribute("width", 400*AL);
    canvas.setAttribute("height", 250*AL); 

    var center_h = canvas.width/2;
    var center_v = canvas.height/2;

    var fantir_x = center_h;// 176*AL,
        fantir_y = center_v;//100*AL,
        fantir_z = 0;

    var context = canvas.getContext('2d');
    if(!context) {
        alert("Impossible de récupérer le context du canvas");
        return;
    }
    context.fillStyle = "#888";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.strokeStyle = "#fff";
    context.beginPath()
        context.moveTo(fantir_x, 0);
        context.lineTo(fantir_x, canvas.height);
        context.moveTo(0, fantir_y);
        context.lineTo(canvas.width, fantir_y);
        context.stroke();
    context.closePath();

    context.beginPath();
        context.arc(fantir_x, fantir_y, 25*AL, 0, Math.PI*2);
        context.arc(fantir_x, fantir_y, 100*AL, 0, Math.PI*2);
        context.stroke();
    context.closePath();
    
    let systemes = new Array();
    //rayon du symbole != taille de l'étoile ; juste par souci de responsivité
    let fantir = new Etoile(fantir_x, fantir_y, fantir_z, 1*AL, "#ff0"); 
    systemes.push(fantir);
    let sol = new Etoile(fantir_x+15*AL, fantir_y-46.7*AL, fantir_z+35*AL, 1*AL, "#f00");
    systemes.push(sol);
    let alt = new Etoile(fantir_x+41.7*AL, fantir_y-21.3*AL, fantir_z-1*AL, 1*AL, "#f00");
    systemes.push(alt);
    let cchzlatzsstrill = new Etoile(fantir_x-23.4*AL, fantir_y+16.7*AL, fantir_z-2*AL, 1*AL, "#f50");
    systemes.push(cchzlatzsstrill);
    let avadi_arag = new Etoile(fantir_x-30*AL, fantir_y+25*AL, fantir_z-30*AL, 1*AL, "#00f");
    systemes.push(avadi_arag);
    let presidium = new Etoile(fantir_x-61*AL, fantir_y+40*AL, fantir_z-60*AL, 1*AL, "#000");
    systemes.push(presidium);

    for (let i = 0; i < systemes.length; i++) {
        systemes[i].draw(context);
    }
}

