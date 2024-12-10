//$dc.form VA CON:
    //TITULO DEL HEADER
    //ETIQUETA DE BOTÓN SUBMIT
    //ID DEL CUERPO DEL FORM

const $$UserForms = function () {
    //Siempre borrar contenido de Section en primera línea
    this.formAddUser = function () {
        let newUser = DEFAULTUSER;
        AddModifyUser(true, newUser, $navegacion.abmLista); //El true me dice que debo agregar
    };

    this.formModifyUser = function (user, next) {
        AddModifyUser(false, user, next);
    };

    const AddModifyUser = function (esAdd, user, next) {
        //esAdd es booleano, si es true hago AddUser, si es false hago ModifyUser
        //Para addUser el título es "Crear usuario", para modifyUser es "Modificar usuario + user.Nombre"
        //Hay que incluir dos tipos de onSubmit y colocar uno u otro según el caso
        let fonSubmit, formTitle, submitTag;
        if (esAdd) {
            fonSubmit = $cu.add;
            formTitle = "Crear usuario";
            submitTag = "crear usuario";
        }
        else {
            fonSubmit = $cu.modify;
            formTitle = "Modificar usuario " + user.Nombre;
            submitTag = "Modificar usuario";

            //Cargar roles de user
            user.Roles = JSON.parse($a.consulta("accion=CARGARROLESUSUARIO&ID=" + user.ID));
        }
        if (next === undefined) {
            next = Home;
        }
        //Siempre borrar contenido de Section en primera línea
        ClearSection();

        ////////////////////////////////////////////////////////////
        // FUNCIONES
        ////////////////////////////////////////////////////////////

        //Dar valores iniciales a los inputs
        const CargarControles = function () {
            nombre.value = user.Nombre;
            dni.value = user.Dni;
            fNac.value = user.FechaNac;
            direccion.value = user.Direccion;
            telefono.value = user.Telefono;
            mail.value = user.Mail;
            MakeRoles();
        };

        //Para crear las listas de opciones de cada select
        const MakeRoles = function () {
            //Array auxiliar de roles para obtener la lista ordenada
            let arrayRolesAux = [];
            //Busca un rol en user.Roles
            const RolExists = function (ROL) {
                for (let j = 0; j < user.Roles.length; j++) {
                    if (user.Roles[j] === ROL) return true;
                }
                return false;
            };
            selectRol.innerHTML = "";
            rolesSeleccionados.innerHTML = "";
            //Según si está o no el rol de ROLES en USER, los pone en un select o el otro
            for (let i = 0; i < ROLES.length; i++) {
                if (!RolExists(ROLES[i])) { $dc.addOption(selectRol, ROLES[i], ROLES[i]); }
                else {
                    $dc.addOption(rolesSeleccionados, ROLES[i], ROLES[i]);
                    arrayRolesAux.push(ROLES[i]);
                }
            };
            rolesValidity();
            //Le asigno a user los roles ordenados
            user.Roles = arrayRolesAux;
        };

        //Actualizar los select según los inputs del usuario
        const AgregarRol = function () {
            user.Roles.push(selectRol.value);
            MakeRoles();
            return false;
        };

        const BorrarRol = function () {
            let r = rolesSeleccionados.value;
            //Al usuario con ID 1 no se le puede borrar el rol de administrador
            if (r === "ADMINISTRADOR" && user.ID + "" === "1") {
                alert("No se puede eliminar el rol de administrador a este usuario.")
                return;
            }
            let aux = new Array();
            for (var i = 0; i < user.Roles.length; i++) {
                if (user.Roles[i] !== r) aux.push(user.Roles[i]);
            };
            user.Roles = aux;
            MakeRoles();
            return false;
        };

        //Hacer obligatorio el rolesSeleccionados
        const rolesValidity = function () {
            if (rolesSeleccionados.childNodes.length === 0) {
                rolesSeleccionados.setCustomValidity("Debe seleccionar al menos un rol."); return;
            }
            rolesSeleccionados.setCustomValidity("");
        }

        /////////////////////////////////////
        // Creación y formato
        /////////////////////////////////////

        let form = $df.form(formTitle, submitTag, "cUsuario");
        let cUsuario = $d.id("cUsuario"); //Capturar cuerpo del form para agregar controles
        //cUsuario.style.height = "20rem"; //2rem por control
        form.style.width = "75%";

        /////////////////////////////////////
        // Contenido del form
        /////////////////////////////////////

        let nombre = $dc.inputText(cUsuario, "Nombre");
        let mail = $dc.inputMail(cUsuario, "Mail");
        let dni = $dc.inputNumber(cUsuario, "Dni");
        let fNac = $dc.inputDate(cUsuario, "Fecha nacimiento");
        let direccion = $dc.inputText(cUsuario, "Dirección");
        let telefono = $dc.inputNumber(cUsuario, "Teléfono");
        let selectRol = $dc.select(cUsuario, "Roles posibles");
        let rolesSeleccionados = $dc.select(cUsuario, "Roles");
        rolesSeleccionados.onchange = rolesValidity;
        let double = $dc.doubleButton(cUsuario, "agregar rol", "quitar rol", AgregarRol, BorrarRol);

        //Si modifico, bloqueo mail y DNI
        //Además, el botón CANCELAR me envía al next
        if (!esAdd) {
            dni.disabled = true;
            mail.disabled = true;

            //forn.Footer.divFooter(derecho).btnReset
            form.childNodes[2].childNodes[1].childNodes[0].onclick = next;
        }
        
        CargarControles();

        form.onsubmit = function () {
            try {
                user.Nombre = nombre.value;
                user.Dni = dni.value;
                user.Mail = mail.value;
                user.FechaNac = fNac.value;
                user.Direccion = direccion.value;
                user.Telefono = telefono.value;

                fonSubmit(user);
                if (next !== undefined) next();
            } catch (e) {
                alert("Error: " + e);
                return false;
            }
        };
    };

    this.formSignup = function () {
        ClearSection();
        let fSignup = $df.form("Registrarse", "Registrar", "cSignup");
        let cSignup = $d.id("cSignup");
        let docTipo = $dc.select(cSignup, "Tipo documento");
        docTipo.name = "docTipo";
        for (let i = 0; i < DocumentoTipos.length; i++) {
            $dc.addOption(docTipo, DocumentoTipos[i]);
        }
        let docNum = $dc.inputNumber(cSignup, "Numero documento");
        docNum.name = "docNum";
        let nombre = $dc.inputText(cSignup, "Nombre");
        nombre.name = "nombre";
        let apellido = $dc.inputText(cSignup, "Apellido");
        apellido.name = "apellido";
        let fechaNacimiento = $dc.inputDate(cSignup, "fecha de nacimiento");

        fechaNacimiento.name = "fechaNacimiento";
        let mail = $dc.inputMail(cSignup, "mail");
        mail.name = "mail";
        let direccion = $dc.inputText(cSignup, "direccion");
        direccion.name = "direccion";
        let accion = $dc.inputHidden(cSignup);
        accion.name = "accion";
        accion.value = "AgregarUsuario";
        fSignup.onsubmit = () => {
            event.preventDefault();
            let fd = new FormData(fSignup);
            let xhr = new XMLHttpRequest();
            xhr.open("POST", "Default.aspx");
            xhr.onload = () => {
                if (xhr.readyState = 4 && xhr.status == 200) {
                    ClearSection();
                    $dc.p(Section, xhr.responseText);
                } else {
                    alert(xhr.responseText);
                }
            }
            xhr.send(fd);
        }
    }

    this.formValidarUsuario = function (usuario) {
        ClearSection();
        let fValidar = $df.form("Validar usuario", "Validar", "cValidar");
        let cValidar = $d.id("cValidar");
        let docTipo = $dc.select(cValidar, "Tipo documento");
        docTipo.name = "docTipo";
        for (let i = 0; i < DocumentoTipos.length; i++) {
            $dc.addOption(docTipo, DocumentoTipos[i]);
        }
        docTipo.value = DocumentoTipos[usuario.DocumentoIdentidad.Tipo];
        let docNum = $dc.inputNumber(cValidar, "Numero documento");
        docNum.name = "docNum";
        docNum.value = usuario.DocumentoIdentidad.Numero;
        let nombre = $dc.inputText(cValidar, "Nombre");
        nombre.name = "nombre";
        nombre.value = usuario.Nombre;
        let apellido = $dc.inputText(cValidar, "Apellido");
        apellido.name = "apellido";
        apellido.value = usuario.Apellido;
        let fechaNacimiento = $dc.inputDate(cValidar, "fecha de nacimiento");
        fechaNacimiento.name = "fechaNacimiento";
        fechaNacimiento.value = usuario.FechaNacimiento.substring(0, 10);
        let mail = $dc.inputMail(cValidar, "mail");
        mail.name = "mail";
        mail.value = usuario.Mail.Valor;
        let direccion = $dc.inputText(cValidar, "direccion");
        direccion.name = "direccion";
        direccion.value = usuario.Direccion;
        let fs = $d.ce("fieldset");
        $d.ac(cValidar, fs);
        let leg = $d.ce("legend");
        leg.innerText = "Roles";
        $d.ac(fs, leg);
        for (let i = 1; i < Roles.length; i++) {
            let chk = $d.ce("input");
            chk.type = "checkbox";
            chk.name = "roles";
            chk.value = Roles[i];
            chk.id = "roles" + i;
            $d.ac(fs, chk);
            let lbl = $dc.label(fs, Roles[i]);
            lbl.for = chk;
            if (i == 1) {
                chk.checked = true;
                chk.readonly = true;
            }
        }
        let documentoIdentidad = $dc.inputHidden(cValidar);
        documentoIdentidad.value = JSON.stringify(MainUser.DocumentoIdentidad);
        documentoIdentidad.name = "documentoIdentidad";
        let accion = $dc.inputHidden(cValidar);
        accion.name = "accion";
        accion.value = "ValidarUsuario";
        fValidar.onsubmit = () => {
            event.preventDefault();
            let fd = new FormData(fValidar);
            const next = (xhr) => {
                if (xhr.status === 200) {
                    ClearSection();
                    $dc.p(Section, xhr.responseText);
                    $uFunctions.makeLogin();
                }
            }
            $datos.postFormData(fd, next);
        }
    }

    this.formBuscarUsuario = function (next) {
        ClearSection();
        let fBuscarUsuario = $df.form("Buscar Usuario", "Buscar", "cBuscarUsuario");
        let cBuscarUsuario = $d.id("cBuscarUsuario");
        let selectTipo = $dc.select(cBuscarUsuario, "Tipo documento");
        for (let i = 0; i < DocumentoTipos.length; i++) {
            $dc.addOption(selectTipo, DocumentoTipos[i]);
        }
        selectTipo.name = "docTipo";
        let numero = $dc.inputNumber(cBuscarUsuario, "Número documento");
        numero.name = "docNum";
        let accion = $dc.inputHidden(fBuscarUsuario);
        accion.name = "accion";
        accion.value = "BuscarUsuario";
        fBuscarUsuario.onsubmit = () => {
            event.preventDefault();
            let fd = new FormData(fBuscarUsuario);
            let xhr = new XMLHttpRequest();
            xhr.open("POST", "Default.aspx");
            xhr.onload = () => {
                if (xhr.readyState = 4 && xhr.status == 200) {
                    next(JSON.parse(xhr.responseText));
                } else {
                    alert(xhr.responseText);
                }
            }
            xhr.send(fd);
        }
    }

    this.formRol = function (usuario, title, textSubmit, fSelect, accionValue, textResult) {
        ClearSection();
        Usuario(Section, usuario);
        let fRol = $df.form(title, textSubmit, "cRol");
        let cRol = $d.id("cRol");
        let selectRol = $dc.select(cRol, "Rol");
        fSelect(selectRol, usuario);
        selectRol.name = "rol";
        let accion = $dc.inputHidden(cRol);
        accion.name = "accion";
        accion.value = accionValue;
        let docUsuario = $dc.inputHidden(cRol);
        docUsuario.name = "docUsuario";
        docUsuario.value = JSON.stringify(usuario.DocumentoIdentidad);
        let docResponsable = $dc.inputHidden(cRol);
        docResponsable.name = "documentoIdentidad";
        docResponsable.value = JSON.stringify(MainUser.DocumentoIdentidad);
        fRol.onsubmit = () => {
            event.preventDefault();
            let fd = new FormData(fRol);
            let xhr = new XMLHttpRequest();
            xhr.open("POST", "Default.aspx");
            xhr.onload = () => {
                if (xhr.readyState == 4 & xhr.status == 200) {
                    ClearSection();
                    $dc.p(Section, textResult);
                } else {
                    $dc.p(Section, "Ocurrió un error.");
                }
            }
            xhr.send(fd);
        }
    }

    this.formABRol = (esAlta, usuario) => {
        let title, textSubmit, fSelect, accionValue, textResult;
        if (esAlta) {
            title = "Alta rol";
            textSubmit = "Agregar";
            fSelect = fSelectAlta;
            accionValue = "AltaRolUsuario";
            textResult = "Rol agregado correctamente";
            $uf.formRol(usuario, title, textSubmit, fSelect, accionValue, textResult);
            return;
        }
        title = "Baja rol";
        textSubmit = "Eliminar";
        fSelect = fSelectBaja;
        accionValue = "BajaRolUsuario";
        textResult = "Rol eliminado correctamente";
        $uf.formRol(usuario, title, textSubmit, fSelect, accionValue, textResult);
    }

    const fSelectAlta = (selectRol, usuario) => {
        for (let i = 0; i < Roles.length; i++) {
            if (!usuario.Roles.includes(i))
                $dc.addOption(selectRol, Roles[i]);
        }
    }

    const fSelectBaja = (selectRol, usuario) => {
        for (let i = 0; i < usuario.Roles.length; i++) {
            $dc.addOption(selectRol, Roles[usuario.Roles[i]]);
        }
    }

    this.formLogin = function () {
        ClearSection();
        let form = $df.form("iniciar sesión", "iniciar sesión", "login");
        let login = $d.id("login");
        let docTipo = $dc.select(login, "Tipo");
        for (let i = 0; i < DocumentoTipos.length; i++) {
            $dc.addOption(docTipo, DocumentoTipos[i]);
        }
        let docNum = $dc.inputNumber(login, "Documento");
        let pass = $dc.inputPass(login, "contraseña");

        let divp = $dc.div(login);
        divp.className = "item";
        let olvidoPass = $dc.a(divp, "¿Olvidó su contraseña?", $uf.formRecuperarPass);

        // Función para evento Submit
        const LoginSubmit = function () {
            try {
                let Data = "accion=Login&DocTipo=" + docTipo.value + "&DocNum=" + docNum.value
                    + "&Pass=" + pass.value;
                $datos.post(Data, (xhr) => {
                    if (xhr.readyState == 4 & xhr.status == 200) {
                        MainUser = JSON.parse(xhr.responseText);
                        $cu.makeRoles(MainUser);
                        Rol = MainUser.Roles[0];
                        $n.init();
                        $uf.formLogout();
                    }
                    else {
                        alert(xhr.responseText);
                    }
                });
            } catch (e) {
                alert(e);
            }
            return false;
        };
        form.onsubmit = LoginSubmit;
    };

    this.formLogout = function () {
        ClearSection();
        let form = $df.form(MainUser.Nombre, "Cerrar sesión", "cLogout");
        cLogout.style.height = "4rem";

        let selectRol = $dc.select(cLogout, "Cambiar rol");
        if (MainUser.Roles != undefined) {
            for (i = 0; i < MainUser.Roles.length; i++) {
                $dc.addOption(selectRol, MainUser.Roles[i]);
            }
        }
        selectRol.value = Rol;
        selectRol.onchange = function () {
            Rol = selectRol.value;
            $n.init();
        }
        form.onsubmit = function() {
            MainUser = undefined;
            Rol = undefined;
            Home();
            $n.init();
            return false;
        }
    };

    this.formProfile = function () {

        ClearSection();

        const Fload = function (res) {
            try {
                if (res.startsWith("Error")) throw (res);
                objRes = JSON.parse(res);
                if (MainUser.FotoURL !== objRes.FotoURL) {
                    MainUser.FotoURL = objRes.FotoURL;
                    //$cu.modify(MainUser);
                }
                if (MainUser.FotoURL === "") {
                    MainUser.FotoURL = FotoDefault;
                    //$cu.modify(MainUser);
                }
                $uf.formLogout();
            } catch (e) {
                alert(e);
            }
        };

        const CargarControles = () => {
            nombre.value = MainUser.Nombre;
            fNac.value = MainUser.FechaNac;
            direccion.value = MainUser.Direccion;
            telefono.value = MainUser.Telefono;
        }

        let form = $df.formImg("Perfil", "actualizar", "perfil", Fload);
        let perfil = $d.id("perfil");
        //perfil.style.height = "20rem";
        form.style.width = "75%";

        let divImg = $dc.div(perfil);
        divImg.style.height = "4rem";
        let profImg = $dc.img(divImg, MainUser.FotoURL);
        profImg.className = "profImg";

        let nombre = $dc.inputText(perfil, "Nombre");
        let fNac = $dc.inputDate(perfil, "Fecha nacimiento");
        let direccion = $dc.inputText(perfil, "Dirección");
        let telefono = $dc.inputNumber(perfil, "Teléfono");
        let imagen = $dc.inputImg(perfil, "Cambiar foto", "foto");
        imagen.required = false;
        let pass = $dc.passConfirm(perfil);

        nombre.name = "Nombre";
        fNac.name = "FechaNac";
        direccion.name = "Direccion";
        telefono.name = "Telefono";
        pass[0].name = "Password";

        CargarControles();

        //El botón CANCELAR debe cargar los valores originales del usuario
        //Para que no sea un reset lo creo de vuelta como botón simple
        //form.childNodes[2].childNodes[1].childNodes[0].remove();
        //btnCancel = $dc.button(form.childNodes[2], "CANCELAR", () => { event.preventDefault(); CargarControles(); });
        let btnCancel = form.childNodes[2].childNodes[1].childNodes[0];
        //btnCancel.className = "Reset right";
        btnCancel.onclick = () => { event.preventDefault(); CargarControles(); }

        form.onsubmit = function () {
            try {
                accion.value = "MODIFICARUSUARIO";
                ID.value = MainUser.ID;
                MainUser.Nombre = nombre.value;
                MainUser.FechaNac = fNac.value;
                MainUser.Direccion = direccion.value;
                MainUser.Telefono = telefono.value;
                if (pass[1].value !== "") MainUser.Password = pass[1].value;
            } catch (e) {
                alert(e);
            }
        };
    };

    this.formRecuperarPass = function () {
        ClearSection();

        let form = $df.form("recuperar contraseña", "enviar", "fRecuperar");
        let fRecuperar = $d.id("fRecuperar");
        fRecuperar.style.height = "10rem";
        form.style.width = "75%";
        let divp = $dc.div(fRecuperar);
        let mensaje = $dc.p(divp, "A continuación ingrese usuario y DNI:");
        let usuario = $dc.inputMail(fRecuperar, "E-Mail");
        let dni = $dc.inputNumber(fRecuperar, "dni");

        form.onsubmit = function () {
            let user = new Object();
            user.Mail = usuario.value;
            user.Dni = dni.value;
            try {
                encontrado = $cu.findUserByMailAndDni(user);
                encontrado.Password = encontrado.Dni;
                $cu.modify(encontrado);
                alert("Ingresará nuevamente con su contraseña. Luego puede cambiarla en su perfil.");
                $uf.formLogin();
                return false;
            } catch (e) {
                alert(e);
            }
        };
    };

    this.formFindBy = function (type) {
        let inputType;
        switch (type) {
            case "Dni":
            case "DNI":
                inputType = $dc.inputNumber;
                searchFunction = $cu.findUserByDni;
                break;
            case "Mail":
                inputType = $dc.inputMail;
                searchFunction = $cu.findUserByMail;
                break;
        }
        ClearSection();
        let form = $df.form("Buscar usuario por "+type, "Buscar", "fbusca");
        let fbusca = $d.id("fbusca");
        form.style.width = "60%";
        fbusca.style.height = "4rem";

        let input = inputType(fbusca, type);

        form.onsubmit = () => {
            let user;
            try {
                user = searchFunction(input.value);
                $uf.formModifyUser(user);
                return true;
            } catch (e) {
                alert(e);
                return false;
            }
        };
    };

    this.solicitudNueva = () => {
        ClearSection();
        let form = $df.form("Nueva solicitud", "Enviar", "fSolicitud");
        let cForm = form.childNodes[1];
        let tipoSolicitud = $dc.select(cForm, "Tipo de solicitud");
        tipoSolicitud.name = "tipoSolicitud";
        $datos.cargarSelect(tipoSolicitud, "ObtenerSolicitudTipos");
        tipoSolicitud.required = true;
        let direccion = $dc.inputText(cForm, "Dirección");
        direccion.name = "direccion";
        let descripcion = $d.ce("textarea");
        descripcion.name = "descripcion";
        descripcion.required = true;
        descripcion.maxlength = 200;
        let lblDescripcion = $dc.label(cForm, "Descripción");
        lblDescripcion.for = descripcion;
        $d.ac(cForm, descripcion);

        form.onsubmit = () => {
            event.preventDefault();
            let fd = new FormData(form);
            fd.append("accion", "NuevaSolicitud");
            fd.append("tipoDoc", MainUser.DocumentoIdentidad.Tipo);
            fd.append("numDoc", MainUser.DocumentoIdentidad.Numero);
            let xhr = new XMLHttpRequest();
            xhr.open("POST", "Default.aspx");
            xhr.onload = () => {
                if (xhr.readyState = 4 && xhr.status == 200) {
                    alert("La solicitud se envió correctamente.");
                    Home();
                } else {
                    alert("Error al enviar la solicitud: " +
                        xhr.responseText);
                }
            }
            try {
                xhr.send(fd);
            } catch (e) {
                alert(e);
            }
        }
    }

    this.modificarAmbulancia = (amb) => {
        ClearSection();
        let fModAmbulancia = $df.form("Modificar Ambulancia", "Modificar", "cModAmbulancia");
        let cModAmbulancia = $d.id("cModAmbulancia");
        $dc.p(cModAmbulancia, "Patente: " + amb.PatenteAmbulancia.Valor);
        $dc.p(cModAmbulancia, "Modelo: " + amb.Modelo);
        let estado = $dc.select(cModAmbulancia, "Estado");
        for (let i = 0; i < AmbulanciaEstados.length; i++) {
            if (i === 1) continue;
            $dc.addOption(estado, AmbulanciaEstados[i]);
        }
        estado.name = "estado";
        estado.value = AmbulanciaEstados[amb.Estado];
        let kilometraje = $dc.inputNumber(cModAmbulancia, "Kilometraje");
        kilometraje.name = "kilometraje";
        kilometraje.value = amb.Kilometraje;
        let descripcion = $d.ce("textarea");
        descripcion.name = "descripcion";
        descripcion.value = amb.Descripcion;
        $d.ac(cModAmbulancia, descripcion);
        fModAmbulancia.onsubmit = () => {
            event.preventDefault();
            let fd = new FormData(fModAmbulancia);
            fd.append("accion", "ModificarAmbulancia");
            fd.append("documentoIdentidad", JSON.stringify(MainUser.DocumentoIdentidad));
            fd.append("data", JSON.stringify(amb));
            $datos.postFormData(fd, () => {
                ClearSection();
                $dc.p(Section, "La ambulancia se modificó exitosamente.");
            }, "Error al modificar ambulancia: ");
        }
    }

    this.formFinalizarAsistencia = (solicitud) => {
        ClearSection();
        Solicitud(Section, solicitud);
        $dc.p(Section, "");
        let form = $df.form("Finalizar asistencia", "Finalizar", "cForm");
        let cForm = $d.id("cForm");
        let informe = $d.ce("textarea");
        informe.required = true;
        informe.minlength = 30;
        informe.maxlength = 1000;
        informe.name = "informe";
        let lblInforme = $dc.label(cForm, "Informe de finalización");
        $d.ac(cForm, informe);
        lblInforme.for = "informe";
        form.onsubmit = () => {
            event.preventDefault();
            let fd = new FormData(form);
            fd.append("documentoIdentidad", JSON.stringify(MainUser.DocumentoIdentidad));
            fd.append("accion", "FinalizarAsistencia");
            fd.append("solicitud", solicitud.CreadorID);
            $datos.postFormData(fd, (xhr) => {
                if (xhr.status != 200) {
                    alert(xhr.responseText);
                    return;
                }
                ClearSection();
                $dc.p(Section, "Asistencia finalizada con éxito");
            }, "Error al finalizar asistencia: ");
        }
    }
};
const $uf = new $$UserForms();

