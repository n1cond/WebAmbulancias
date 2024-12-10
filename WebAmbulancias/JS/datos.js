let Response;
const $$Datos = function () {

    this.post = function (data, next) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "Default.aspx");
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.onload = () => {
            next(xhr);
        };
        xhr.onerror = () => {
            alert(response);
        }
        xhr.send(data);
    }

    this.request = function (accion, next) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "Default.aspx");
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.onload = () => {
            if (xhr.status == 200) {
                next(xhr.response);
            } else {
                next(null);
            }
        };
        xhr.onerror = () => {
            alert(response);
        }
        try {
            xhr.send("accion=" + accion);
        } catch (e) { alert(e); }
    }
    /**
     * Envía FormData al servidor.
     * fd: FormData a enviar
     * next: función a ejecutar luego de enviar
     * errMsg: string a mostrar en caso de error
     */
    this.postFormData = async function (fd, next) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "Default.aspx");
        xhr.onload = () => {
            if (xhr.status == 200) {
                next(xhr);
            } else {
                alert(xhr.responseText);
            }
        }
        xhr.onerror = () => {
            alert(xhr.response);
        }
        xhr.send(fd);
    }

    this.loadRoles = async function () {
        let rolesArr = await $datos.request("ObtenerRoles");
        return rolesArr;
    };

    this.cargarSelect = (select, accion) => {
        $datos.request(accion, (res) => {
            let arrTipos = JSON.parse(res);
            for (let i = 0; i < arrTipos.length; i++) {
                let o = $dc.addOption(select, arrTipos[i]);
                o.value = i;
            }
        });
    }

    this.loadDocTipos = async function () {
        let arrTipos;
        await $datos.request("ObtenerDocumentoTipos", (res) => {
            arrTipos = JSON.parse(res);
        });
        return arrTipos;
    }

    this.addUser = function (user) {
        return $datos.request("AGREGARUSUARIO&Data=" + user);
    }
}
const $datos = new $$Datos();