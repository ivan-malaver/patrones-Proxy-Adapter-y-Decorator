/**
 * Modelo Curso - Representa un curso universitario
 */
class Curso {
    constructor(id, nombre, codigo, creditos, facultad) {
        this.id = id;
        this.nombre = nombre;
        this.codigo = codigo;
        this.creditos = creditos;
        this.facultad = facultad;
        this.profesorId = null;     // ID del profesor asignado
        this.estudiantes = [];      // Lista de IDs de estudiantes
        this.proyectoId = null;     // Proyecto asociado (del ICCIS)
        this.estado = "activo";
    }

    // Asignar profesor
    asignarProfesor(profesorId) {
        this.profesorId = profesorId;
        return true;
    }

    // Inscribir estudiante
    inscribirEstudiante(estudianteId) {
        if (!this.estudiantes.includes(estudianteId)) {
            this.estudiantes.push(estudianteId);
            return true;
        }
        return false;
    }

    // Asignar proyecto ICCIS
    asignarProyecto(proyectoId) {
        this.proyectoId = proyectoId;
        return true;
    }

    obtenerInfo() {
        return {
            id: this.id,
            nombre: this.nombre,
            codigo: this.codigo,
            creditos: this.creditos,
            facultad: this.facultad,
            profesorId: this.profesorId,
            totalEstudiantes: this.estudiantes.length,
            proyectoId: this.proyectoId,
            estado: this.estado
        };
    }
}

module.exports = Curso;