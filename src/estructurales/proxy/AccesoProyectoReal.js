const AccesoProyecto = require('./AccesoProyecto');

/**
 * Implementación REAL del acceso a proyectos
 * Hace las operaciones directamente (sin validaciones)
 */
class AccesoProyectoReal extends AccesoProyecto {
    constructor() {
        super();
        this.proyectos = new Map(); // Simulación de base de datos
        console.log("✅ AccesoProyectoReal: Inicializando servicio real...");
    }
    
    // Método para simular carga de proyectos
    cargarProyectos(proyectos) {
        proyectos.forEach(proyecto => {
            this.proyectos.set(proyecto.id, proyecto);
        });
        console.log(`📚 Cargados ${proyectos.length} proyectos`);
    }
    
    obtenerProyecto(proyectoId, usuarioId) {
        console.log(`🔍 AccesoReal: Buscando proyecto ${proyectoId} para usuario ${usuarioId}`);
        
        // Simular latencia de base de datos
        this.simularLatencia();
        
        const proyecto = this.proyectos.get(proyectoId);
        if (!proyecto) {
            throw new Error(`Proyecto ${proyectoId} no encontrado`);
        }
        
        return proyecto;
    }
    
    agregarEvaluacion(proyectoId, usuarioId, estudianteId, nota) {
        console.log(`📝 AccesoReal: Agregando evaluación al proyecto ${proyectoId}`);
        
        const proyecto = this.proyectos.get(proyectoId);
        if (!proyecto) {
            throw new Error(`Proyecto ${proyectoId} no encontrado`);
        }
        
        proyecto.agregarEvaluacion(estudianteId, nota);
        return { 
            success: true, 
            mensaje: "Evaluación agregada",
            proyecto: proyecto.obtenerInfo()
        };
    }
    
    asignarProfesor(proyectoId, usuarioId, profesorId) {
        console.log(`👨‍🏫 AccesoReal: Asignando profesor ${profesorId} al proyecto ${proyectoId}`);
        
        const proyecto = this.proyectos.get(proyectoId);
        if (!proyecto) {
            throw new Error(`Proyecto ${proyectoId} no encontrado`);
        }
        
        proyecto.asignarProfesor(profesorId);
        return { 
            success: true, 
            mensaje: "Profesor asignado",
            proyecto: proyecto.obtenerInfo()
        };
    }
    
    simularLatencia() {
        // Simular operación costosa (50-150ms)
        const delay = 50 + Math.random() * 100;
        // En producción sería una Promise con setTimeout
    }
}

module.exports = AccesoProyectoReal;