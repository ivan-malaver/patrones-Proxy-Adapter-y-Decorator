const ProyectoDecorator = require('./ProyectoDecorator');

/**
 * DECORATOR para añadir certificación de calidad a proyectos
 * 
 * FUNCIONALIDADES AÑADIDAS:
 * 1. Verificar estándares de calidad
 * 2. Asignar certificaciones
 * 3. Generar reportes de calidad
 */
class CertificacionCalidadDecorator extends ProyectoDecorator {
    constructor(proyecto) {
        super(proyecto);
        this.certificaciones = [];
        this.auditorias = [];
        this.estandaresCumplidos = new Set();
        console.log("🏅 CertificaciónCalidadDecorator: Añadiendo módulo de calidad...");
    }
    
    // Añadir funcionalidad adicional: verificar estándares
    verificarEstandares() {
        const proyectoInfo = this.proyecto.obtenerInfo();
        const cumplidos = [];
        
        // Estándar 1: Mínimo 3 estudiantes
        if (proyectoInfo.totalEstudiantes >= 3) {
            this.estandaresCumplidos.add("MIN_ESTUDIANTES");
            cumplidos.push("Mínimo 3 estudiantes ✓");
        }
        
        // Estándar 2: Promedio >= 75
        const promedio = this.proyecto.calcularPromedio();
        if (promedio >= 75) {
            this.estandaresCumplidos.add("PROMEDIO_ALTO");
            cumplidos.push(`Promedio ${promedio.toFixed(1)} >= 75 ✓`);
        }
        
        // Estándar 3: Menos del 30% de notas malas
        const total = proyectoInfo.totalEvaluaciones;
        const malas = this.proyecto.evaluaciones?.filter(e => e.nota < 70).length || 0;
        const porcentajeMalas = total > 0 ? (malas / total) * 100 : 0;
        
        if (porcentajeMalas < 30) {
            this.estandaresCumplidos.add("BAJAS_REPROBADAS");
            cumplidos.push(`Solo ${porcentajeMalas.toFixed(1)}% reprobadas ✓`);
        }
        
        // Estándar 4: Profesor asignado
        if (proyectoInfo.profesorId) {
            this.estandaresCumplidos.add("PROFESOR_ASIGNADO");
            cumplidos.push("Profesor asignado ✓");
        }
        
        return {
            totalEstandares: 4,
            cumplidos: this.estandaresCumplidos.size,
            detalles: cumplidos,
            certificable: this.estandaresCumplidos.size >= 3
        };
    }
    
    // Añadir funcionalidad: otorgar certificación
    otorgarCertificacion(tipo, organismo) {
        const verificacion = this.verificarEstandares();
        
        if (!verificacion.certificable) {
            throw new Error("El proyecto no cumple los estándares para certificación");
        }
        
        const certificacion = {
            tipo,
            organismo,
            fecha: new Date().toISOString(),
            estandaresCumplidos: Array.from(this.estandaresCumplidos),
            validoHasta: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 año
        };
        
        this.certificaciones.push(certificacion);
        console.log(`🏆 Certificación ${tipo} otorgada por ${organismo}`);
        
        return certificacion;
    }
    
    // Añadir funcionalidad: registrar auditoría
    registrarAuditoria(auditor, resultado, observaciones) {
        const auditoria = {
            fecha: new Date().toISOString(),
            auditor,
            resultado,
            observaciones,
            estandaresVerificados: Array.from(this.estandaresCumplidos)
        };
        
        this.auditorias.push(auditoria);
        return auditoria;
    }
    
    // Sobreescribir obtenerInfo para incluir datos de calidad
    obtenerInfo() {
        const infoBase = super.obtenerInfo();
        const verificacion = this.verificarEstandares();
        
        return {
            ...infoBase,
            calidad: {
                estandaresCumplidos: verificacion.cumplidos,
                totalEstandares: verificacion.totalEstandares,
                certificable: verificacion.certificable,
                certificaciones: this.certificaciones.length,
                auditorias: this.auditorias.length
            }
        };
    }
    
    // Métodos adicionales del decorator
    obtenerCertificaciones() {
        return this.certificaciones;
    }
    
    obtenerAuditorias() {
        return this.auditorias;
    }
    
    estaCertificado() {
        return this.certificaciones.length > 0;
    }
}

module.exports = CertificacionCalidadDecorator;