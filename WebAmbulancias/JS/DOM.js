const $$DomBasic = function () {
//parametros
//funciones
//métodos
    this.id = function (id) { return document.getElementById(id); };
    this.ce = function (type) { return document.createElement(type); };
    this.ac = function (parent, child) { parent.appendChild(child); };
    this.rc = function (parent, child) { parent.removeChild(child); };
}; //Clase
const $d = new $$DomBasic(); //Instancia

const $$DomControls = function () {

    //Funciones básicas
    const AddControl = function (parent, strElem) {
        let control = $d.ce(strElem);
        $d.ac(parent, control); 
        return control;
    };

    const AddInput = function (parent, type) {
        let input = AddControl(parent, "input");
        input.type = type;
        input.required = true;
        return input;
    };

    const LabelAndInput = function (parent, label, type, name) {
        let div = $dc.div(parent);
        div.className = "item";
        let lbl = $dc.label(div, label);
        let input = AddInput(div, type);
        lbl.for = input.id;
        if (name != null) input.name = name;
        return input;
    };

    //Métodos
    //ADD CONTROL

    //Cada control que quiera agregar debe colocar el bodyID que usó para crear el form en el parámetro parent
    //EJEMPLO:
    //let f = $df.form("titulo", "botonSubmit", "cuerpoID");
    //let cuerpoForm = $d.id("cuerpoID"); //Es más fácil si se lo captura
    //let control = $df.inputMail(cuerpoForm, "labelMail");

    this.div = function (parent) {
        return AddControl(parent, "div");
    };

    this.p = function (parent, innerText) {
        let text = AddControl(parent, "p");
        text.innerHTML = innerText;
        return text;
    };

    this.h1 = function (parent, innerText) {
        let text = AddControl(parent, "h1");
        text.innerHTML = innerText;
        return text;
    };

    this.h2 = function (parent, innerText) {
        let text = AddControl(parent, "h2");
        text.innerHTML = innerText;
        return text;
    };

    this.a = function (parent, innerText, fOnClick) {
        let a = AddControl(parent, "a");
        a.innerHTML = innerText.toUpperCase();
        if (fOnClick != null) a.onclick = fOnClick;
        return a;
    }

    this.label = function (parent,innerText) {
        let lbl = AddControl(parent, "label");
        lbl.innerText = innerText.toUpperCase();
        return lbl;
    };

    this.img = function (parent, src) {
        let imagen = AddControl(parent, "img");
        imagen.src = src;
        return imagen;
    }

    this.ul = function (parent) {
        let ul = AddControl(parent, "ul");
        ul.id = "ul";
        return ul;
    };

    this.li = function (parent) {
        let li = AddControl(parent, "li");
        return li;
    };

    this.form = function (parent) {
        let f = AddControl(parent, "form");
        return f;
    };

    this.button = function (parent, innerText, fOnClick) {
        let b = AddControl(parent, "button");
        b.innerText = innerText.toUpperCase();
        b.onclick = fOnClick;
        return b;
    };

    this.select = function (parent, labelText) {
        let div = $dc.div(parent);
        div.className = "item";
        let lbl = $dc.label(div, labelText);
        let select = AddControl(div, "select");
        lbl.for = select.id;
        return select;
        //LabelAndInput(parent, labelText, "select");
    };

    this.addOption = function (parent, content) {
        let option = AddControl(parent, "option");
        option.value = content;
        option.innerText = content;
        option.required = true;
        return option;
    };

    this.doubleButton = function (parent, text1, text2, fOnClick1, fOnClick2) {
        let arrayButtons = new Array();
        let parentDiv = $dc.div(parent);
        parentDiv.className = "item";

        let divB1 = $dc.div(parentDiv);
        divB1.style["text-align"] = "left";
        let b1 = $dc.button(divB1, text1, fOnClick1);
        b1.className = "button";
        arrayButtons.push(b1);

        let divB2 = $dc.div(parentDiv);
        divB2.style["text-align"] = "right";
        let b2 = $dc.button(divB2, text2, fOnClick2);
        b2.className = "button";
        arrayButtons.push(b2);

        return arrayButtons;
    }

    //ADD INPUT
    

    this.inputText = function (parent, labelText) {
        return LabelAndInput(parent, labelText, "text");
    };

    this.inputNumber = function (parent, labelText) {
        return LabelAndInput(parent, labelText, "number");
    };

    this.inputMail = function (parent, labelText) {
        return LabelAndInput(parent, labelText, "email");
    };

    this.inputDate = function (parent, labelText) {
        return LabelAndInput(parent, labelText, "date");
    };

    this.inputPass = function (parent, labelText) {
        return LabelAndInput(parent, labelText, "password");
    };

    this.inputHidden = function (parent) {
        return AddInput(parent, "hidden");
    }

    this.inputFile = function (parent, labelText, name) {
        let input = LabelAndInput(parent, labelText, "file", name);
        return input;
    };

    this.inputImg = function (parent, labelText, name) {
        let input = $dc.inputFile(parent, labelText, name);
        input.accept = "image/*";
        input.onchange = function () {
            input.setCustomValidity("");
            if (input.files.length === 0) return;
            if (!input.files[0].type.match('image.*')) {
                input.setCustomValidity("El archivo debe ser una imagen."); return;
            }
        };
        return input;
    };

    this.inputPdf = function (parent, labelText, name) {
        let input = $dc.inputFile(parent, labelText, name);
        input.accept = "pdf";
        input.onchange = function () {
            input.setCustomValidity("");
            if (input.files.length === 0) return; //Si no se subió archivo retorna
            let filename = input.files[0].name; //Toma el nombre del primer archivo
            let aux = filename.split('.'); //Lo divide en nombre y extensión a partir del punto
            let extension = aux[aux.length - 1]; //Toma el texto después del último punto como la extensión
            if (extension != "pdf") {
                input.setCustomValidity("El archivo debe ser un archivo PDF."); return;
            }
        };
        return input;
    };

    this.inputSubmit = function (parent, innerText) {
        let s = AddInput(parent, "submit");
        s.value = innerText.toUpperCase();
        return s;
    };

    this.inputReset = function (parent, innerText) {
        let s = AddInput(parent, "reset");
        s.value = innerText.toUpperCase();
        return s;
    };

    this.passConfirm = function (parent) {
        let passes = new Array();
        let pass = $dc.inputPass(parent, "NUEVA CONTRASEÑA");
        pass.placeholder = "Si no quiere modificar, deje en blanco";
        pass.required = false;
        let confirm = $dc.inputPass(parent, "confirme contraseña");
        confirm.required = false;
        confirm.disabled = true;
        pass.onchange = function () {
            if (pass.value === "") {
                pass.required = false;
                confirm.value = "";
                confirm.required = false;
                confirm.disabled = true;
                return;
            }
            confirm.disabled = false;
            pass.required = true;
            confirm.required = true;
        };
        confirm.onchange = function () {
            if (pass.value === confirm.value) {
                confirm.setCustomValidity("");
            } else
                confirm.setCustomValidity("Las contraseñas no coinciden.");
        };
        passes.push(pass);
        passes.push(confirm)
        return passes;
    }; //Crea 2 controles y devuelve un array
    

    // TABLAS
    //Row
    this.tr = function (parent) {
        let tr = $d.ce("tr");
        $d.ac(parent, tr);
        return tr;
    }
    //Celdas
    this.td = function (parent) {
        let td = $d.ce("td");
        $d.ac(parent, td);
        return td;
    }
    //Header
    this.th = function (parent) {
        let th = $d.ce("th");
        $d.ac(parent, th);
        return th;
    }
};
const $dc = new $$DomControls();

