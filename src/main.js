/**
 * PUNTO DE ENTRADA PRINCIPAL DEL SISTEMA UES
 * 
 * Este archivo demuestra el uso de todos los patrones estructurales y de comportamiento:
 * 1. ADAPTER - Para integrar proyectos del ICCIS
 * 2. PROXY - Para controlar acceso a proyectos
 * 3. DECORATOR - Para añadir funcionalidades extra
 * 4. BEHAVIORAL PATTERNS - Observer, Strategy, Iterator
 */

const UniversidadService = require('./services/UniversidadService');
const DemoComportamiento = require('./demoComportamiento');
const express = require('express');

class SistemaUES {
    constructor() {
        this.app = express();
        this.port = 3000;
        this.universidadService = new UniversidadService();
        this.demoComportamiento = new DemoComportamiento(this.universidadService);
        
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
                patrones: ['Adapter', 'Proxy', 'Decorator', 'Observer', 'Strategy', 'Iterator'],
                endpoints: [
                    'GET /api/proyectos',
                    'GET /api/estadisticas',
                    'POST /api/proyectos/iccsi',
                    'GET /api/regla-50',
                    'GET /api/patrones/comportamiento'
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

        // Endpoint para demostrar patrones de comportamiento
        this.app.get('/api/patrones/comportamiento', (req, res) => {
            try {
                const { patron } = req.query;
                let resultados;

                switch(patron) {
                    case 'observer':
                        resultados = this.demoComportamiento.demostrarObserver();
                        break;
                    case 'strategy':
                        resultados = this.demoComportamiento.demostrarStrategy();
                        break;
                    case 'iterator':
                        resultados = this.demoComportamiento.demostrarIterator();
                        break;
                    default:
                        resultados = this.demoComportamiento.ejecutar();
                }

                res.json({ 
                    success: true, 
                    patron: patron || 'todos',
                    resultados 
                });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });
    }
    
    demonstrarPatrones() {
        console.log('\n' + '='.repeat(80));
        console.log('🎓 SISTEMA UNIVERSITARIO UES - DEMOSTRACIÓN DE PATRONES ESTRUCTURALES');
        console.log('='.repeat(80) + '\n');
        
        this.demostrarAdapter();
        this.demostrarProxy();
        this.demostrarDecorator();
        this.demostrarRegla50PorCiento();
        
        console.log('\n' + '='.repeat(80));
        console.log('✅ DEMOSTRACIÓN PATRONES ESTRUCTURALES COMPLETADA');
        console.log('='.repeat(80) + '\n');

        // Agregar una pausa antes de mostrar patrones de comportamiento
        console.log('\n⏳ Preparando demostración de patrones de comportamiento...\n');
        
        // Usar setTimeout para que sea más legible en la consola
        setTimeout(() => {
            console.log('\n🎭 ' + '='.repeat(80));
            console.log('🎭 DEMOSTRACIÓN PATRONES DE COMPORTAMIENTO (Unidad 3)');
            console.log('🎭 ' + '='.repeat(80) + '\n');
            
            // Ejecutar demostración de patrones de comportamiento
            this.demoComportamiento.ejecutar();
            
            console.log('\n🎭 ' + '='.repeat(80));
            console.log('🎭 DEMOSTRACIÓN COMPORTAMIENTO COMPLETADA');
            console.log('🎭 ' + '='.repeat(80) + '\n');
            
            // Mostrar mensaje final
            this.mostrarResumenFinal();
        }, 2000);
    }
    
    mostrarResumenFinal() {
        console.log('\n📋 ' + '='.repeat(80));
        console.log('📋 RESUMEN FINAL - SISTEMA UES COMPLETO');
        console.log('📋 ' + '='.repeat(80));
        console.log('\n✅ PATRONES IMPLEMENTADOS:');
        console.log('   └── Estructurales: Adapter, Proxy, Decorator');
        console.log('   └── Comportamiento: Observer, Strategy, Iterator');
        
        console.log('\n🎯 FUNCIONALIDADES DEL SISTEMA:');
        console.log('   └── Gestión de proyectos ICCIS con Adapter');
        console.log('   └── Control de acceso con Proxy');
        console.log('   └── Extensión de funcionalidad con Decorator');
        console.log('   └── Notificaciones automáticas con Observer');
        console.log('   └── Algoritmos configurables con Strategy');
        console.log('   └── Recorrido flexible con Iterator');
        console.log('   └── Regla del 50% automática');
        
        console.log('\n🌐 ENDPOINTS DISPONIBLES:');
        console.log('   GET  http://localhost:3000/');
        console.log('   GET  http://localhost:3000/api/proyectos');
        console.log('   GET  http://localhost:3000/api/estadisticas');
        console.log('   POST http://localhost:3000/api/proyectos/iccsi');
        console.log('   GET  http://localhost:3000/api/regla-50');
        console.log('   GET  http://localhost:3000/api/patrones/comportamiento');
        console.log('   GET  http://localhost:3000/api/patrones/comportamiento?patron=observer');
        console.log('   GET  http://localhost:3000/api/patrones/comportamiento?patron=strategy');
        console.log('   GET  http://localhost:3000/api/patrones/comportamiento?patron=iterator');
        
        console.log('\n💡 USO ACADÉMICO:');
        console.log('   Este sistema cumple con todos los requisitos del Caso Práctico:');
        console.log('   1. Gestión de cursos, estudiantes, profesores y proyectos');
        console.log('   2. Implementación de patrones de diseño');
        console.log('   3. Regla del 50% para cierre de proyectos');
        console.log('   4. Integración ICCIS-UES');
        console.log('   5. Arquitectura escalable');
        
        console.log('\n' + '='.repeat(80) + '\n');
    }
    
    demostrarAdapter() {
        console.log('\n1. 🎯 PATRÓN ADAPTER');
        console.log('   Problema: El ICCIS envía datos en formato diferente');
        console.log('   Solución: Adapter convierte entre formatos\n');
        
        const datosICCIS = {
            id_proyecto: "ICCIS-2024-042",
            titulo_completo: "Investigación sobre biodiversidad amazónica",
            investigador_responsable: "Dr. Eduardo Silva",
            ubicacion_geografica: "Amazonas",
            presupuesto_total_usd: 120000.75,
            fecha_inicio: "01/02/2024",
            estado: "en_progreso"
        };
        
        console.log('   📥 Recibiendo proyecto del ICCIS...');
        const proyecto = this.universidadService.procesarProyectoICCIS(
            datosICCIS,
            "Ciencias Ambientales"
        );
        
        console.log(`   ✅ Proyecto integrado: ${proyecto.id}`);
        console.log(`   💰 Presupuesto convertido: COP ${proyecto.presupuesto.toLocaleString()}`);
    }
    
    demostrarProxy() {
        console.log('\n2. 🛡️ PATRÓN PROXY');
        console.log('   Problema: Controlar acceso y validar operaciones\n');
        
        const intentos = [
            { usuarioId: "EST-001", accion: "Acceso estudiante" },
            { usuarioId: "PROF-001", accion: "Acceso profesor" }
        ];
        
        intentos.forEach((intento, i) => {
            console.log(`   ${i + 1}. ${intento.accion}...`);
            try {
                const proyecto = this.universidadService.accederProyecto("PROY-001", intento.usuarioId);
                console.log(`      ✅ Acceso concedido`);
            } catch (error) {
                console.log(`      ❌ Denegado: ${error.message}`);
            }
        });
    }
    
    demostrarDecorator() {
        console.log('\n3. 🎨 PATRÓN DECORATOR');
        console.log('   Problema: Añadir funcionalidades sin modificar clases\n');
        
        console.log('   🏅 Aplicando Decorator de Calidad...');
        try {
            const proyectoConCalidad = this.universidadService.aplicarCertificacionCalidad("PROY-001");
            console.log(`      ✅ Decorator aplicado`);
        } catch (error) {
            console.log(`      ❌ Error: ${error.message}`);
        }
    }
    
    demostrarRegla50PorCiento() {
        console.log('\n4. 📊 REGLA DEL 50% (Requisito del caso)');
        console.log('   Regla: Si >50% de notas son <70, el proyecto se cierra\n');
        
        const Proyecto = require('./models/Proyecto');
        const proyectoPrueba = new Proyecto(
            "PROY-PRUEBA",
            "Proyecto de prueba",
            "Demostración regla 50%",
            "Ciencias",
            1000000,
            "2024-01-01"
        );
        
        proyectoPrueba.agregarEstudiante("EST-001");
        proyectoPrueba.agregarEstudiante("EST-002");
        proyectoPrueba.agregarEstudiante("EST-003");
        
        proyectoPrueba.agregarEvaluacion("EST-001", 45);
        proyectoPrueba.agregarEvaluacion("EST-002", 50);
        proyectoPrueba.agregarEvaluacion("EST-003", 85);
        
        const info = proyectoPrueba.obtenerInfo();
        console.log(`   📈 Resultados:`);
        console.log(`      % Notas <70: ${info.porcentajeMalas}%`);
        console.log(`      Estado: ${info.estado}`);
        console.log(`      🔥 CONCLUSIÓN: ${info.porcentajeMalas > 50 ? 'PROYECTO CERRADO ✓' : 'PROYECTO MANTENIDO'}`);
        
        this.universidadService.proyectos.delete("PROY-PRUEBA");
    }
    
    iniciar() {
        this.app.listen(this.port, () => {
            console.log('\n' + '='.repeat(80));
            console.log(`🚀 Servidor UES ejecutándose en http://localhost:${this.port}`);
            console.log('='.repeat(80));
            console.log('\n📌 Para probar patrones de comportamiento vía API:');
            console.log(`   GET http://localhost:${this.port}/api/patrones/comportamiento`);
            console.log(`   GET http://localhost:${this.port}/api/patrones/comportamiento?patron=observer`);
            console.log(`   GET http://localhost:${this.port}/api/patrones/comportamiento?patron=strategy`);
            console.log(`   GET http://localhost:${this.port}/api/patrones/comportamiento?patron=iterator`);
            console.log('\n🎯 El sistema completo demuestra 6 patrones de diseño diferentes');
            console.log('='.repeat(80) + '\n');
        });
    }
}

// Iniciar el sistema
const sistema = new SistemaUES();
sistema.iniciar();

module.exports = sistema;