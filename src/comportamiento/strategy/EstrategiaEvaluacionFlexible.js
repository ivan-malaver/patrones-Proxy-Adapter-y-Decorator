// src/comportamiento/strategy/EstrategiaEvaluacionFlexible.js

import EstrategiaEvaluacion from './EstrategiaEvaluacion.js';

class EstrategiaEvaluacionFlexible extends EstrategiaEvaluacion {
    constructor() {
        super();
        this.notaMinima = 60;
        this.bonificaciones = {
            participacion: 5,
            innovacion: 10,
            colaboracion: 5
        };
    }

    calcularNotaFinal(evaluaciones) {
        if (!evaluaciones || evaluaciones.length === 0) {
            return 0;
        }

        // Considera todas las evaluaciones
        let sumaNotas = 0;
        let mejorNota = 0;
        
        evaluaciones.forEach(evaluacion => {
            const notaActual = evaluacion.nota || 0;
            sumaNotas += notaActual;
            
            if (notaActual > mejorNota) {
                mejorNota = notaActual;
            }
        });

        // Promedio ponderado: 70% del mejor desempeño + 30% del promedio
        const promedio = sumaNotas / evaluaciones.length;
        const notaFinal = (mejorNota * 0.7) + (promedio * 0.3);
        
        return Math.min(100, notaFinal);
    }

    validarEvaluacion(evaluacion) {
        const errores = [];
        
        // Validación flexible de nota
        if (evaluacion.nota < 0 || evaluacion.nota > 100) {
            errores.push('Nota debe estar entre 0 y 100');
        }
        
        // Evaluador recomendado pero no obligatorio
        if (!evaluacion.evaluador || evaluacion.evaluador.trim() === '') {
            console.log('⚠️  Evaluador no especificado (permitido en modo flexible)');
        }
        
        return {
            valida: errores.length === 0,
            errores,
            advertencias: evaluacion.evaluador ? [] : ['Evaluador no especificado']
        };
    }

    determinarAprobacion(nota) {
        if (nota >= 85) {
            return {
                aprobado: true,
                mensaje: 'Desempeño excepcional',
                categoria: 'Excelente'
            };
        } else if (nota >= this.notaMinima) {
            return {
                aprobado: true,
                mensaje: 'Proyecto aprobado',
                categoria: 'Satisfactorio'
            };
        } else if (nota >= 50) {
            return {
                aprobado: false,
                mensaje: 'Aprobación condicional - requiere revisión',
                categoria: 'Condicional'
            };
        } else {
            return {
                aprobado: false,
                mensaje: 'No aprobado - requiere nueva presentación',
                categoria: 'Reprobado'
            };
        }
    }

    aplicarBonificaciones(nota, meritos = []) {
        let notaConBonificacion = nota;
        let bonificacionesAplicadas = [];
        
        meritos.forEach(merito => {
            switch(merito.tipo) {
                case 'participacion':
                    if (this.bonificaciones.participacion > 0) {
                        notaConBonificacion += this.bonificaciones.participacion;
                        bonificacionesAplicadas.push('Participación activa (+5)');
                    }
                    break;
                case 'innovacion':
                    if (this.bonificaciones.innovacion > 0) {
                        notaConBonificacion += this.bonificaciones.innovacion;
                        bonificacionesAplicadas.push('Innovación destacada (+10)');
                    }
                    break;
                case 'colaboracion':
                    if (this.bonificaciones.colaboracion > 0) {
                        notaConBonificacion += this.bonificaciones.colaboracion;
                        bonificacionesAplicadas.push('Colaboración efectiva (+5)');
                    }
                    break;
            }
        });
        
        return {
            notaFinal: Math.min(100, notaConBonificacion),
            bonificacionesAplicadas,
            totalBonificacion: Math.min(100, notaConBonificacion) - nota
        };
    }

    permitirRecuperacion(nota) {
        return nota >= 50 && nota < this.notaMinima;
    }

    sugerirMejoras(nota) {
        if (nota >= 80) {
            return ['Mantener el buen trabajo', 'Considerar publicación de resultados'];
        } else if (nota >= 60) {
            return ['Mejorar documentación', 'Profundizar en análisis de resultados'];
        } else {
            return ['Revisar metodología', 'Buscar asesoría', 'Repetir presentación'];
        }
    }

    getDescripcion() {
        return 'Estrategia de evaluación flexible con apoyo al estudiante (nota mínima 60)';
    }

    getCaracteristicas() {
        return [
            'Nota mínima para aprobación: 60',
            'Evaluador opcional',
            'Bonificaciones por méritos',
            'Permite recuperación',
            'Enfoque en mejora continua'
        ];
    }
}

export default EstrategiaEvaluacionFlexible;