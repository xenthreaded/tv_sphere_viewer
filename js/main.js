window.onload = function() {

    let map = document.getElementById("map"),
        container = document.getElementById("elements"),
        path_button = document.getElementById("set_path"),
        direction_ids = ["up","down","left","right"];

    // BLOCK TO CHANGE IF YOU DON'T USE A SERVER -----------
    let sphere = new Object;
    let init_stars = function(data) {
        sphere = new Universe(data);
    }
    request(init_stars, "./js/planets.json");
    //------------------------------------------------------


    for (let i = 0; i < direction_ids.length; i++) {
        document.getElementById(direction_ids[i]).onclick = function() {
            switch(i) {
                case 0:
                    sphere.rotate3D(0,0,-5);
                    break;
                case 1:
                    sphere.rotate3D(0,0,5);
                    break;
                case 2:
                    sphere.rotate3D(0,5,0);
                    break;
                case 3:
                    sphere.rotate3D(0,-5,0);
                    break;
            }
            sphere.update();
        }
    }
    
    document.getElementById("reset").addEventListener("click", function(){
        sphere.reset();
    }); 

}

function scale_between(unscaledNum, minAllowed, maxAllowed, min, max) {
  return (maxAllowed - minAllowed) * (unscaledNum - min) / (max - min) + minAllowed;
}

function getXMLHttpRequest() {
    var xhr = null;

    if (window.XMLHttpRequest || window.ActiveXObject) {
        if (window.ActiveXObject) {
            try {
                xhr = new ActiveXObject("Msxml2.XMLHTTP");
            } catch(e) {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }
        } else {
            xhr = new XMLHttpRequest();
        }
    } else {
        alert("Votre navigateur ne supporte pas l'objet XMLHTTPRequest...");
        return null;
    }
    return xhr;
}

function request(callback, url) {
    http = getXMLHttpRequest();

    http.onreadystatechange = function() {
        if(http.readyState === 4 && http.status === 200) {
            callback(JSON.parse(http.responseText));
        }
    }
    http.open("GET", url);
    http.send(null); 
}
