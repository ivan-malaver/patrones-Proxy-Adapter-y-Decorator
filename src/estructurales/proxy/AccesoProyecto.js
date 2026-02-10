/**
 * INTERFAZ común para acceso a proyectos
 * Tanto el Proxy como el AccesoReal implementan esta interfaz
 */
class AccesoProyecto {
    obtenerProyecto(proyectoId, usuarioId) {
        throw new Error("Método obtenerProyecto debe ser implementado");
    }
    
    agregarEvaluacion(proyectoId, usuarioId, estudianteId, nota) {
        throw new Error("Método agregarEvaluacion debe ser implementado");
    }
    
    asignarProfesor(proyectoId, usuarioId, profesorId) {
        throw new Error("Método asignarProfesor debe ser implementado");
    }
}

module.exports = AccesoProyecto;