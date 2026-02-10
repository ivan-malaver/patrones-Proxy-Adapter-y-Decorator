/**
 * DECORATOR BASE para proyectos
 * Todos los decorators específicos heredan de esta clase
 */
class ProyectoDecorator {
    constructor(proyecto) {
        if (!proyecto) {
            throw new Error("Se requiere un proyecto para decorar");
        }
        this.proyecto = proyecto;
    }
    
    // Métodos que deben ser implementados por decorators concretos
    obtenerInfo() {
        return this.proyecto.obtenerInfo();
    }
    
    agregarEvaluacion(estudianteId, nota) {
        return this.proyecto.agregarEvaluacion(estudianteId, nota);
    }
    
    calcularPromedio() {
        return this.proyecto.calcularPromedio();
    }
    
    verificarEstado() {
        return this.proyecto.verificarEstado();
    }
}

module.exports = ProyectoDecorator;