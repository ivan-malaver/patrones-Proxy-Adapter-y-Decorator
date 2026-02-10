const Pais = require('./Pais');

/**
 * Modelo Estudiante - Representa a un estudiante de la UES
 * REQUISITO: Cada estudiante tiene un país de origen
 */
class Estudiante {
    constructor(id, nombre, email, codigoPais) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.codigoPais = codigoPais;
        this.cursos = [];           // Lista de IDs de cursos
        this.proyectos = [];        // Lista de IDs de proyectos
        this.fechaRegistro = new Date();
    }

    // Obtener objeto país completo (no solo el código)
    obtenerPais(paises) {
        return paises.find(p => p.codigo === this.codigoPais);
    }

    // Inscribir en un curso
    inscribirCurso(cursoId) {
        if (!this.cursos.includes(cursoId)) {
            this.cursos.push(cursoId);
            return true;
        }
        return false;
    }

    // Asignar a un proyecto
    asignarProyecto(proyectoId) {
        if (!this.proyectos.includes(proyectoId)) {
            this.proyectos.push(proyectoId);
            return true;
        }
        return false;
    }

    obtenerInfo() {
        return {
            id: this.id,
            nombre: this.nombre,
            email: this.email,
            pais: this.codigoPais,
            totalCursos: this.cursos.length,
            totalProyectos: this.proyectos.length,
            fechaRegistro: this.fechaRegistro.toISOString().split('T')[0]
        };
    }
}

module.exports = Estudiante;