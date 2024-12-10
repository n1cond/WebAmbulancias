using System;
using System.Linq;
using BusinessAmbulancias;
using Newtonsoft.Json;

public partial class _Default : System.Web.UI.Page
{
    protected void Page_Load(object sender,EventArgs e)
    {
        if(Request["accion"] != null)
        {
            switch(Request["accion"])
            {
                case "Login": Login(); break;
                case "AgregarUsuario": AgregarUsuario(); break;
                case "VerUsuariosSinLogin": VerUsuariosSinLogin(); break;
                case "ValidarUsuario": ValidarUsuario(); break;
                case "BuscarUsuario": BuscarUsuario(); break;
                case "AgregarLogin": AgregarLogin(); break;
                case "AltaRolUsuario": AltaRolUsuario(); break;
                case "BajaRolUsuario": BajaRolUsuario(); break;
                case "NuevaSolicitud": NuevaSolicitud(); break;
                case "CancelarSolicitud": CancelarSolicitud(); break;
                case "ObtenerSolicitudActiva": ObtenerSolicitudActiva(); break;
                case "ObtenerSolicitudesPendientes": ObtenerSolicitudesPendientes(); break;
                case "AsignarPrioridad": AsignarPrioridad(); break;
                case "SiguienteSolicitud": SiguienteSolicitud(); break;
                case "AltaAmbulancia": AltaAmbulancia(); break;
                case "ModificarAmbulancia": ModificarAmbulancia(); break;
                case "BajaAmbulancia": BajaAmbulancia(); break;
                case "VerAmbulancias": VerAmbulancias(); break;
                case "VerParamedicos": VerParamedicos(); break;
                case "VerEstadoParamedico": VerEstadoParamedico(); break;
                case "AtenderSolicitud": AtenderSolicitud(); break;
                case "VerAsistenciaActiva": VerAsistenciaActiva(); break;
                case "FinalizarAsistencia": FinalizarAsistencia(); break;
                case "UsuarioVacio": UsuarioVacio(); break;
                case "ObtenerRoles": ObtenerRoles(); break;
                case "ObtenerDocumentoTipos": ObtenerDocumentoTipos(); break;
                case "ObtenerSolicitudTipos": ObtenerSolicitudTipos(); break;
                case "ObtenerSolicitudEstados": ObtenerSolicitudEstados(); break;
                case "ObtenerAmbulanciaEstados": ObtenerAmbulanciaEstados(); break;
                default:
                    Response.StatusCode = 300;
                    Response.Write("Acción inválida.");
                    return;
            }
        }
        if(Request.RequestType == "GET")
        {
            try
            {
                PageInit();
                Console.WriteLine("GET");
            } catch (Exception ex)
            {
                Console.WriteLine("Error en GET: "+ex.Message);
            }
        }
    }

    private void FinalizarAsistencia()
    {
        try
        {
            Documento docResponsable = JsonConvert.DeserializeObject<Documento>(Request["documentoIdentidad"]);
            string informe = Request["informe"];
            int solicitud = int.Parse(Request["solicitud"]);
            FuncionesParamedico.FinalizarAsistencia(solicitud, informe, docResponsable);
        } catch(Exception e)
        {
            Response.StatusCode = 300;
            Response.Write("Error al finalizar asistencia: " + e.Message);
        }
    }

    private void BajaRolUsuario()
    {
        try
        {
            Documento docUsuario = JsonConvert.DeserializeObject<Documento>(Request["docUsuario"]);
            Documento docResponsable = JsonConvert.DeserializeObject<Documento>(Request["documentoIdentidad"]);
            Roles rol = (Roles)Enum.Parse(typeof(Roles), Request["rol"]);
            FuncionesAdministrador.BajaRolUsuario(docUsuario, rol, docResponsable);
        }
        catch (Exception e)
        {
            Response.StatusCode = 300;
            Response.Write("Error al validar usuario: " + e.Message);
        }
    }

    private void BuscarUsuario()
    {
        Documento docUsuario = new Documento(Request["docTipo"], int.Parse(Request["docNum"]));
        Response.Write(JsonConvert.SerializeObject(FuncionesBase.ObtenerUsuario(docUsuario)));
    }

    private void AltaRolUsuario()
    {
        try
        {
            Documento docUsuario = JsonConvert.DeserializeObject<Documento>(Request["docUsuario"]);
            Documento docResponsable = JsonConvert.DeserializeObject<Documento>(Request["documentoIdentidad"]);
            Roles rol = (Roles)Enum.Parse(typeof(Roles), Request["rol"]);
            FuncionesAdministrador.AltaRolUsuario(docUsuario, rol, docResponsable);
        } catch (Exception e)
        {
            Response.StatusCode = 300;
            Response.Write("Error al validar usuario: " + e.Message);
        }
        
    }

