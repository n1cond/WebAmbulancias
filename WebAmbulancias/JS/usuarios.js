const $$ClassUser = function () { //Métodos para hacer ABMC de usuarios y login

    //FUNCIONES
    this.listUsers = function () {
        //Crea una lista de usuarios
        Load();
        $tablas.listaUsuarios(Users);
        Clear();
    };

    this.makeRoles = function (user) {
        for (let i = 0; i < user.Roles.length; i++) {
            user.Roles[i] = Roles[user.Roles[i]];
        }
    }
    
};
const $cu = new $$ClassUser();

//MÉTODOS USADOS POR CIERTOS ROLES DE USUARIO
const $$UserFunctions = function () {

    //Administrador
    this.makeLogin = function () {
        let arrUsuarios;
        let divMain = $dc.div(Section);
        $datos.request("VerUsuariosSinLogin" +
            "&documentoIdentidad=" + JSON.stringify(MainUser.DocumentoIdentidad),
            (res) => {
                if (res == null) return;
                arrUsuarios = JSON.parse(res);
                if (arrUsuarios.length == 0) {
                    $dc.p(divMain, "No hay usuarios sin dar de alta.");
                    return;
                }
                for (let i = 0; i < arrUsuarios.length; i++) {
                    let divUsu = Usuario(divMain, arrUsuarios[i]);
                    $dc.button(divUsu, "Alta", () => {
                        $uf.formValidarUsuario(arrUsuarios[i]);
                    });
                }
            });
    }

    this.modifyUserByDni = function () {
        $uf.modifyUserByDni();
    };

    this.modifyUserByMail = function () {
        $uf.modifyUserByMail();
    };

    //Afiliado
    this.solicitarAmbulancia = () => {
        ClearSection();
        $datos.request("ObtenerSolicitudActiva" +
            "&documentoIdentidad=" + JSON.stringify(MainUser.DocumentoIdentidad),
            (res) => {
                if (res == null) {
                    $uf.solicitudNueva();
                    return;
                }
                let sol = JSON.parse(res);
                if (sol.CreadorID != undefined) {
                    $uFunctions.MostrarSolicitudActiva(sol);
                }
            })
    }

    this.MostrarSolicitudActiva = (sol) => {
        ClearSection();
        let div = new Solicitud(Section, sol);
        $dc.button(div, "Cancelar", () => { $uFunctions.cancelarSolicitud(sol); });
    }
    this.cancelarSolicitud = function (sol) {
        let data = JSON.stringify(sol);
        let doc = JSON.stringify(MainUser.DocumentoIdentidad);
        $datos.request("CancelarSolicitud" +
            "&data=" + data +
            "&documentoIdentidad=" + doc, (res) => { alert(res) });
    }

    //Recepcionista
    this.verSolicitudesPendientes = function () {
        ClearSection();
        let divSolicitudes = $dc.div(Section);
        divSolicitudes.className = "divSolicitudes";
        $datos.request("ObtenerSolicitudesPendientes&documentoIdentidad=" +
            JSON.stringify(MainUser.DocumentoIdentidad),
            (res) => {
                if (res != null) {
                    let solArr = JSON.parse(res);
                    if (solArr.length == 0)
                        $dc.p(divSolicitudes, "No hay solicitudes pendientes.")
                    for (let i = 0; i < solArr.length; i++) {
                        let sol = new Solicitud(divSolicitudes, solArr[i]);
                        sol.name = "sol" + i;
                        let formAsignar = $d.ce("form");
                        $d.ac(sol, formAsignar);
                        let divRadio = $dc.div(formAsignar);
                        let rdNormal = $d.ce("input");
                        rdNormal.type = "radio";
                        rdNormal.name = "Asignar";
                        rdNormal.value = "Normal";
                        rdNormal.required = true;
                        let lblNormal = $dc.label(divRadio, "Normal");
                        lblNormal.for = rdNormal;
                        $d.ac(divRadio, rdNormal);
                        let rdPrioridad = $d.ce("input");
                        rdPrioridad.type = "radio";
                        rdPrioridad.name = "Asignar";
                        rdPrioridad.value = "Prioridad";
                        rdPrioridad.required = true;
                        let lblPrioridad = $dc.label(divRadio, "Prioridad");
                        lblPrioridad.for = rdPrioridad;
                        $d.ac(divRadio, rdPrioridad);
                        $dc.inputSubmit(divRadio, "Asignar");
                        formAsignar.onsubmit = async () => {
                            event.preventDefault();
                            let formData = new FormData(formAsignar);
                            formData.append("accion", "AsignarPrioridad");
                            formData.append("CreadorID", solArr[i].CreadorID);
                            formData.append("documentoIdentidad",
                                JSON.stringify(MainUser.DocumentoIdentidad));
                            formData.target = "sol" + i;
                            let xhr = new XMLHttpRequest();
                            xhr.open("POST", "Default.aspx");
                            xhr.onload = () => {
                                if (xhr.readyState = 4 && xhr.status == 200) {
                                    sol.innerHTML = "";
                                    $dc.p(sol, "La solicitud se envió correctamente.");
                                } else {
                                    alert("Error al enviar la solicitud: " +
                                        xhr.responseText);
                                }
                            }
                            try {
                                xhr.send(formData);
                            } catch (e) {
                                alert(e);
                            }
                            return false;
                        };
                    }
                }
            });
    }

    //Mecanico
    this.altaAmbulancia = () => {
        ClearSection();
        let fAltaAmbulancia = $df.form("Alta ambulancia", "Crear", "cAltaAmbulancia");
        let cAltaAmbulancia = $d.id("cAltaAmbulancia");
        let modelo = $dc.inputText(cAltaAmbulancia, "Modelo");
        modelo.name = "modelo";
        let patente = $dc.inputText(cAltaAmbulancia, "Patente");
        patente.name = "patente";
        let kilometraje = $dc.inputNumber(cAltaAmbulancia, "Kilometraje");
        kilometraje.name = "kilometraje";
        let descripcion = $d.ce("textarea");
        $d.ac(cAltaAmbulancia, descripcion);
        descripcion.name = "descripcion";
        fAltaAmbulancia.onsubmit = () => {
            event.preventDefault();
            let fd = new FormData(fAltaAmbulancia);
            fd.append("accion", "AltaAmbulancia");
            fd.append("documentoIdentidad", JSON.stringify(MainUser.DocumentoIdentidad));
            fd.target = Section;
            let xhr = new XMLHttpRequest();
            xhr.open("POST", "Default.aspx");
            xhr.onload = () => {
                if (xhr.readyState = 4 && xhr.status == 200) {
                    alert("Operación exitosa.");
                    Home();
                } else {
                    alert("Error al dar de alta: " +
                        xhr.responseText);
                }
            }
            try {
                xhr.send(fd);
            } catch (e) {
                alert("No se pudo enviar: " + e);
            }
            return false;
        }
    }

    this.modificarAmbulancia = () => {
        ClearSection();
        let divLista = $dc.div(Section);
        divLista.className = "divLista";
        let arrAmb;
        $datos.request("VerAmbulancias&documentoIdentidad=" +
            JSON.stringify(MainUser.DocumentoIdentidad), (res) => {
                if (res == null) {
                    $dc.p(divLista,
                        "Error al cargar ambulancias. Vuelva a intentarlo más tarde.");
                    return;
                }
                arrAmb = JSON.parse(res);
                if (arrAmb.length == 0) {
                    $dc.p(divLista, "No hay ambulancias.");
                    $dc.button(divLista, "Alta ambulancia", $uFunctions.altaAmbulancia);
                }
                for (let i = 0; i < arrAmb.length; i++) {
                    let amb = Ambulancia(divLista, arrAmb[i]);
                    amb.id = "amb" + i;
                    let btn = $dc.button(amb, "Modificar",
                        () => {
                            if (AmbulanciaEstados[arrAmb[i].Estado] == "Ocupada") {
                                $d.rc(amb, btn);
                                $dc.p(amb, "La ambulancia está ocupada, no se puede modificar ahora.");
                                return false;
                            }
                            $uf.modificarAmbulancia(arrAmb[i]);
                            return false;
                        });
                }
            })
    }

    this.bajaAmbulancia = () => {
        ClearSection();

    }

    //Despachante
    this.atenderSolicitudes = function () {
        ClearSection();
        let divSolicitudes = $dc.form(Section);
        divSolicitudes.id = "fEnviarSolicitudes";
        divSolicitudes.className = "container";
        $datos.request("SiguienteSolicitud&documentoIdentidad=" +
            JSON.stringify(MainUser.DocumentoIdentidad), (res) => {
                if (res == null) {
                    $dc.p(divSolicitudes, "No hay solicitudes nuevas.");
                    return;
                }
                let sol = JSON.parse(res);
                let solicitud = $dc.inputHidden(divSolicitudes);
                solicitud.name = "solicitud";
                solicitud.value = res;
                let divSol = Solicitud(divSolicitudes, sol);
                let btnAtender = $dc.button(divSol, "Atender", () => {
                    $d.rc(divSol, btnAtender);
                    $dc.p(divSolicitudes, "Seleccione ambulancia: ")
                    $datos.request("VerAmbulancias&documentoIdentidad=" +
                        JSON.stringify(MainUser.DocumentoIdentidad),
                        (res) => { HandleAmbulancias(divSolicitudes, res) });
                })
            })
    }

    //Paramedico
    this.finalizarAsistencia = function () {
        ClearSection();
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "Default.aspx");
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.onload = () => {
            if (xhr.status == 200) {
                $uf.formFinalizarAsistencia(JSON.parse(xhr.responseText));
                return;
            }
            if (xhr.status == 201) {
                $dc.p(Section, "El usuario no tiene asistencias activas.");
                return;
            }
            alert("Error " + xhr.status + ": " + xhr.response);
        };
        xhr.onerror = () => {
            alert("Error al solicitar asistencia activa.");
        }
        xhr.send("accion=VerAsistenciaActiva&documentoIdentidad=" +
            JSON.stringify(MainUser.DocumentoIdentidad));
    }
}
const $uFunctions = new $$UserFunctions();

