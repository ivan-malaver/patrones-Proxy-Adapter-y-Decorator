/**
 * PUNTO DE ENTRADA PRINCIPAL DEL SISTEMA UES
 * 
 * Este archivo demuestra el uso de todos los patrones estructurales:
 * 1. ADAPTER - Para integrar proyectos del ICCIS
 * 2. PROXY - Para controlar acceso a proyectos
 * 3. DECORATOR - Para añadir funcionalidades extra
 */

const UniversidadService = require('./services/UniversidadService');
const express = require('express');

class SistemaUES {
    constructor() {
        this.app = express();
        this.port = 3000;
        this.universidadService = new UniversidadService();
        
        this.configurarMiddleware();
        this.configurarRutas();
        this.demonstrarPatrones();
    }
    
    configurarMiddleware() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        
        // Middleware de logging
        this.app.use((req, res, next) => {
            console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
            next();
        });
    }
    
    configurarRutas() {
        // Ruta de prueba
        this.app.get('/', (req, res) => {
            res.json({
                mensaje: 'Sistema Universitario UES',
                version: '1.0.0',
                patrones: ['Adapter', 'Proxy', 'Decorator'],
                endpoints: [
                    'GET /api/proyectos',
                    'GET /api/estadisticas',
                    'POST /api/proyectos/iccsi',
                    'GET /api/regla-50'
                ]
            });
        });
        
        // Obtener todos los proyectos
        this.app.get('/api/proyectos', (req, res) => {
            try {
                const proyectos = this.universidadService.obtenerProyectosConDetalles();
                res.json({ success: true, total: proyectos.length, proyectos });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });
        
        // Obtener estadísticas
        this.app.get('/api/estadisticas', (req, res) => {
            try {
                const estadisticas = this.universidadService.obtenerEstadisticas();
                res.json({ success: true, estadisticas });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });
        
        // Procesar proyecto del ICCIS (Adapter)
        this.app.post('/api/proyectos/iccsi', (req, res) => {
            try {
                const { datosICCIS, facultad } = req.body;
                
                if (!datosICCIS || !facultad) {
                    return res.status(400).json({
                        success: false,
                        error: 'Se requieren datosICCIS y facultad'
                    });
                }
                
                const proyecto = this.universidadService.procesarProyectoICCIS(datosICCIS, facultad);
                res.json({ success: true, proyecto: proyecto.obtenerInfo() });
                
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });
        
        // Verificar regla del 50%
        this.app.get('/api/regla-50', (req, res) => {
            try {
                const resultados = this.universidadService.verificarRegla50PorCiento();
                res.json({ success: true, resultados });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });
        
        // Acceder a proyecto usando Proxy
        this.app.get('/api/proyectos/:id/acceder', (req, res) => {
            try {
                const { id } = req.params;
                const { usuarioId } = req.query;
                
                if (!usuarioId) {
                    return res.status(400).json({
                        success: false,
                        error: 'Se requiere usuarioId'
                    });
                }
                
                const proyecto = this.universidadService.accederProyecto(id, usuarioId);
                res.json({ success: true, proyecto: proyecto.obtenerInfo() });
                
            } catch (error) {
                res.status(403).json({ success: false, error: error.message });
            }
        });
    }
    
    demonstrarPatrones() {
        console.log('\n' + '='.repeat(60));
        console.log('🎓 SISTEMA UNIVERSITARIO UES - DEMOSTRACIÓN DE PATRONES');
        console.log('='.repeat(60) + '\n');
        
        this.demostrarAdapter();
        this.demostrarProxy();
        this.demostrarDecorator();
        this.demostrarRegla50PorCiento();
        
        console.log('\n' + '='.repeat(60));
        console.log('✅ DEMOSTRACIÓN COMPLETADA - SERVIDOR INICIANDO');
        console.log('='.repeat(60) + '\n');
    }
    
    demostrarAdapter() {
        console.log('\n1. 🎯 DEMOSTRANDO PATRÓN ADAPTER');
        console.log('   Problema: El ICCIS envía datos en formato diferente');
        console.log('   Solución: Adapter convierte entre formatos\n');
        
        // Datos de ejemplo del ICCIS
        const datosICCIS = {
            id_proyecto: "ICCIS-2024-042",
            titulo_completo: "Investigación sobre el impacto del cambio climático en la biodiversidad amazónica y su efecto en las comunidades locales",
            investigador_responsable: "Dr. Eduardo Silva",
            ubicacion_geografica: "Departamento del Amazonas, Colombia",
            presupuesto_total_usd: 120000.75,
            fecha_inicio: "01/02/2024",
            estado: "en_progreso"
        };
        
        console.log('   📥 Recibiendo proyecto del ICCIS...');
        console.log('   📦 Datos ICCIS:', {
            id: datosICCIS.id_proyecto,
            titulo: datosICCIS.titulo_completo.substring(0, 40) + '...',
            presupuesto: `USD ${datosICCIS.presupuesto_total_usd}`
        });
        
        // Usar el servicio para procesar (internamente usa el Adapter)
        const proyecto = this.universidadService.procesarProyectoICCIS(
            datosICCIS,
            "Ciencias Ambientales"
        );
        
        console.log('   ✅ Proyecto convertido e integrado:', proyecto.id);
        console.log('   💰 Presupuesto convertido a COP:', proyecto.presupuesto.toLocaleString());
    }
    
    demostrarProxy() {
        console.log('\n2. 🛡️ DEMOSTRANDO PATRÓN PROXY');
        console.log('   Problema: Necesitamos controlar acceso y validar operaciones');
        console.log('   Solución: Proxy actúa como intermediario con control\n');
        
        // Intentos de acceso con diferentes usuarios
        const intentos = [
            { usuarioId: "EST-001", accion: "Acceso normal (estudiante)" },
            { usuarioId: "PROF-001", accion: "Acceso como profesor" },
            { usuarioId: "ADM-001", accion: "Acceso como administrador" }
        ];
        
        intentos.forEach((intento, i) => {
            console.log(`   ${i + 1}. Intentando ${intento.accion}...`);
            try {
                const proyecto = this.universidadService.accederProyecto("PROY-001", intento.usuarioId);
                console.log(`      ✅ Acceso concedido a: ${proyecto.titulo.substring(0, 30)}...`);
            } catch (error) {
                console.log(`      ❌ Acceso denegado: ${error.message}`);
            }
        });
        
        // Intentar agregar evaluación sin permisos
        console.log('\n   🔍 Intentando agregar evaluación sin permisos...');
        try {
            this.universidadService.agregarEvaluacionSegura("PROY-001", "EST-001", "EST-002", 85);
            console.log('      ❌ ESTO NO DEBERÍA IMPRIMIRSE');
        } catch (error) {
            console.log(`      ✅ Correctamente bloqueado: ${error.message}`);
        }
        
        // Agregar evaluación con permisos
        console.log('\n   📝 Agregando evaluación con permisos de profesor...');
        try {
            const resultado = this.universidadService.agregarEvaluacionSegura("PROY-001", "PROF-001", "EST-001", 78);
            console.log(`      ✅ Evaluación agregada: ${resultado.mensaje}`);
        } catch (error) {
            console.log(`      ❌ Error: ${error.message}`);
        }
    }
    
    demostrarDecorator() {
        console.log('\n3. 🎨 DEMOSTRANDO PATRÓN DECORATOR');
        console.log('   Problema: Queremos añadir funcionalidades sin modificar clases');
        console.log('   Solución: Decorators envuelven objetos añadiendo comportamientos\n');
        
        // Aplicar decorator de calidad
        console.log('   🏅 Aplicando Decorator de Calidad...');
        try {
            const proyectoConCalidad = this.universidadService.aplicarCertificacionCalidad("PROY-001");
            const infoCalidad = proyectoConCalidad.obtenerInfo();
            console.log(`      ✅ Decorator aplicado`);
            console.log(`      📊 Estándares cumplidos: ${infoCalidad.calidad.estandaresCumplidos}/4`);
            console.log(`      🏆 Certificable: ${infoCalidad.calidad.certificable ? 'Sí' : 'No'}`);
        } catch (error) {
            console.log(`      ❌ Error: ${error.message}`);
        }
        
        // Aplicar decorator ambiental
        console.log('\n   🌿 Aplicando Decorator Ambiental...');
        try {
            const resultado = this.universidadService.aplicarSeguimientoAmbiental("PROY-002");
            const infoAmbiental = resultado.proyecto.obtenerInfo();
            console.log(`      ✅ Decorator aplicado`);
            console.log(`      📈 Puntaje ecológico: ${infoAmbiental.ambiental.puntajeEcologico}/100`);
            console.log(`      🌱 Sostenible: ${resultado.proyecto.esSostenible() ? 'Sí' : 'No'}`);
        } catch (error) {
            console.log(`      ❌ Error: ${error.message}`);
        }
        
        // Aplicar múltiples decorators anidados
        console.log('\n   🎭 Aplicando múltiples Decorators anidados...');
        try {
            const proyectoDecorado = this.universidadService.aplicarTodosDecorators("PROY-002");
            const infoCompleta = proyectoDecorado.obtenerInfo();
            console.log(`      ✅ ${Object.keys(infoCompleta).length} capas de funcionalidad añadidas`);
            console.log(`      📋 Tiene certificación: ${proyectoDecorado.estaCertificado() ? 'Sí' : 'No'}`);
            console.log(`      🌍 Tiene seguimiento ambiental: ${proyectoDecorado.esSostenible() ? 'Sí' : 'No'}`);
        } catch (error) {
            console.log(`      ❌ Error: ${error.message}`);
        }
    }
    
    demostrarRegla50PorCiento() {
        console.log('\n4. 📊 DEMOSTRANDO REGLA DEL 50% (Requisito del caso)');
        console.log('   Regla: Si >50% de notas son <70, el proyecto se cierra\n');
        
        // Crear un proyecto de prueba con muchas notas malas
        console.log('   🧪 Creando proyecto de prueba con malas calificaciones...');
        
        const Proyecto = require('./models/Proyecto');
        const proyectoPrueba = new Proyecto(
            "PROY-PRUEBA",
            "Proyecto con problemas de evaluación",
            "Proyecto para demostrar la regla del 50%",
            "Ciencias",
            1000000,
            "2024-01-01"
        );
        
        // Agregar 6 evaluaciones: 4 malas (<70), 2 buenas
        proyectoPrueba.agregarEstudiante("EST-001");
        proyectoPrueba.agregarEstudiante("EST-002");
        proyectoPrueba.agregarEstudiante("EST-003");
        proyectoPrueba.agregarEstudiante("EST-004");
        proyectoPrueba.agregarEstudiante("EST-005");
        proyectoPrueba.agregarEstudiante("EST-006");
        
        // 4 notas malas, 2 buenas = 66.6% malas > 50%
        proyectoPrueba.agregarEvaluacion("EST-001", 45);
        proyectoPrueba.agregarEvaluacion("EST-002", 50);
        proyectoPrueba.agregarEvaluacion("EST-003", 55);
        proyectoPrueba.agregarEvaluacion("EST-004", 60);  // Todas <70
        proyectoPrueba.agregarEvaluacion("EST-005", 85);
        proyectoPrueba.agregarEvaluacion("EST-006", 90);
        
        const info = proyectoPrueba.obtenerInfo();
        console.log(`   📈 Resultados:`);
        console.log(`      Total evaluaciones: ${info.totalEvaluaciones}`);
        console.log(`      % Notas <70: ${info.porcentajeMalas}%`);
        console.log(`      Estado: ${info.estado}`);
        console.log(`      🔥 CONCLUSIÓN: ${info.porcentajeMalas > 50 ? 'PROYECTO CERRADO ✓' : 'PROYECTO MANTENIDO'}`);
        
        // Limpiar proyecto de prueba
        this.universidadService.proyectos.delete("PROY-PRUEBA");
    }
    
    iniciar() {
        this.app.listen(this.port, () => {
            console.log('\n' + '='.repeat(60));
            console.log(`🚀 Servidor UES ejecutándose en http://localhost:${this.port}`);
            console.log('='.repeat(60));
            console.log('\n📌 Endpoints disponibles:');
            console.log(`   GET  http://localhost:${this.port}/`);
            console.log(`   GET  http://localhost:${this.port}/api/proyectos`);
            console.log(`   GET  http://localhost:${this.port}/api/estadisticas`);
            console.log(`   POST http://localhost:${this.port}/api/proyectos/iccsi`);
            console.log(`   GET  http://localhost:${this.port}/api/regla-50`);
            console.log(`   GET  http://localhost:${this.port}/api/proyectos/:id/acceder?usuarioId=...`);
            console.log('\n💡 Ejemplo de body para POST /api/proyectos/iccsi:');
            console.log(`   {
        "facultad": "Ciencias Ambientales",
        "datosICCIS": {
            "id_proyecto": "ICCIS-2024-001",
            "titulo_completo": "Estudio de biodiversidad...",
            "investigador_responsable": "Dr. Ejemplo",
            "ubicacion_geografica": "Amazonas",
            "presupuesto_total_usd": 50000,
            "fecha_inicio": "15/03/2024",
            "estado": "en_progreso"
        }
    }`);
            console.log('\n🎯 El sistema ya incluye datos de prueba para demostración.');
            console.log('='.repeat(60) + '\n');
        });
    }
}

// Iniciar el sistema
const sistema = new SistemaUES();
sistema.iniciar();

module.exports = sistema;