    private void ValidarUsuario()
    {
        try
        {
            Documento docUsuario = new Documento(Request["docTipo"], int.Parse(Request["docNum"]));
            Documento docResponsable = JsonConvert.DeserializeObject<Documento>(Request["documentoIdentidad"]);
            Usuario usu = FuncionesBase.ObtenerUsuario(docUsuario);
            usu.Nombre = Request["nombre"];
            usu.Apellido = Request["apellido"];
            usu.Direccion = Request["direccion"];
            usu.FechaNacimiento = DateTime.Parse(Request["fechaNacimiento"]);
            string[] arrRoles = Request.Params.GetValues("roles");
            usu.Roles = arrRoles.Select(r => (Roles)Enum.Parse(typeof(Roles), r)).ToArray();
            usu.Modificar(docResponsable);
            FuncionesAdministrador.AltaUsuarioLogin(usu, docResponsable);
            Response.Write("Usuario validado correctamente");
        } catch(Exception e)
        {
            Response.StatusCode = 300;
            Response.Write("Error al validar usuario: " + e.Message);
        }
    }

    private void VerAsistenciaActiva()
    {
        try
        {
            Documento doc = JsonConvert.DeserializeObject<Documento>(Request["documentoIdentidad"]);
            int asistencia = FuncionesParamedico.VerAsistenciaActiva(doc);
            if (asistencia < 1)
                Response.StatusCode = 201;
            Response.Write(JsonConvert.SerializeObject(Solicitud.Buscar(asistencia)));
        }
        catch (Exception e)
        {
            Response.StatusCode = 300;
            Response.Write("Error al ver asistencia activa: " + e.Message);
        }
    }

    private void BajaAmbulancia()
    {
        try
        {
            Documento doc = JsonConvert.DeserializeObject<Documento>(Request["documentoIdentidad"]);
            Ambulancia amb = JsonConvert.DeserializeObject<Ambulancia>(Request["ambulancia"]);
            FuncionesMecanico.BajaAmbulancia(amb, doc);
        }
        catch (Exception e)
        {
            Response.StatusCode = 300;
            Response.Write("Error al dar baja ambulancia: " + e.Message);
        }
    }

    private void VerEstadoParamedico()
    {
        try
        {
            Documento doc = JsonConvert.DeserializeObject<Documento>(Request["documentoIdentidad"]);
            Documento docParamedico = JsonConvert.DeserializeObject<Documento>(Request["documentoParamedico"]);
            Response.Write(FuncionesDespachante.VerEstadoParamedico(docParamedico, doc));
        }
        catch (Exception e)
        {
            Response.StatusCode = 300;
            Response.Write("Error al ver estado de paramédico: " + e.Message);
        }
        

    }

    private void ModificarAmbulancia()
    {
        try
        {
            Documento doc = JsonConvert.DeserializeObject<Documento>(Request["documentoIdentidad"]);
            Ambulancia amb = JsonConvert.DeserializeObject<Ambulancia>(Request["data"]);
            AmbulanciaEstados estado = (AmbulanciaEstados)Enum.Parse(typeof(AmbulanciaEstados), Request["estado"]);
            int kilometraje = int.Parse(Request["kilometraje"]);
            string descripcion = Request["descripcion"];
            if(amb.Estado != estado || amb.Kilometraje != kilometraje || amb.Descripcion != descripcion)
            {
                amb.Estado = estado;
                amb.Kilometraje = kilometraje;
                amb.Descripcion = descripcion;
                FuncionesMecanico.ModificarAmbulancia(amb, doc);
            }
        } catch(Exception e)
        {
            Response.StatusCode = 300;
            Response.Write("Error al modificar ambulancia: " + e.Message);
        }
        
    }

    private void AltaAmbulancia()
    {
        try
        {
            Documento docResponsable = JsonConvert.DeserializeObject<Documento>(Request["documentoIdentidad"]);
            string modelo = Request["modelo"];
            string patente = Request["patente"];
            string descripcion = Request["descripcion"];
            int kilometraje = int.Parse(Request["kilometraje"]);
            Ambulancia amb = new Ambulancia(patente, modelo, kilometraje, descripcion);
            FuncionesMecanico.AgregarAmbulancia(amb, docResponsable);
        } catch (Exception e) {
            Response.StatusCode = 300;
            Response.Write("Error al agregar ambulancia: " + e.Message);
        }
    }

