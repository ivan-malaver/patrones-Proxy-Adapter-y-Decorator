// src/demoComportamiento.js

import ProyectoIterator from './comportamiento/iterator/ProyectoIterator.js';
import ProyectoObservable from './comportamiento/observer/ProyectoObservable.js';
import NotificadorEmail from './comportamiento/observer/NotificadorEmail.js';
import EstrategiaEvaluacionEstricta from './comportamiento/strategy/EstrategiaEvaluacionEstricta.js';
import EstrategiaEvaluacionFlexible from './comportamiento/strategy/EstrategiaEvaluacionFlexible.js';

class DemoComportamiento {
    constructor() {
        console.log('🎭 ==============================================');
        console.log('🎭 DEMOSTRACIÓN PATRONES DE COMPORTAMIENTO');
        console.log('🎭 ==============================================\n');
        
        this.proyectosDemo = this.crearProyectosDemo();
        this.configurarObservers();
        this.configurarStrategies();
    }

    crearProyectosDemo() {
        return [
            {
                id: 'PROY-001',
                titulo: 'Inteligencia Artificial para Diagnóstico Médico',
                facultad: 'Ingeniería de Sistemas',
                estado: 'activo',
                presupuesto: '150000000',
                tipo: 'Investigación',
                evaluaciones: [
                    { nota: 85, evaluador: 'Dr. García', fecha: '2024-01-15' },
                    { nota: 78, evaluador: 'Dra. Martínez', fecha: '2024-02-10' }
                ],
                estudiantes: [
                    { id: 'EST-001', nombre: 'Carlos Ruiz', pais: 'Colombia' },
                    { id: 'EST-002', nombre: 'Ana Gómez', pais: 'Perú' }
                ]
            },
            {
                id: 'PROY-002',
                titulo: 'Energías Renovables en Zonas Rurales',
                facultad: 'Ingeniería Ambiental',
                estado: 'activo',
                presupuesto: '95000000',
                tipo: 'Desarrollo',
                evaluaciones: [
                    { nota: 92, evaluador: 'Dr. López', fecha: '2024-01-20' },
                    { nota: 88, evaluador: 'Dra. Rodríguez', fecha: '2024-02-05' }
                ],
                estudiantes: [
                    { id: 'EST-003', nombre: 'Miguel Torres', pais: 'Ecuador' },
                    { id: 'EST-004', nombre: 'Laura Vargas', pais: 'Chile' }
                ]
            },
            {
                id: 'PROY-003',
                titulo: 'Aplicación Móvil para Educación Inclusiva',
                facultad: 'Ingeniería de Software',
                estado: 'cerrado',
                presupuesto: '75000000',
                tipo: 'Desarrollo',
                evaluaciones: [
                    { nota: 45, evaluador: 'Dr. Pérez', fecha: '2024-01-10' },
                    { nota: 55, evaluador: 'Dra. Sánchez', fecha: '2024-01-25' },
                    { nota: 60, evaluador: 'Dr. Ramírez', fecha: '2024-02-01' }
                ],
                estudiantes: [
                    { id: 'EST-005', nombre: 'David Castro', pais: 'Argentina' }
                ]
            }
        ];
    }

    configurarObservers() {
        // Crear observables para cada proyecto
        this.observables = this.proyectosDemo.map(proyecto => 
            new ProyectoObservable(proyecto)
        );

        // Crear notificadores
        this.notificadorDirector = new NotificadorEmail(
            'Director de Investigación',
            'director.investigacion@ues.edu'
        );
        
        this.notificadorCoordinador = new NotificadorEmail(
            'Coordinador de Proyectos',
            'coordinador.proyectos@ues.edu'
        );
        
        this.notificadorProfesor = new NotificadorEmail(
            'Profesor Responsable',
            'profesor.responsable@ues.edu'
        );

        // Configurar preferencias
        this.notificadorProfesor.setPreferencias({
            evaluaciones: true,
            estado: false,
            presupuesto: false,
            estudiantes: true,
            cierres: true
        });

        // Adjuntar observadores a los proyectos
        this.observables.forEach(observable => {
            observable.attach(this.notificadorDirector);
            observable.attach(this.notificadorCoordinador);
            observable.attach(this.notificadorProfesor);
        });
    }

    configurarStrategies() {
        this.estrategiaEstricta = new EstrategiaEvaluacionEstricta();
        this.estrategiaFlexible = new EstrategiaEvaluacionFlexible();
    }

