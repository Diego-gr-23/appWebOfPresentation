let tiempo = localStorage.getItem("tiempo") ? parseInt(localStorage.getItem("tiempo")) : 4200; //this in seconds
let salidas = localStorage.getItem("salidas") ? parseInt(localStorage.getItem("salidas")) : 0;
let nombre = localStorage.getItem("nombre") || "";
let intervalo;

function comenzar(){

    nombre = document.getElementById("nombre").value;

    localStorage.setItem("nombre", nombre);
    if(nombre === ""){
        alert("Ingresa tu nombre");
        return;
    }

    document.getElementById("inicio").classList.add("hidden");
    document.getElementById("experimento").classList.remove("hidden");
    // document.getElementById("panelDatos").classList.remove("oculto");

    document.getElementById("saludo").innerText = "Hola " + nombre;

    intervalo = setInterval(actualizarTiempo, 1000);
}

function actualizarTiempo(){

    tiempo--;

    localStorage.setItem("tiempo", tiempo);
    let minutos = Math.floor(tiempo / 60);
    let segundos = tiempo % 60;

    if(segundos < 10){
        segundos = "0" + segundos;
    }

    document.getElementById("timer").innerText = minutos + ":" + segundos;

    if(tiempo <= 0){
        clearInterval(intervalo);
        terminar();
    }
}

document.addEventListener("visibilitychange", function(){
    
    if(document.hidden){
        salidas++;
        localStorage.setItem("salidas", salidas)
        document.getElementById("salidas").innerText = salidas;
    }

});

window.addEventListener("beforeunload", function () {
    salidas++;
});

function terminar(){

    guardarResultado();

    document.getElementById("experimento").classList.add("hidden");
    document.getElementById("final").classList.remove("hidden");

    mostrarTabla();
    localStorage.clear();
}

function guardarResultado(){

    fetch("https://script.google.com/macros/s/AKfycbzlutbO8NrEgGiMBbkMm5rl3T-5vi2oHHOYC-jQpcFLyV3XfSVV0zzVRtsJBDIgXg/exec", {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({
            nombre: nombre,
            salidas: salidas
        }),
        headers:{
            "Content-Type":"application/json"
        }
    });

}

function mostrarTabla(){

    let resultados = JSON.parse(localStorage.getItem("resultados")) || [];

    resultados.sort((a,b)=> b.salidas - a.salidas);

    let html = "<table border='1' style='margin:auto'>";
    html += "<tr><th>Nombre</th><th>Distracciones</th></tr>";

    resultados.forEach(r=>{
        html += `<tr>
                    <td>${r.nombre}</td>
                    <td>${r.salidas}</td>
                 </tr>`;
    });

    html += "</table>";

    document.getElementById("resultado").innerHTML = html;
}