    private void VerUsuariosSinLogin()
    {
        try
        {
            Documento doc = JsonConvert.DeserializeObject<Documento>(Request["documentoIdentidad"]);
            Usuario[] res = FuncionesAdministrador.CargarUsuariosSinLogin(doc);
            Response.Write(JsonConvert.SerializeObject(res));
        } catch(Exception e)
        {
            Response.StatusCode = 300;
            Response.Write("Error al ver usuarios sin login: " + e.Message);
        }
    }

    private void AgregarLogin()
    {
        try
        {
            Documento docResponsable = JsonConvert.DeserializeObject<Documento>(Request["documentoIdentidad"]);
            Documento docUsuario = JsonConvert.DeserializeObject<Documento>(Request["documentoUsuario"]);
            Usuario u = FuncionesBase.ObtenerUsuario(docUsuario);
            FuncionesAdministrador.AltaUsuarioLogin(u, docResponsable);
        } catch (Exception e)
        {
            Response.StatusCode = 300;
            Response.Write("No se pudo agregar login: " + e.Message);
        }
    }

    private void VerParamedicos()
    {
        try
        {
            Documento doc = JsonConvert.DeserializeObject<Documento>(Request["documentoIdentidad"]);
            Response.Write(JsonConvert.SerializeObject(FuncionesDespachante.VerParamedicos(doc)));
        } catch(Exception e)
        {
            Response.StatusCode = 300;
            Response.Write("No se pudo ver paramédicos: " + e.Message);
        }
    }

    private void VerAmbulancias()
    {
        try
        {
            Documento doc = JsonConvert.DeserializeObject<Documento>(Request["documentoIdentidad"]);
            Response.Write(JsonConvert.SerializeObject(FuncionesDespachante.VerAmbulancias(doc)));
        } catch (Exception e)
        {
            Response.StatusCode = 300;
            Response.Write("Error al ver ambulancias: " + e.Message);
        }
    }

    private void SiguienteSolicitud()
    {
        try
        {
            Documento doc = JsonConvert.DeserializeObject<Documento>(Request["documentoIdentidad"]);
            Solicitud res = FuncionesDespachante.SiguienteSolicitud(doc);
            Response.Write(JsonConvert.SerializeObject(res));
        }
        catch (Exception e)
        {
            Response.StatusCode = 300;
            Response.Write("No se pudo atender solicitud:\n" + e.Message);
        }
        
    }

    private void AtenderSolicitud()
    {
        try
        {
            Documento doc = JsonConvert.DeserializeObject<Documento>(Request["documentoIdentidad"]);
            Solicitud sol = JsonConvert.DeserializeObject<Solicitud>(Request["solicitud"]);
            Ambulancia amb = JsonConvert.DeserializeObject<Ambulancia>(Request["ambulancia"]);
            string[] aux = Request.Params.GetValues("equipo");
            Usuario[] equipo = aux.Select(p => JsonConvert.DeserializeObject<Usuario>(p)).ToArray();
            if (equipo.Length == 0) throw new Exception("No se seleccionaron paramédicos.");
            if (equipo.Length > 4) throw new Exception("El máximo de paramédicos es 4.");
            FuncionesDespachante.AtenderSolicitud(sol, amb, equipo, doc);
        } catch (Exception e)
        {
            Response.StatusCode = 300;
            Response.Write("No se pudo atender solicitud:\n" + e.Message);
        }
    }

    private void AsignarPrioridad()
    {
        try
        {
            Documento doc = JsonConvert.DeserializeObject<Documento>(Request["documentoIdentidad"]);
            Solicitud sol = FuncionesRecepcionista.BuscarSolicitud(
                int.Parse(Request["CreadorID"]), doc);
            SolicitudEstados prioridad = (SolicitudEstados)Enum.Parse(
                typeof(SolicitudEstados), $"Asignada{Request["Asignar"]}");
            sol.AsignarPrioridad(prioridad, doc);
        } catch (Exception e)
        {
            Response.StatusCode = 300;
            Response.Write("No se pudo asignar prioridad:\n" + e.Message);
        }
    }

    private void ObtenerSolicitudesPendientes()
    {
        try
        {
            Documento doc = JsonConvert.DeserializeObject<Documento>(Request["documentoIdentidad"]);
            Solicitud[] arrSol = FuncionesRecepcionista.VerSolicitudesNuevas(doc).ToArray();
            Response.Write(JsonConvert.SerializeObject(arrSol));
        } catch(Exception e)
        {
            Response.StatusCode = 300;
            Response.Write("No se pueden obtener las solicitudes:\n" + e.Message);
        }
        
    }

