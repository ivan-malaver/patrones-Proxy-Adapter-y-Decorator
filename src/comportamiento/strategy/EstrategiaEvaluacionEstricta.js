// src/comportamiento/strategy/EstrategiaEvaluacionEstricta.js

import EstrategiaEvaluacion from './EstrategiaEvaluacion.js';

class EstrategiaEvaluacionEstricta extends EstrategiaEvaluacion {
    constructor() {
        super();
        this.notaMinima = 80;
        this.ponderaciones = {
            tecnica: 0.4,
            presentacion: 0.3,
            documentacion: 0.3
        };
    }

    calcularNotaFinal(evaluaciones) {
        if (!evaluaciones || evaluaciones.length === 0) {
            return 0;
        }

        // Solo considera evaluaciones recientes (últimas 3)
        const evaluacionesRecientes = evaluaciones.slice(-3);
        
        // Calcula promedio ponderado si hay componentes
        let notaFinal = 0;
        
        evaluacionesRecientes.forEach(evaluacion => {
            if (evaluacion.componentes) {
                const notaComponente = 
                    (evaluacion.componentes.tecnica || 0) * this.ponderaciones.tecnica +
                    (evaluacion.componentes.presentacion || 0) * this.ponderaciones.presentacion +
                    (evaluacion.componentes.documentacion || 0) * this.ponderaciones.documentacion;
                
                notaFinal += notaComponente;
            } else {
                notaFinal += evaluacion.nota || 0;
            }
        });

        return Math.min(100, notaFinal / evaluacionesRecientes.length);
    }

    validarEvaluacion(evaluacion) {
        const errores = [];
        
        // Validación estricta de nota
        if (evaluacion.nota < 0 || evaluacion.nota > 100) {
            errores.push('Nota debe estar entre 0 y 100');
        }
        
        // Requiere evaluador
        if (!evaluacion.evaluador || evaluacion.evaluador.trim() === '') {
            errores.push('Evaluador es requerido');
        }
        
        // Requiere comentario si nota es baja
        if (evaluacion.nota < 70 && (!evaluacion.comentarios || evaluacion.comentarios.trim() === '')) {
            errores.push('Comentario es requerido para notas menores a 70');
        }
        
        // Validación de componentes si existen
        if (evaluacion.componentes) {
            const componentes = ['tecnica', 'presentacion', 'documentacion'];
            componentes.forEach(componente => {
                if (evaluacion.componentes[componente] !== undefined) {
                    if (evaluacion.componentes[componente] < 0 || evaluacion.componentes[componente] > 100) {
                        errores.push(`Componente ${componente} debe estar entre 0 y 100`);
                    }
                }
            });
        }
        
        return {
            valida: errores.length === 0,
            errores
        };
    }

    determinarAprobacion(nota) {
        if (nota >= this.notaMinima) {
            return {
                aprobado: true,
                mensaje: 'Excelente desempeño',
                categoria: 'Sobresaliente'
            };
        } else if (nota >= 70) {
            return {
                aprobado: true,
                mensaje: 'Desempeño aceptable',
                categoria: 'Aprobado'
            };
        } else {
            return {
                aprobado: false,
                mensaje: 'No aprobado - requiere mejora',
                categoria: 'Reprobado'
            };
        }
    }

    aplicarPenalizaciones(nota, infracciones = []) {
        let notaConPenalizacion = nota;
        
        infracciones.forEach(infraccion => {
            switch(infraccion.tipo) {
                case 'retraso':
                    notaConPenalizacion -= 10; // 10 puntos por retraso
                    break;
                case 'incompleto':
                    notaConPenalizacion -= 15; // 15 puntos por entrega incompleta
                    break;
                case 'plagio':
                    notaConPenalizacion = 0; // Cero por plagio
                    break;
            }
        });
        
        return Math.max(0, notaConPenalizacion);
    }

    getDescripcion() {
        return 'Estrategia de evaluación estricta con alta exigencia (nota mínima 80)';
    }

    getRequisitos() {
        return [
            'Nota mínima para aprobación: 80',
            'Evaluador obligatorio',
            'Comentario requerido para notas < 70',
            'Validación estricta de componentes'
        ];
    }
}

export default EstrategiaEvaluacionEstricta;