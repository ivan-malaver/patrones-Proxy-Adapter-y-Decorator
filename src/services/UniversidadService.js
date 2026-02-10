/**
 * Servicio principal que integra todos los componentes
 */
const Pais = require('../models/Pais');
const Estudiante = require('../models/Estudiante');
const Profesor = require('../models/Profesor');
const Curso = require('../models/Curso');
const Proyecto = require('../models/Proyecto');
const { SistemaExternoAdapter, ProyectoICCIS } = require('../estructurales/adapter/SistemaExternoAdapter');
const ProxyAccesoProyecto = require('../estructurales/proxy/ProxyAccesoProyecto');
const CertificacionCalidadDecorator = require('../estructurales/decorator/CertificacionCalidadDecorator');
const SeguimientoAmbientalDecorator = require('../estructurales/decorator/SeguimientoAmbientalDecorator');

class UniversidadService {
    constructor() {
        this.paises = Pais.obtenerPaisesSudamericanos();
        this.estudiantes = new Map();
        this.profesores = new Map();
        this.cursos = new Map();
        this.proyectos = new Map();
        this.proxyAcceso = new ProxyAccesoProyecto();
        
        this.inicializarDatos();
        console.log("🏫 Universidad UES Service inicializado");
    }
    
    inicializarDatos() {
        // Crear algunos datos de prueba
        this.crearDatosPrueba();
        
        // Cargar proyectos en el proxy
        const proyectosArray = Array.from(this.proyectos.values());
        this.proxyAcceso.obtenerAccesoReal().cargarProyectos(proyectosArray);
    }
    
    crearDatosPrueba() {
        // Estudiantes
        const estudiantesData = [
            { id: "EST-001", nombre: "Juan Pérez", email: "juan@ues.edu", pais: "CO" },
            { id: "EST-002", nombre: "María Gómez", email: "maria@ues.edu", pais: "PE" },
            { id: "EST-003", nombre: "Carlos López", email: "carlos@ues.edu", pais: "BR" },
            { id: "EST-004", nombre: "Ana Rodríguez", email: "ana@ues.edu", pais: "AR" },
            { id: "EST-005", nombre: "Luisa Fernández", email: "luisa@ues.edu", pais: "CL" }
        ];
        
        estudiantesData.forEach(data => {
            const estudiante = new Estudiante(data.id, data.nombre, data.email, data.pais);
            this.estudiantes.set(data.id, estudiante);
        });
        
        // Profesores
        const profesoresData = [
            { id: "PROF-001", nombre: "Dr. Roberto García", email: "rgarcia@ues.edu", facultad: "Ciencias Ambientales" },
            { id: "PROF-002", nombre: "Dra. Laura Méndez", email: "lmendez@ues.edu", facultad: "Biología" },
            { id: "PROF-003", nombre: "Dr. Javier Ruiz", email: "jruiz@ues.edu", facultad: "Ingeniería" }
        ];
        
        profesoresData.forEach(data => {
            const profesor = new Profesor(data.id, data.nombre, data.email, data.facultad);
            this.profesores.set(data.id, profesor);
        });
        
        // Cursos
        const cursosData = [
            { id: "CUR-001", nombre: "Biología Ambiental", codigo: "BIO401", creditos: 4, facultad: "Ciencias Ambientales" },
            { id: "CUR-002", nombre: "Ecología Amazonica", codigo: "ECO501", creditos: 3, facultad: "Biología" },
            { id: "CUR-003", nombre: "Gestión de Proyectos", codigo: "GES301", creditos: 4, facultad: "Ingeniería" }
        ];
        
        cursosData.forEach(data => {
            const curso = new Curso(data.id, data.nombre, data.codigo, data.creditos, data.facultad);
            this.cursos.set(data.id, curso);
        });
        
        // Proyectos base (luego serán decorados)
        const proyectosData = [
            {
                id: "PROY-001",
                titulo: "Conservación de Especies Endémicas",
                descripcion: "Proyecto para conservar especies en peligro en la Amazonía",
                facultad: "Ciencias Ambientales",
                presupuesto: 50000000,
                fechaInicio: "2024-01-15"
            },
            {
                id: "PROY-002", 
                titulo: "Energías Renovables en Comunidades Aisladas",
                descripcion: "Implementación de sistemas solares en comunidades amazónicas",
                facultad: "Ingeniería",
                presupuesto: 75000000,
                fechaInicio: "2024-02-01"
            }
        ];
        
        proyectosData.forEach(data => {
            const proyecto = new Proyecto(
                data.id,
                data.titulo,
                data.descripcion,
                data.facultad,
                data.presupuesto,
                data.fechaInicio
            );
            
            // Asignar algunos estudiantes
            proyecto.agregarEstudiante("EST-001");
            proyecto.agregarEstudiante("EST-002");
            proyecto.agregarEstudiante("EST-003");
            
            // Agregar algunas evaluaciones
            proyecto.agregarEvaluacion("EST-001", 85);
            proyecto.agregarEvaluacion("EST-002", 45); // Nota mala
            proyecto.agregarEvaluacion("EST-003", 90);
            
            this.proyectos.set(data.id, proyecto);
        });
    }
    