    demostrarIterator() {
        console.log('\n🎯 1. PATRÓN ITERATOR - Recorrido y filtrado de proyectos\n');
        
        const iterator = new ProyectoIterator(this.proyectosDemo);
        
        console.log('📊 Recorriendo todos los proyectos:');
        iterator.reset();
        while (iterator.hasNext()) {
            const proyecto = iterator.next();
            console.log(`   • ${proyecto.id}: ${proyecto.titulo} (${proyecto.estado})`);
        }
        
        console.log('\n📈 Estadísticas generales:');
        const stats = iterator.getEstadisticas();
        console.log(`   Total proyectos: ${stats.total}`);
        console.log(`   Promedio presupuesto: $${stats.promedioPresupuesto.toLocaleString()}`);
        console.log(`   Proyectos activos: ${stats.proyectosActivos}`);
        console.log(`   Proyectos cerrados: ${stats.proyectosCerrados}`);
        
        console.log('\n🔍 Proyectos con evaluaciones bajas (regla 50%):');
        const proyectosBajos = iterator.getProyectosConEvaluacionesBajas();
        if (proyectosBajos.length > 0) {
            proyectosBajos.forEach(proyecto => {
                console.log(`   ⚠️  ${proyecto.id}: ${proyecto.titulo}`);
            });
        } else {
            console.log('   ✅ Ningún proyecto cumple con la regla del 50%');
        }
        
        console.log('\n🏷️  Conteo por tipo de proyecto:');
        const conteoTipos = iterator.contarPorTipo();
        Object.entries(conteoTipos).forEach(([tipo, cantidad]) => {
            console.log(`   ${tipo}: ${cantidad} proyecto(s)`);
        });
    }

    demostrarObserver() {
        console.log('\n👁️  2. PATRÓN OBSERVER - Notificaciones automáticas\n');
        
        const primerProyecto = this.observables[0];
        
        console.log('📝 Agregando nueva evaluación al proyecto:');
        const nuevaEvaluacion = {
            nota: 72,
            evaluador: 'Dr. Fernández',
            fecha: new Date().toISOString(),
            comentarios: 'Buen trabajo pero requiere mejor documentación'
        };
        
        primerProyecto.notificarNuevaEvaluacion(nuevaEvaluacion);
        
        console.log('\n👨‍🎓 Agregando nuevo estudiante:');
        const nuevoEstudiante = {
            id: 'EST-006',
            nombre: 'Sofía Mendoza',
            pais: 'Uruguay'
        };
        
        primerProyecto.notificarEstudianteAgregado(nuevoEstudiante);
        
        console.log('\n💰 Actualizando presupuesto:');
        primerProyecto.notificarPresupuestoActualizado('180000000');
        
        console.log('\n📊 Estadísticas de notificaciones:');
        const statsDirector = this.notificadorDirector.getEstadisticasNotificaciones();
        console.log(`   Director: ${statsDirector.total} notificaciones (${statsDirector.noLeidas} no leídas)`);
        
        const statsProfesor = this.notificadorProfesor.getEstadisticasNotificaciones();
        console.log(`   Profesor: ${statsProfesor.total} notificaciones (${statsProfesor.noLeidas} no leídas)`);
        
        console.log('\n🚫 Probando cierre por regla del 50%:');
        const proyectoConBajas = this.observables[2];
        
        // Agregar evaluaciones bajas para disparar la regla
        const evaluacionesBajas = [
            { nota: 65, evaluador: 'Dr. Evaluador', fecha: new Date().toISOString() },
            { nota: 68, evaluador: 'Dra. Evaluadora', fecha: new Date().toISOString() }
        ];
        
        evaluacionesBajas.forEach(eval => {
            proyectoConBajas.notificarNuevaEvaluacion(eval);
        });
    }

