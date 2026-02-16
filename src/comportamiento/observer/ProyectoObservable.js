// src/comportamiento/observer/ProyectoObservable.js

import Subject from './Subject.js';

class ProyectoObservable extends Subject {
    constructor(proyecto) {
        super();
        this.proyecto = proyecto;
        this.cambios = [];
    }

    // Métodos para notificar eventos específicos
    notificarNuevaEvaluacion(evaluacion) {
        console.log(`📊 Evaluación agregada al proyecto ${this.proyecto.id}: ${evaluacion.nota}`);
        this.notify('EVALUACION_AGREGADA', {
            proyecto: this.proyecto,
            evaluacion,
            timestamp: new Date().toISOString()
        });
        
        // Verificar regla del 50% después de agregar evaluación
        this.verificarRegla50Porciento();
    }

    notificarCambioEstado(nuevoEstado) {
        const estadoAnterior = this.proyecto.estado;
        this.proyecto.estado = nuevoEstado;
        
        console.log(`🔄 Estado cambiado: ${estadoAnterior} -> ${nuevoEstado}`);
        this.notify('ESTADO_CAMBIADO', {
            proyecto: this.proyecto,
            estadoAnterior,
            nuevoEstado,
            timestamp: new Date().toISOString()
        });

        this.registrarCambio(`Estado cambiado de ${estadoAnterior} a ${nuevoEstado}`);
    }

    notificarPresupuestoActualizado(nuevoPresupuesto) {
        const presupuestoAnterior = this.proyecto.presupuesto;
        this.proyecto.presupuesto = nuevoPresupuesto;
        
        console.log(`💰 Presupuesto actualizado: ${presupuestoAnterior} -> ${nuevoPresupuesto}`);
        this.notify('PRESUPUESTO_ACTUALIZADO', {
            proyecto: this.proyecto,
            presupuestoAnterior,
            nuevoPresupuesto,
            timestamp: new Date().toISOString()
        });

        this.registrarCambio(`Presupuesto actualizado a ${nuevoPresupuesto}`);
    }

    notificarEstudianteAgregado(estudiante) {
        if (!this.proyecto.estudiantes) {
            this.proyecto.estudiantes = [];
        }
        this.proyecto.estudiantes.push(estudiante);
        
        console.log(`👨‍🎓 Estudiante agregado: ${estudiante.nombre}`);
        this.notify('ESTUDIANTE_AGREGADO', {
            proyecto: this.proyecto,
            estudiante,
            totalEstudiantes: this.proyecto.estudiantes.length,
            timestamp: new Date().toISOString()
        });

        this.registrarCambio(`Estudiante ${estudiante.nombre} agregado`);
    }

    notificarProyectoCerrado(razon) {
        this.proyecto.estado = 'cerrado';
        this.proyecto.fechaCierre = new Date().toISOString();
        this.proyecto.razonCierre = razon;
        
        console.log(`🚫 Proyecto ${this.proyecto.id} cerrado: ${razon}`);
        this.notify('PROYECTO_CERRADO', {
            proyecto: this.proyecto,
            razon,
            timestamp: new Date().toISOString()
        });

        this.registrarCambio(`Proyecto cerrado: ${razon}`);
    }

    // Método para verificar la regla del 50%
    verificarRegla50Porciento() {
        if (!this.proyecto.evaluaciones || this.proyecto.evaluaciones.length === 0) {
            return;
        }

        const totalEvaluaciones = this.proyecto.evaluaciones.length;
        const evaluacionesBajas = this.proyecto.evaluaciones.filter(e => e.nota < 70).length;
        const porcentajeBajas = (evaluacionesBajas / totalEvaluaciones) * 100;

        console.log(`📈 Verificando regla 50%: ${evaluacionesBajas}/${totalEvaluaciones} (${porcentajeBajas.toFixed(1)}%)`);

        if (porcentajeBajas > 50 && this.proyecto.estado !== 'cerrado') {
            const mensaje = `Más del 50% de evaluaciones son menores a 70 (${porcentajeBajas.toFixed(1)}%)`;
            this.notificarProyectoCerrado(mensaje);
        }
    }

    registrarCambio(descripcion) {
        const cambio = {
            descripcion,
            timestamp: new Date().toISOString(),
            usuario: 'sistema'
        };
        
        if (!this.proyecto.historialCambios) {
            this.proyecto.historialCambios = [];
        }
        
        this.proyecto.historialCambios.push(cambio);
        this.cambios.push(cambio);
        
        this.notify('HISTORIAL_ACTUALIZADO', {
            proyecto: this.proyecto,
            cambio,
            totalCambios: this.proyecto.historialCambios.length
        });
    }

    // Métodos getter para acceder a propiedades del proyecto
    getId() {
        return this.proyecto.id;
    }

    getTitulo() {
        return this.proyecto.titulo;
    }

    getEstado() {
        return this.proyecto.estado;
    }

    getPresupuesto() {
        return this.proyecto.presupuesto;
    }

    getEvaluaciones() {
        return this.proyecto.evaluaciones || [];
    }

    getEstudiantes() {
        return this.proyecto.estudiantes || [];
    }

    getHistorialCambios() {
        return this.proyecto.historialCambios || [];
    }
}

export default ProyectoObservable;