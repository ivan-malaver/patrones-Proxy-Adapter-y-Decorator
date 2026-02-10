const AccesoProyecto = require('./AccesoProyecto');

/**
 * PROXY para controlar el acceso a proyectos
 * 
 * FUNCIONALIDADES:
 * 1. Control de acceso basado en roles
 * 2. Cache para mejorar rendimiento
 * 3. Lazy loading del servicio real
 * 4. Logging de todas las operaciones
 * 5. Validación de datos
 */
class ProxyAccesoProyecto extends AccesoProyecto {
    constructor() {
        super();
        this.accesoReal = null;         // Lazy initialization
        this.cacheProyectos = new Map();
        this.cacheTiempo = new Map();   // Tiempo de cacheo
        this.logs = [];                 // Auditoría
        this.CACHE_DURACION = 5 * 60 * 1000; // 5 minutos
    }
    
    // Lazy loading: crear servicio real solo cuando sea necesario
    obtenerAccesoReal() {
        if (!this.accesoReal) {
            console.log("⚡ Proxy: Creando servicio real bajo demanda...");
            const AccesoProyectoReal = require('./AccesoProyectoReal');
            this.accesoReal = new AccesoProyectoReal();
        }
        return this.accesoReal;
    }
    
    // Registrar log de auditoría
    registrarLog(accion, usuarioId, proyectoId, detalles) {
        const log = {
            timestamp: new Date().toISOString(),
            accion,
            usuarioId,
            proyectoId,
            detalles,
            ip: "127.0.0.1" // En producción vendría del request
        };
        this.logs.push(log);
        console.log(`📋 Proxy Log [${log.timestamp}]: ${accion} por ${usuarioId}`);
    }
    
    // Verificar permisos según rol
    verificarPermisos(usuarioId, accion, proyecto) {
        const esAdmin = usuarioId.startsWith("ADM-");
        const esProfesor = usuarioId.startsWith("PROF-");
        const esEstudiante = usuarioId.startsWith("EST-");
        
        switch(accion) {
            case "OBTENER_PROYECTO":
                // Todos pueden ver proyectos
                return true;
                
            case "AGREGAR_EVALUACION":
                // Solo profesores del proyecto o admin
                if (esAdmin) return true;
                if (esProfesor && proyecto.profesorId === usuarioId) return true;
                return false;
                
            case "ASIGNAR_PROFESOR":
                // Solo admin o coordinadores
                if (esAdmin) return true;
                if (usuarioId.startsWith("COORD-")) return true;
                return false;
                
            default:
                return false;
        }
    }
    
    // Verificar si el cache ha expirado
    cacheExpirado(proyectoId) {
        if (!this.cacheTiempo.has(proyectoId)) return true;
        
        const tiempoCache = this.cacheTiempo.get(proyectoId);
        const ahora = Date.now();
        return (ahora - tiempoCache) > this.CACHE_DURACION;
    }
    
    obtenerProyecto(proyectoId, usuarioId) {
        this.registrarLog("OBTENER_PROYECTO", usuarioId, proyectoId, {});
        
        // 1. Verificar cache primero (si no ha expirado)
        if (this.cacheProyectos.has(proyectoId) && !this.cacheExpirado(proyectoId)) {
            console.log("⚡ Proxy: Retornando desde cache (rápido!)");
            return this.cacheProyectos.get(proyectoId);
        }
        
        // 2. Obtener servicio real
        const accesoReal = this.obtenerAccesoReal();
        
        // 3. Obtener proyecto real
        const proyecto = accesoReal.obtenerProyecto(proyectoId, usuarioId);
        
        // 4. Guardar en cache
        this.cacheProyectos.set(proyectoId, proyecto);
        this.cacheTiempo.set(proyectoId, Date.now());
        console.log("💾 Proxy: Proyecto guardado en cache");
        
        return proyecto;
    }
    
    agregarEvaluacion(proyectoId, usuarioId, estudianteId, nota) {
        this.registrarLog("AGREGAR_EVALUACION", usuarioId, proyectoId, { estudianteId, nota });
        
        // 1. Obtener proyecto para verificar permisos
        const proyecto = this.obtenerProyecto(proyectoId, usuarioId);
        
        // 2. Verificar permisos
        if (!this.verificarPermisos(usuarioId, "AGREGAR_EVALUACION", proyecto)) {
            throw new Error(`❌ Usuario ${usuarioId} no tiene permisos para agregar evaluaciones`);
        }
        
        // 3. Validar nota (0-100)
        if (nota < 0 || nota > 100) {
            throw new Error("La nota debe estar entre 0 y 100");
        }
        
        // 4. Verificar que el estudiante esté en el proyecto
        if (!proyecto.estudiantes.includes(estudianteId)) {
            throw new Error(`El estudiante ${estudianteId} no está en este proyecto`);
        }
        
        // 5. Delegar al servicio real
        const accesoReal = this.obtenerAccesoReal();
        const resultado = accesoReal.agregarEvaluacion(proyectoId, usuarioId, estudianteId, nota);
        
        // 6. Invalidar cache (los datos cambiaron)
        this.cacheProyectos.delete(proyectoId);
        console.log("🗑️ Proxy: Cache invalidado (datos modificados)");
        
        return resultado;
    }
    
    asignarProfesor(proyectoId, usuarioId, profesorId) {
        this.registrarLog("ASIGNAR_PROFESOR", usuarioId, proyectoId, { profesorId });
        
        // 1. Obtener proyecto
        const proyecto = this.obtenerProyecto(proyectoId, usuarioId);
        
        // 2. Verificar permisos
        if (!this.verificarPermisos(usuarioId, "ASIGNAR_PROFESOR", proyecto)) {
            throw new Error(`❌ Usuario ${usuarioId} no tiene permisos para asignar profesores`);
        }
        
        // 3. Verificar que el profesor no tenga ya un proyecto (REQUISITO)
        // En un sistema real, buscaríamos en la base de datos
        console.log(`🔍 Proxy: Verificando si profesor ${profesorId} ya tiene proyecto...`);
        
        // 4. Delegar al servicio real
        const accesoReal = this.obtenerAccesoReal();
        const resultado = accesoReal.asignarProfesor(proyectoId, usuarioId, profesorId);
        
        // 5. Invalidar cache
        this.cacheProyectos.delete(proyectoId);
        
        return resultado;
    }
    
    // Métodos adicionales del Proxy
    obtenerLogs() {
        return this.logs;
    }
    
    limpiarCache() {
        this.cacheProyectos.clear();
        this.cacheTiempo.clear();
        console.log("🧹 Proxy: Cache limpiado completamente");
    }
    
    obtenerEstadisticas() {
        return {
            proyectosEnCache: this.cacheProyectos.size,
            totalLogs: this.logs.length,
            cacheHits: this.logs.filter(l => l.detalles?.cacheHit).length,
            cacheMisses: this.logs.filter(l => l.detalles?.cacheMiss).length
        };
    }
}

module.exports = ProxyAccesoProyecto;