const Solicitud = function (parent, sol) {
    let div = $dc.div(parent);
    div.className = "divSolicitud";
    let tipo = $dc.h1(div, SolicitudTipos[sol.Tipo]);
    tipo.className = "tipo";
    let descripcion = $dc.p(div, sol.Descripcion);
    descripcion.className = "descripcion";
    let direccion = $dc.p(div, sol.Direccion);
    direccion.className = "direccion";
    let estado = $dc.h2(div, SolicitudEstados[sol.Estado]);
    estado.className = "estado";
    return div;
}

const Usuario = function (parent, usu) {
    let divUsu = $dc.form(parent);
    divUsu.className = "divLista";
    $dc.p(divUsu, usu.Nombre + " " + usu.Apellido);
    $dc.p(divUsu, DocumentoTipos[usu.DocumentoIdentidad.Tipo] + " " +
        usu.DocumentoIdentidad.Numero);
    $dc.p(divUsu, usu.Mail.Valor);
    return divUsu;
}

const HandleAmbulancias = function (parent, res) {
    let arrAmbulancias;
    if (res == null) {
        $dc.p(parent, "No se pueden cargar las ambulancias");
        return;
    }
    arrAmbulancias = JSON.parse(res);
    if (arrAmbulancias.length == 0) {
        $dc.p(parent, "No hay ambulancias disponibles.");
        return;
    }
    let divAmbulancias = $dc.div(parent);
    let ambulancia = $dc.inputHidden(parent);
    ambulancia.name = "ambulancia";
    for (let i = 0; i < arrAmbulancias.length; i++) {
        let divAmb = $dc.div(divAmbulancias);
        divAmb = Ambulancia(divAmb, arrAmbulancias[i]);
        divAmb.id = "divAmb" + i;
        if (arrAmbulancias[i].Estado == 0) {
            let btnSelect = $dc.button(divAmb, "Seleccionar", () => {
                ambulancia.value = JSON.stringify(arrAmbulancias[i]);
                divAmbulancias.innerHTML = "";
                $d.ac(divAmbulancias, divAmb);
                $d.rc(divAmb, btnSelect);
                $dc.button(divAmb, "Cancelar", $uFunctions.atenderSolicitudes);
                $dc.p(parent, "Seleccione paramédicos: ");
                $datos.request("VerParamedicos&documentoIdentidad=" +
                    JSON.stringify(MainUser.DocumentoIdentidad),
                    async (res) => {
                        let divParamedicos = $dc.div(parent);
                        divParamedicos.className = "divLista";
                        await HandleParamedicos(divParamedicos, res)
                        let btnSubmit = $dc.button(parent, "enviar asistencia", () => {
                            event.preventDefault();
                            fd = new FormData(parent);
                            fd.append("accion", "AtenderSolicitud");
                            fd.append("documentoIdentidad",
                                JSON.stringify(MainUser.DocumentoIdentidad));
                            let xhr = new XMLHttpRequest();
                            xhr.open("POST", "Default.aspx");
                            xhr.onerror = () => { alert("ups"); }
                            xhr.onload = () => {
                                if (xhr.status != 200)
                                    alert(xhr.response);
                                else {
                                    alert("Asistencia enviada");
                                    ClearSection();
                                }
                            }
                            xhr.send(fd);
                        });
                    });
            });
        }
    }
}