const $$CareerForms = function () {
    this.formAddCareer = function () {
        AddModifyCareer(true, CAREERDEFAULT, $navegacion.abmCarreras);
    };

    this.formModifyCareer = function (career) {
        AddModifyCareer(false, career, $navegacion.abmCarreras);
    };

    const AddModifyCareer = function (esAdd, career, next) {
        const Fload = function (res) {
            try {
                if (res.startsWith("Error")) throw (res);
                next();
            } catch (e) {
                alert(e);
            }
        };

        let title;
        let textSubmit;

        const CargarControles = function () {
            sigla.value = career.Sigla;
            nombre.value = career.Nombre;
            titulo.value = career.Titulo;
            duracion.value = career.Duracion;
            estado.value = career.Estado;
        };

        //let fOnSubmit;
        if (esAdd) {
            title = "Agregar carrera";
            textSubmit = "Agregar";
        }
        else {
            title = "Modificar carrera "+ career.Nombre;
            textSubmit = "Modificar";
        }

        ClearSection();

        let f = $df.formImg(title, textSubmit, "fCareer", Fload);
        let fCareer = $d.id("fCareer");
        //fCareer.style.height = "16rem";
        f.style.width = "80%";

        let sigla = $dc.inputText(fCareer, "Sigla");
        let nombre = $dc.inputText(fCareer, "Nombre");
        let titulo = $dc.inputText(fCareer, "Titulo");
        let duracion = $dc.inputNumber(fCareer, "Duracion");
        let estado = $dc.select(fCareer, "Estado");
        $dc.addOption(estado, "ACTIVO");
        $dc.addOption(estado, "INACTIVO");
        let img = $dc.inputImg(fCareer, "Imagen", "Foto");
        img.required = false;
        let pdf = $dc.inputPdf(fCareer, "Plan de estudios", "PlanEstudios");
        pdf.required = false;

        sigla.name = "Sigla";
        nombre.name = "Nombre";
        titulo.name = "Titulo";
        duracion.name = "Duracion";
        estado.name = "Estado";

        if (esAdd)
        {
            //fOnSubmit = $cf.add;
            accion.value = "AGREGARCARRERA";
        }
        else
        {
            //fOnSubmit = $cf.modify;
            accion.value = "MODIFICARCARRERA";
            ID.value = career.ID;

            CargarControles();
            //forn.Footer.divFooter(derecho).btnReset
            f.childNodes[2].childNodes[1].childNodes[0].onclick = next;

            //Engrosar la barra de título para nombres largos
            //if (career.Nombre.length > 35) f.childNodes[0].style.height = "3rem";
        }

    };

};
const $cf = new $$CareerForms();