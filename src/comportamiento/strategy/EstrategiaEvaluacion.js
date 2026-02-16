// src/comportamiento/strategy/EstrategiaEvaluacion.js

class EstrategiaEvaluacion {
    calcularNotaFinal(evaluaciones) {
        throw new Error('Método calcularNotaFinal() debe ser implementado');
    }

    validarEvaluacion(evaluacion) {
        throw new Error('Método validarEvaluacion() debe ser implementado');
    }

    determinarAprobacion(nota) {
        throw new Error('Método determinarAprobacion() debe ser implementado');
    }

    getNombre() {
        return this.constructor.name;
    }

    getDescripcion() {
        return 'Estrategia base de evaluación';
    }
}

export default EstrategiaEvaluacion;