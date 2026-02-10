/**
 * Modelo Evaluacion - Representa una calificación individual de un estudiante en un proyecto
 */
class Evaluacion {
    constructor(estudianteId, nota, fecha) {
        this.estudianteId = estudianteId;
        this.nota = nota;           // 0-100
        this.fecha = new Date(fecha);
        this.comentario = "";
    }

    agregarComentario(comentario) {
        this.comentario = comentario;
    }

    estaAprobada() {
        return this.nota >= 70;
    }

    obtenerInfo() {
        return {
            estudianteId: this.estudianteId,
            nota: this.nota,
            aprobada: this.estaAprobada(),
            fecha: this.fecha.toISOString(),
            comentario: this.comentario
        };
    }
}

module.exports = Evaluacion;