    // ==================== MÉTODOS ADAPTER ====================
    
    /**
     * Procesar proyecto recibido del ICCIS usando el Adapter
     */
    procesarProyectoICCIS(datosICCIS, facultadUES) {
        console.log("\n🔌 PROCESANDO PROYECTO ICCIS CON ADAPTER");
        
        // 1. Crear objeto en formato ICCIS
        const proyectoICCIS = new ProyectoICCIS(datosICCIS);
        console.log("📦 Proyecto ICCIS recibido:", proyectoICCIS.id_proyecto);
        
        // 2. Usar Adapter para convertir a formato UES
        const proyectoUES = SistemaExternoAdapter.convertirAUES(proyectoICCIS, facultadUES);
        console.log("🔄 Proyecto convertido a UES:", proyectoUES.id);
        
        // 3. Crear proyecto UES real
        const proyecto = new Proyecto(
            proyectoUES.id,
            proyectoUES.titulo,
            proyectoUES.descripcion,
            proyectoUES.facultad,
            proyectoUES.presupuesto,
            proyectoUES.fechaInicio
        );
        
        // 4. Guardar metadatos originales
        proyecto.datosICCIS = proyectoUES.datosOriginales;
        
        // 5. Guardar en el sistema
        this.proyectos.set(proyecto.id, proyecto);
        
        // 6. Actualizar proxy
        this.proxyAcceso.obtenerAccesoReal().cargarProyectos([proyecto]);
        
        console.log("✅ Proyecto ICCIS integrado exitosamente");
        return proyecto;
    }
    
    // ==================== MÉTODOS PROXY ====================
    
    /**
     * Usar Proxy para acceder a proyectos con control de acceso
     */
    accederProyecto(proyectoId, usuarioId) {
        console.log(`\n🛡️ ACCEDIENDO A PROYECTO USANDO PROXY`);
        console.log(`Usuario: ${usuarioId}, Proyecto: ${proyectoId}`);
        
        try {
            const proyecto = this.proxyAcceso.obtenerProyecto(proyectoId, usuarioId);
            console.log("✅ Acceso concedido");
            return proyecto;
        } catch (error) {
            console.error(`❌ Error de acceso: ${error.message}`);
            throw error;
        }
    }
    
    /**
     * Agregar evaluación usando Proxy (con validaciones)
     */
    agregarEvaluacionSegura(proyectoId, usuarioId, estudianteId, nota) {
        console.log(`\n📝 AGREGANDO EVALUACIÓN USANDO PROXY`);
        
        try {
            const resultado = this.proxyAcceso.agregarEvaluacion(
                proyectoId, 
                usuarioId, 
                estudianteId, 
                nota
            );
            console.log("✅ Evaluación agregada con validaciones");
            return resultado;
        } catch (error) {
            console.error(`❌ Error al agregar evaluación: ${error.message}`);
            throw error;
        }
    }
    
    // ==================== MÉTODOS DECORATOR ====================
    
    /**
     * Aplicar decorators de calidad a un proyecto
     */
    aplicarCertificacionCalidad(proyectoId) {
        console.log(`\n🏅 APLICANDO DECORATOR DE CALIDAD AL PROYECTO ${proyectoId}`);
        
        const proyecto = this.proyectos.get(proyectoId);
        if (!proyecto) {
            throw new Error(`Proyecto ${proyectoId} no encontrado`);
        }
        
        // 1. Aplicar decorator
        const proyectoConCalidad = new CertificacionCalidadDecorator(proyecto);
        
        // 2. Verificar estándares
        const verificacion = proyectoConCalidad.verificarEstandares();
        console.log(`📊 Estándares cumplidos: ${verificacion.cumplidos}/${verificacion.totalEstandares}`);
        
        // 3. Otorgar certificación si aplica
        if (verificacion.certificable) {
            proyectoConCalidad.otorgarCertificacion(
                "Calidad Académica UES", 
                "Comité de Calidad UES"
            );
            console.log("🏆 Certificación otorgada");
        }
        
        // 4. Registrar auditoría
        proyectoConCalidad.registrarAuditoria(
            "Sistema Automático",
            verificacion.certificable ? "APROBADO" : "PENDIENTE",
            "Auditoría inicial del sistema"
        );
        
        // 5. Reemplazar proyecto original con el decorado
        this.proyectos.set(proyectoId, proyectoConCalidad);
        
        return proyectoConCalidad;
    }
    
