/**
 * Modelo Profesor - Representa a un profesor de la UES
 * REQUISITO: Un profesor puede tener N cursos, pero solo 1 proyecto
 */
class Profesor {
    constructor(id, nombre, email, facultad) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.facultad = facultad;
        this.cursos = [];           // Lista de IDs de cursos
        this.proyectoAsignado = null;  // SOLO UN proyecto (requisito)
        this.estado = "activo";
    }

    // Asignar curso al profesor
    asignarCurso(cursoId) {
        if (!this.cursos.includes(cursoId)) {
            this.cursos.push(cursoId);
            return true;
        }
        return false;
    }

    // Asignar proyecto (solo uno)
    asignarProyecto(proyectoId) {
        if (this.proyectoAsignado) {
            throw new Error(`El profesor ${this.nombre} ya tiene un proyecto asignado`);
        }
        this.proyectoAsignado = proyectoId;
        return true;
    }

    // Remover proyecto
    removerProyecto() {
        this.proyectoAsignado = null;
    }

    obtenerInfo() {
        return {
            id: this.id,
            nombre: this.nombre,
            email: this.email,
            facultad: this.facultad,
            totalCursos: this.cursos.length,
            proyectoAsignado: this.proyectoAsignado,
            estado: this.estado
        };
    }
}

module.exports = Profesor;