    demostrarStrategy() {
        console.log('\n🎯 3. PATRÓN STRATEGY - Diferentes estrategias de evaluación\n');
        
        const proyectoEvaluar = this.proyectosDemo[0];
        const evaluaciones = proyectoEvaluar.evaluaciones;
        
        console.log('📋 Evaluando proyecto con estrategia ESTRICTA:');
        console.log(`   Estrategia: ${this.estrategiaEstricta.getDescripcion()}`);
        
        const validacionEstricta = this.estrategiaEstricta.validarEvaluacion(evaluaciones[0]);
        console.log(`   Validación: ${validacionEstricta.valida ? '✅ Válida' : '❌ Inválida'}`);
        if (validacionEstricta.errores.length > 0) {
            validacionEstricta.errores.forEach(error => console.log(`     - ${error}`));
        }
        
        const notaFinalEstricta = this.estrategiaEstricta.calcularNotaFinal(evaluaciones);
        const resultadoEstricto = this.estrategiaEstricta.determinarAprobacion(notaFinalEstricta);
        console.log(`   Nota final: ${notaFinalEstricta.toFixed(1)}`);
        console.log(`   Resultado: ${resultadoEstricto.aprobado ? '✅ ' : '❌ '}${resultadoEstricto.mensaje}`);
        
        console.log('\n📋 Evaluando proyecto con estrategia FLEXIBLE:');
        console.log(`   Estrategia: ${this.estrategiaFlexible.getDescripcion()}`);
        
        const validacionFlexible = this.estrategiaFlexible.validarEvaluacion(evaluaciones[0]);
        console.log(`   Validación: ${validacionFlexible.valida ? '✅ Válida' : '❌ Inválida'}`);
        if (validacionFlexible.advertencias && validacionFlexible.advertencias.length > 0) {
            validacionFlexible.advertencias.forEach(adv => console.log(`     ⚠️  ${adv}`));
        }
        
        const notaFinalFlexible = this.estrategiaFlexible.calcularNotaFinal(evaluaciones);
        const resultadoFlexible = this.estrategiaFlexible.determinarAprobacion(notaFinalFlexible);
        console.log(`   Nota final: ${notaFinalFlexible.toFixed(1)}`);
        console.log(`   Resultado: ${resultadoFlexible.aprobado ? '✅ ' : '❌ '}${resultadoFlexible.mensaje}`);
        
        // Aplicar bonificaciones
        const meritos = [
            { tipo: 'participacion' },
            { tipo: 'innovacion' }
        ];
        
        const resultadoBonificado = this.estrategiaFlexible.aplicarBonificaciones(notaFinalFlexible, meritos);
        console.log(`\n🏅 Con bonificaciones:`);
        console.log(`   Nota base: ${notaFinalFlexible.toFixed(1)}`);
        resultadoBonificado.bonificacionesAplicadas.forEach(bono => {
            console.log(`   ${bono}`);
        });
        console.log(`   Nota final: ${resultadoBonificado.notaFinal.toFixed(1)}`);
        
        console.log('\n💡 Sugerencias de mejora:');
        const sugerencias = this.estrategiaFlexible.sugerirMejoras(resultadoBonificado.notaFinal);
        sugerencias.forEach((sugerencia, index) => {
            console.log(`   ${index + 1}. ${sugerencia}`);
        });
    }

    demostrarIntegracion() {
        console.log('\n🔗 4. INTEGRACIÓN DE PATRONES\n');
        
        console.log('🔄 Usando Iterator para filtrar y Observer para notificar:');
        const iterator = new ProyectoIterator(this.proyectosDemo);
        const proyectosIngenieria = iterator.filterByFacultad('Ingeniería de Sistemas');
        
        proyectosIngenieria.forEach(proyecto => {
            const observable = new ProyectoObservable(proyecto);
            observable.attach(this.notificadorDirector);
            
            console.log(`\n📋 Proyecto ${proyecto.id}:`);
            console.log(`   Título: ${proyecto.titulo}`);
            console.log(`   Estrategia aplicada: ${proyecto.tipo === 'Investigación' ? 'Estricta' : 'Flexible'}`);
            
            // Simular actualización
            observable.notificarPresupuestoActualizado(
                (parseInt(proyecto.presupuesto) * 1.1).toString()
            );
        });
        
        console.log('\n📊 Resumen de integración:');
        console.log('   • Iterator: Recorre y filtra proyectos eficientemente');
        console.log('   • Observer: Notifica cambios automáticamente a interesados');
        console.log('   • Strategy: Aplica diferentes criterios de evaluación');
        console.log('   • Combinación: Sistema robusto y mantenible');
    }

    ejecutar() {
        console.log('🚀 Iniciando demostración de patrones de comportamiento...\n');
        
        this.demostrarIterator();
        this.demostrarObserver();
        this.demostrarStrategy();
        this.demostrarIntegracion();
        
        console.log('\n🎉 ==============================================');
        console.log('🎉 DEMOSTRACIÓN COMPLETADA EXITOSAMENTE');
        console.log('🎉 ==============================================');
        console.log('\n📚 Patrones implementados:');
        console.log('   1. Iterator: Recorrido estructurado de colecciones');
        console.log('   2. Observer: Notificaciones automáticas de cambios');
        console.log('   3. Strategy: Intercambio dinámico de algoritmos');
        console.log('\n💡 Beneficios demostrados:');
        console.log('   • Código más modular y reutilizable');
        console.log('   • Fácil extensión de funcionalidades');
        console.log('   • Desacoplamiento entre componentes');
        console.log('   • Mantenibilidad mejorada');
    }
}

// Ejecutar demostración
const demo = new DemoComportamiento();
demo.ejecutar();