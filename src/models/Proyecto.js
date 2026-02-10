const Evaluacion = require('./Evaluacion');

/**
 * Modelo Proyecto - Representa un proyecto de investigación del ICCIS
 * REQUISITO: Si el 50% de evaluaciones son <70, el proyecto se cierra
 */
class Proyecto {
    constructor(id, titulo, descripcion, facultad, presupuesto, fechaInicio) {
        this.id = id;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.facultad = facultad;
        this.presupuesto = presupuesto;
        this.fechaInicio = new Date(fechaInicio);
        this.fechaFin = null;
        this.profesorId = null;     // Profesor asignado (solo uno)
        this.estudiantes = [];      // Estudiantes participantes
        this.evaluaciones = [];     // Lista de objetos Evaluacion
        this.estado = "activo";
    }

    // Asignar profesor (solo uno)
    asignarProfesor(profesorId) {
        if (this.profesorId) {
            throw new Error(`El proyecto ${this.titulo} ya tiene un profesor asignado`);
        }
        this.profesorId = profesorId;
        return true;
    }

    // Agregar estudiante participante
    agregarEstudiante(estudianteId) {
        if (!this.estudiantes.includes(estudianteId)) {
            this.estudiantes.push(estudianteId);
            return true;
        }
        return false;
    }

    // Agregar evaluación individual
    agregarEvaluacion(estudianteId, nota) {
        const evaluacion = new Evaluacion(estudianteId, nota, new Date());
        this.evaluaciones.push(evaluacion);
        this.verificarEstado();
        return evaluacion;
    }

    // Verificar si se debe cerrar el proyecto (REQUISITO DEL 50%)
    verificarEstado() {
        if (this.evaluaciones.length === 0) return;

        const total = this.evaluaciones.length;
        const malas = this.evaluaciones.filter(e => e.nota < 70).length;
        const porcentajeMalas = (malas / total) * 100;

        if (porcentajeMalas > 50) {
            this.estado = "cerrado";
            this.fechaFin = new Date();
            console.log(`🚫 PROYECTO ${this.id} CERRADO: ${porcentajeMalas.toFixed(1)}% de notas <70`);
        }
    }

    // Calcular promedio del proyecto
    calcularPromedio() {
        if (this.evaluaciones.length === 0) return 0;
        
        const suma = this.evaluaciones.reduce((total, e) => total + e.nota, 0);
        return suma / this.evaluaciones.length;
    }

    obtenerInfo() {
        const promedio = this.calcularPromedio();
        const total = this.evaluaciones.length;
        const malas = this.evaluaciones.filter(e => e.nota < 70).length;
        const porcentajeMalas = total > 0 ? (malas / total) * 100 : 0;

        return {
            id: this.id,
            titulo: this.titulo,
            facultad: this.facultad,
            presupuesto: this.presupuesto,
            estado: this.estado,
            profesorId: this.profesorId,
            totalEstudiantes: this.estudiantes.length,
            totalEvaluaciones: total,
            promedio: promedio.toFixed(2),
            porcentajeMalas: porcentajeMalas.toFixed(1),
            fechaInicio: this.fechaInicio.toISOString().split('T')[0],
            fechaFin: this.fechaFin ? this.fechaFin.toISOString().split('T')[0] : null
        };
    }

    obtenerEvaluaciones() {
        return this.evaluaciones.map(e => e.obtenerInfo());
    }
}

module.exports = Proyecto;