const $$DomForms = function () {
    this.form = function (title, textSubmit, bodyID) {
        let f = $dc.form($d.id("Section"));
        f.className = "standardForm";

        //Header
        let header = $dc.div(f);
        header.className = "Header";
        let lbl = $dc.label(header, title.toUpperCase());
        let img = $dc.a(header, "X");
        img.onclick = Home;

        //Cuerpo del form
        let cform = $dc.div(f);
        cform.className = "Cform";
        cform.id = bodyID;

        //Pie del form
        let foot = $dc.div(f);
        foot.className = "Footer";

        let divSubmit = $dc.div(foot);
        divSubmit.className = "footerDiv left";
        let submit = $dc.inputSubmit(divSubmit, textSubmit);
        submit.className = "Submit";

        let divReset = $dc.div(foot);
        divReset.className = "footerDiv right";
        let reset = $dc.inputReset(divReset, "CANCELAR");
        reset.className = "Reset";

        return f;
    };

    this.formImg = function (title, textSubmit, bodyID, Fload) {
        //FUNCTIONS
        const Load = function () {
            let res = this.contentWindow.document.childNodes[0].innerText;
            if (res === "") return;
            Fload(res);
            return false;
        };
        const MakeHiddens = function () {
            let accion = $dc.inputHidden(cForm);
            accion.name = "accion";
            accion.id = "accion";
            let id = $dc.inputHidden(cForm);
            id.id = "ID";
            id.name = "ID";
        };
        //DESARROLLO
        let f = $df.form(title, textSubmit, bodyID);
        let cForm = $d.id(bodyID);
        f.method = "POST";
        f.action = "default.aspx";
        f.enctype = "multipart/form-data";
        let ifr = $d.ce("iframe");
        ifr.name = "iframe";
        ifr.style.display = "none";
        $d.ac(Section, ifr);
        f.target = "iframe";
        ifr.onload = Load;
        MakeHiddens();
        return f;
    };
};
const $df = new $$DomForms();

