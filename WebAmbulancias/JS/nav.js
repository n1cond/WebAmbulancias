const $$Nav = function () {
    //FUNCIONES
    //Generar links
    const LinksBase = function () {
        Nav.innerHTML = "";
        ul = $dc.ul(Nav);
        divLogin = $dc.div(Nav);
        divLogin.id = "divLogin";
        $dn.button("INICIO", $ba.home);
    };
    const LinksUsers = function () {
        LinksBase();
    };
    const LinksDefault = function () {
        LinksBase();
        $dn.button("Registrarse", $uf.formSignup);
    };
    //Crear botones
    const ButtonLogin = function () {
        let a = $dc.button(divLogin, "Iniciar sesión", $ba.buttonLogin);
        a.className = "Login";
    };
    const ButtonLogout = function () {
        let a = $dc.button(divLogin, "Cerrar sesión", $ba.buttonLogout);
        a.className = "Login";
    };

    //PROCEDIMIENTOS
    //Cargar botones según rol de usuario
    this.init = function () {
        Nav.innerHTML = "";
        if (Rol === undefined) {
            $n.defaultUser(); return;
        }
        switch (Rol) {
            case "Administrador":
                $n.administrador(); break;
            case "Afiliado":
                $n.afiliado(); break;
            case "Recepcionista":
                $n.recepcionista(); break;
            case "Paramedico":
                $n.paramedico(); break;
            case "Despachante":
                $n.despachante(); break;
            case "Mecanico":
                $n.mecanico(); break;
            case "Excluido":
                $n.excluido(); break;
            default:
                $n.defaultUser();
        }
    };
    //Botones específicos de cada rol
    this.defaultUser = function () { LinksBase(); LinksDefault(); ButtonLogin(); };
    this.administrador = function () {
        LinksUsers();
        //$dn.button("ALTA USUARIO", $uf.formAltaUsuario);
        $dn.button("VALIDAR USUARIO", () => { ClearSection(); $uFunctions.makeLogin(); });
        $dn.button("ALTA ROL USUARIO",
            () => {
                $uf.formBuscarUsuario(
                    (usu) => {
                        $uf.formABRol(true, usu)
                    });
            });
        $dn.button("BAJA ROL USUARIO",
            () => {
                $uf.formBuscarUsuario(
                    (usu) => {
                        $uf.formABRol(false, usu)
                    });
            });
        ButtonLogout();
    };
    this.afiliado = function () {
        LinksUsers();
        $dn.button("SOLICITAR AMBULANCIA", $uFunctions.solicitarAmbulancia);
        ButtonLogout();
    }
    this.excluido = function () { Nav.innerHTML = "USUARIO EXCLUIDO"; };
    this.recepcionista = function () {
        LinksUsers();
        $dn.button("VER SOLICITUDES PENDIENTES", $uFunctions.verSolicitudesPendientes);
        ButtonLogout();
    }
    this.despachante = function () {
        LinksUsers();
        $dn.button("ATENDER SOLICITUDES", $uFunctions.atenderSolicitudes);
        ButtonLogout();
    }
    this.paramedico = function () {
        LinksUsers();
        $dn.button("FINALIZAR ASISTENCIA", $uFunctions.finalizarAsistencia);
        ButtonLogout();
    }
    this.mecanico = function () {
        LinksUsers();
        $dn.button("ALTA AMBULANCIA", $uFunctions.altaAmbulancia);
        $dn.button("MODIFICAR AMBULANCIA", $uFunctions.modificarAmbulancia);
        $dn.button("BAJA AMBULANCIA", $uFunctions.bajaAmbulancia);
        ButtonLogout();
    }
};
const $n = new $$Nav();

//////////////////////////////////////////////////////////////////////////////////////
//                      
//                                CLASE BUTTON ACTIONS
//              Guarda todas las funciones de acción de los botones del nav
//
//////////////////////////////////////////////////////////////////////////////////////

const $$ButtonActions = function () {
    //Botones básicos
    this.home = Home;

    //LOGIN y LOGOUT
    this.buttonLogin = function () {
        $uf.formLogin();
    };
    this.buttonLogout = function () {
        $uf.formLogout();
    };

    //Botones para USUARIO NO LOGUEADO/EXCLUIDO
    this.listCarreras = function () { };
    this.listNoticias = function () { };

    //Botones para TODOS LOS USUARIOS
    this.perfilUsuario = function () {
        $uf.formProfile();
    };

    //Botones ADMINISTRADOR
    this.abmCarreras = function () {
        $navegacion.abmCarreras();
    };
    this.addUser = function () {
        $navegacion.abmLista();
    };
    this.modUserByMail = function () { $uf.formFindBy("Mail"); };
    this.modUserByDni = function () { $uf.formFindBy("Dni"); };
};
const $ba = new $$ButtonActions();