const Ambulancia = function (parent, amb) {
    let divAmb = $dc.form(parent);
    divAmb.className = "divLista";
    $dc.p(divAmb, amb.Modelo);
    $dc.p(divAmb, amb.PatenteAmbulancia.Valor);
    $dc.p(divAmb, "Estado: " + AmbulanciaEstados[amb.Estado]);
    return divAmb;
}

const HandleParamedicos = (parent, res) => {
        if (res != null) {
            let arrParamedicos = JSON.parse(res);
            for (let i = 0; i < arrParamedicos.length; i++) {
                let estado;
                $datos.request("VerEstadoParamedico&documentoIdentidad=" +
                    JSON.stringify(MainUser.DocumentoIdentidad) +
                    "&documentoParamedico=" +
                    JSON.stringify(arrParamedicos[i].DocumentoIdentidad),
                (res) => {
                    if (res == null) {
                        estado = "ERROR";
                        return;
                    }
                    estado = res;
                    let divPar = Paramedico(parent, arrParamedicos[i], estado);
                    divPar.id = "divPar" + i;
                });
            }
        }
    return false;
}

const Paramedico = function (parent, par, estado) {
    let divPar = $dc.div(parent);
    divPar.className = "divLista";
    let chkbox = document.createElement("input");
    chkbox.type = "checkbox";
    chkbox.name = "equipo";
    chkbox.value = JSON.stringify(par);
    $d.ac(parent, chkbox);
    $dc.p(divPar, `${par.Nombre} ${par.Apellido}`);
    $dc.p(divPar, `${DocumentoTipos[par.DocumentoIdentidad.Tipo]} ${par.DocumentoIdentidad.Numero}`);
    $dc.p(divPar, "Estado: " + estado);
    if (estado != "Libre") chkbox.disabled = true;
    return divPar;
}