const $$DomTable = function () {
    //PARAMETROS
    let table, Header,
        List, Rows, MakeRow,
        Pos, MaxPos, Footer,
        BtStart, BtPrevious, BtNext, BtEnd;
    //FUNCIONES
    const MakeTable = function () {
        table = $d.id("Table");
        if (table === null || table === undefined) {
            table = $d.ce("table");
            $d.ac(Section, table);
            table.id = "Table";
        }
        table.innerHTML = "";
        MakeHeader();
    };

    const MakeHeader = function () {
        let tr = $dc.tr(table);
        for (var i = 0; i < Header.length; i++) {
            //Agrega una celda header a la fila con el texto correspondiente en el array
            $dc.th(tr).innerText = Header[i].toUpperCase();
        }
        MakeBody();
    };
    const MakeBody = function () {
        for (var i = Pos; i < Pos + Rows && i < List.length; i++) {
            let tr = $dc.tr(table);
            for (var j = 0; j < Header.length; j++) {
                $dc.td(tr);
            }
            MakeRow(tr, List[i]);
        }
        MakeFooter();
    };
    const MakeFooter = function () {
        let tr = $dc.tr(table);
        Footer = $dc.th(tr);
        Footer.id = "Footer";
        Footer.colSpan = Header.length;

        BtStart = $dc.div(Footer);
        BtPrevious = $dc.div(Footer);
        BtNext = $dc.div(Footer);
        BtEnd = $dc.div(Footer);

        BtStart.innerText = "\|<<";
        BtPrevious.innerText = "<";
        BtNext.innerText = ">";
        BtEnd.innerText = ">>\|";

        BtStart.className = "btfoot left";
        BtPrevious.className = "btfoot left";
        BtEnd.className = "btfoot right";
        BtNext.className = "btfoot right";

        MakeVisibility();
    };

    const MakeVisibility = function () {
        BtStart.disabled = true;
        BtPrevious.disabled = true;
        BtNext.disabled = true;
        BtEnd.disabled = true;
        BtStart.innerText = "";
        BtPrevious.innerText = "";
        BtNext.innerText = "";
        BtEnd.innerText = "";
        //BtStart.style.display = "none";
        //BtPrevious.style.display = "none";
        //BtNext.style.display = "none";
        //BtEnd.style.display = "none";
        //visibilidad en funcion de pos
        if (Pos > 0) {
            BtStart.disabled = false;
            BtPrevious.disabled = false;
            BtStart.innerText = "\|<<";
            BtPrevious.innerText = "<";
            //BtStart.style.display = "inline-block";
            //BtPrevious.style.display = "inline-block";
        }
        if (Pos < MaxPos) {
            BtNext.disabled = false;
            BtEnd.disabled = false;
            BtNext.innerText = ">";
            BtEnd.innerText = ">>\|";
            //BtNext.style.display = "inline-block";
            //BtEnd.style.display = "inline-block";
        }
        MakeClick();
    };
    const MakeClick = function () {
        BtStart.onclick = function () { Pos = 0; MakeTable(); };
        BtPrevious.onclick = function () {
            Pos -= Rows;
            if (Pos < 0) Pos = 0;
            RefreshTable();
        };
        BtNext.onclick = function () {
            Pos += Rows;
            if (Pos > MaxPos) Pos = MaxPos;
            RefreshTable();
        };
        BtEnd.onclick = function () {
            Pos = MaxPos;
            RefreshTable();
        };
        MakeWheel();
    };
    const MakeWheel = function () {
        Table.onmousewheel = function (e) {
            if (e.wheelDelta > 0) {
                if (Pos-1 >= 0) Pos--;
            } else {
                if (Pos+1 <= MaxPos) Pos++;
            }
            RefreshTable();
        };
    };
    const RefreshTable = function () {
        MakeTable();
    };
    //METODOS
    this.table = function (header, list, rows, fRow) {
        Header = header;
        List = list;
        Rows = rows;
        MakeRow = fRow;
        Pos = 0;
        MaxPos = List.length - Rows;
        MakeTable();
    };
};
const $dt = new $$DomTable();

const $$DomNav = function () {
    this.button = function (innerText, action) {
        let li = $dc.li(ul);
        $dc.a(li, innerText.toUpperCase(), action);
        return li;
    };
    this.dropdownButton = function (buttonName, aSubmenuNames, aOnClick) {
        let li = $dn.button(buttonName, "");
        let div = $dc.div(li);
        for (let i = 0; i < aSubmenuNames.length; i++) {
            $dc.a(div, aSubmenuNames[i], aOnClick[i]);
        };
        return li;
    };
};
const $dn = new $$DomNav();