    private void CancelarSolicitud()
    {
        try
        {
            Solicitud sol = JsonConvert.DeserializeObject<Solicitud>(Request["data"]);
            Documento docResponsable = JsonConvert.DeserializeObject<Documento>(Request["documentoIdentidad"]);
            sol.Cancelar(docResponsable);
            Response.Write("Solicitud cancelada");
        } catch(Exception e)
        {
            Response.StatusCode = 300;
            Response.Write("Error al cancelar solicitud: " + e.Message);
        }
        

    }

    private void ObtenerRoles()
    {
        Response.Write(JsonConvert.SerializeObject(Enum.GetNames(typeof(Roles))));
    }

    private void ObtenerDocumentoTipos()
    {
        Response.Write(JsonConvert.SerializeObject(Enum.GetNames(typeof(DocumentoTipos))));
    }

    private void ObtenerSolicitudTipos()
    {
        Response.Write(JsonConvert.SerializeObject(Enum.GetNames(typeof(SolicitudTipos))));
    }

    private void ObtenerSolicitudEstados()
    {
        Response.Write(JsonConvert.SerializeObject(Enum.GetNames(typeof(SolicitudEstados))));
    }

    private void ObtenerAmbulanciaEstados()
    {
        Response.Write(JsonConvert.SerializeObject(Enum.GetNames(typeof(AmbulanciaEstados))));
    }

    private void UsuarioVacio()
    {
        Response.Write(JsonConvert.SerializeObject(new Usuario()));
    }

    private void PageInit()
    {
        FuncionesBase.Init();
    }

    private void NuevaSolicitud()
    {
        try
        {
            if (Request["tipoSolicitud"] == "0")
            {
                Response.StatusCode = 300;
                Response.Write("Tipo de solicitud inválido");
                return;
            }
            Documento doc = new Documento(Request["tipoDoc"], int.Parse(Request["numDoc"]));
            int idCreador = FuncionesBase.ObtenerUsuario(doc).ID;
            Solicitud sol = new Solicitud(
                idCreador, 
                (SolicitudTipos)Enum.Parse(typeof(SolicitudTipos), 
                Request["tipoSolicitud"]),
                Request["direccion"], 
                Request["descripcion"]
                );
            if (sol.EsValido())
            {
                sol.Agregar();
            }
        } catch (Exception e)
        {
            Response.StatusCode = 500;
            Response.Write("Error al generar solicitud: " + e.Message);
        }
    }

    private void ObtenerSolicitudActiva()
    {
        try
        {
            Documento docAfiliado = JsonConvert.DeserializeObject<Documento>(Request["documentoIdentidad"]);
            Solicitud s = FuncionesAfiliado.SolicitudActiva(docAfiliado);
            Response.Write(JsonConvert.SerializeObject(s));
        } catch(Exception e)
        {
            Response.StatusCode = 201;
            Response.Write(e.Message);
        }
    }

    private void AgregarUsuario()
    {
        try
        {
            string docTipo = Request["docTipo"];
            int docNum = int.Parse(Request["docNum"]);
            string Nombre = Request["nombre"];
            string Apellido = Request["apellido"];
            string mail = Request["mail"];
            string fNac = Request["fechaNacimiento"];
            string Direccion = Request["direccion"];
            Usuario u = new Usuario(mail, docTipo, docNum, Nombre, Apellido, fNac, Direccion);
            Documento docResponsable = u.DocumentoIdentidad;
            if (u.EsValido())
            {
                u.Agregar(docResponsable);
                Response.Write("Usuario agregado correctamente.");
            }
            else
                throw new Exception("Valores inválidos");
            
        } catch(Exception e)
        {
            Response.Write("Error al agregar usuario: " + e.Message);
        }
        
    }

    private void Login()
    {
        try
        {
            string docTipo = Request["docTipo"];
            int docNum = int.Parse(Request["docNum"]);
            string pass = Request["Pass"];

            Usuario u = FuncionesAnonimo.Login(docTipo, docNum, pass);
            Response.Write(JsonConvert.SerializeObject(u));
        } catch(Exception e)
        {
            if (e.Message == "No fue posible buscar Usuario: " +
                "No hay ninguna fila en la posición 0.")
            {
                Response.StatusCode = 300;
                Response.Write("Usuario o contraseña incorrectos. Intente nuevamente.");
                return;
            }
            Response.StatusCode = 500;
            Response.Write("Error al iniciar sesión: " + e.Message);
        }
        
    }
}