    /**
     * Aplicar decorator de seguimiento ambiental
     */
    aplicarSeguimientoAmbiental(proyectoId) {
        console.log(`\n🌿 APLICANDO DECORATOR AMBIENTAL AL PROYECTO ${proyectoId}`);
        
        const proyecto = this.proyectos.get(proyectoId);
        if (!proyecto) {
            throw new Error(`Proyecto ${proyectoId} no encontrado`);
        }
        
        // 1. Aplicar decorator (puede ser sobre otro decorator)
        const proyectoConAmbiental = new SeguimientoAmbientalDecorator(proyecto);
        
        // 2. Registrar métricas iniciales
        proyectoConAmbiental.registrarMetrica("huella_carbono", 450, "kg CO2");
        proyectoConAmbiental.registrarMetrica("agua_consumida", 3200, "litros");
        proyectoConAmbiental.registrarMetrica("residuos_generados", 180, "kg");
        
        // 3. Generar reporte inicial
        const reporte = proyectoConAmbiental.generarReporteSostenibilidad("mensual");
        console.log("📋 Reporte de sostenibilidad generado");
        
        // 4. Calcular puntaje
        const puntaje = proyectoConAmbiental.calcularPuntajeEcologico();
        console.log(`📈 Puntaje ecológico: ${puntaje}/100`);
        
        // 5. Reemplazar proyecto
        this.proyectos.set(proyectoId, proyectoConAmbiental);
        
        return { proyecto: proyectoConAmbiental, reporte, puntaje };
    }
    
    /**
     * Aplicar múltiples decorators
     */
    aplicarTodosDecorators(proyectoId) {
        console.log(`\n🎭 APLICANDO TODOS LOS DECORATORS AL PROYECTO ${proyectoId}`);
        
        let proyecto = this.proyectos.get(proyectoId);
        if (!proyecto) {
            throw new Error(`Proyecto ${proyectoId} no encontrado`);
        }
        
        // Aplicar decorator de calidad
        proyecto = new CertificacionCalidadDecorator(proyecto);
        
        // Aplicar decorator ambiental sobre el de calidad
        proyecto = new SeguimientoAmbientalDecorator(proyecto);
        
        // Actualizar en el sistema
        this.proyectos.set(proyectoId, proyecto);
        
        console.log("✅ Todos los decorators aplicados (anidados)");
        return proyecto;
    }
    
    // ==================== MÉTODOS DE CONSULTA ====================
    
    obtenerEstadisticas() {
        const proyectosArray = Array.from(this.proyectos.values());
        const proyectosCerrados = proyectosArray.filter(p => 
            p.estado === "cerrado" || (p.proyecto && p.proyecto.estado === "cerrado")
        ).length;
        
        const proyectosConProblemas = proyectosArray.filter(p => {
            const info = p.obtenerInfo();
            return info.porcentajeMalas && info.porcentajeMalas > 30;
        }).length;
        
        return {
            totalEstudiantes: this.estudiantes.size,
            totalProfesores: this.profesores.size,
            totalCursos: this.cursos.size,
            totalProyectos: this.proyectos.size,
            proyectosCerrados,
            proyectosConProblemas,
            proxyStats: this.proxyAcceso.obtenerEstadisticas()
        };
    }
    
    obtenerProyectosConDetalles() {
        const proyectos = [];
        
        for (const [id, proyecto] of this.proyectos) {
            proyectos.push({
                id,
                ...proyecto.obtenerInfo()
            });
        }
        
        return proyectos;
    }
    
    verificarRegla50PorCiento() {
        console.log("\n🔍 VERIFICANDO REGLA DEL 50% EN TODOS LOS PROYECTOS");
        
        const resultados = [];
        
        for (const [id, proyecto] of this.proyectos) {
            const info = proyecto.obtenerInfo();
            const cerrado = info.estado === "cerrado";
            const porcentajeMalas = info.porcentajeMalas || 0;
            
            resultados.push({
                proyectoId: id,
                titulo: info.titulo,
                totalEvaluaciones: info.totalEvaluaciones,
                porcentajeMalas: parseFloat(porcentajeMalas),
                estado: info.estado,
                cumpleRegla: porcentajeMalas > 50 ? "CIERRA" : "MANTIENE"
            });
        }
        
        return resultados;
    }
}

module.exports = UniversidadService;