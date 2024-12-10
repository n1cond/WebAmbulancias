window.onload = function () {
    const h = new XMLHttpRequest();
    h.open("GET", "/");
    h.send();
    //ROLES
    $datos.request("ObtenerRoles", (res) => {
        Roles = JSON.parse(res);
    });
    //TIPOS SOLICITUD
    $datos.request("ObtenerSolicitudTipos", (res) => {
        SolicitudTipos = JSON.parse(res);
    });
    //ESTADOS SOLICITUD
    $datos.request("ObtenerSolicitudEstados", (res) => {
        SolicitudEstados = JSON.parse(res);
    });
    //ESTADOS AMBULANCIA
    $datos.request("ObtenerAmbulanciaEstados", (res) => {
        AmbulanciaEstados = JSON.parse(res);
    });
    //TIPOS DOCUMENTO
    $datos.request("ObtenerDocumentoTipos", (res) => {
        DocumentoTipos = JSON.parse(res);
        Home();
        $n.init();
    });
    

};


