const ProyectoDecorator = require('./ProyectoDecorator');

/**
 * DECORATOR para añadir seguimiento ambiental a proyectos
 * Especialmente útil para proyectos del ICCIS en la Amazonía
 * 
 * FUNCIONALIDADES AÑADIDAS:
 * 1. Monitoreo de impacto ambiental
 * 2. Reportes de sostenibilidad
 * 3. Indicadores ecológicos
 */
class SeguimientoAmbientalDecorator extends ProyectoDecorator {
    constructor(proyecto) {
        super(proyecto);
        this.metricasAmbientales = [];
        this.reportesSostenibilidad = [];
        this.impactosRegistrados = [];
        console.log("🌿 SeguimientoAmbientalDecorator: Añadiendo módulo ambiental...");
    }
    
    // Registrar métrica ambiental
    registrarMetrica(tipo, valor, unidad, fecha = new Date()) {
        const metrica = {
            tipo,           // Ej: "huella_carbono", "agua_consumida", "residuos_generados"
            valor,
            unidad,         // Ej: "kg CO2", "litros", "kg"
            fecha: fecha.toISOString(),
            proyectoId: this.proyecto.id
        };
        
        this.metricasAmbientales.push(metrica);
        console.log(`📊 Métrica ambiental registrada: ${tipo} = ${valor} ${unidad}`);
        
        // Verificar si excede límites
        this.verificarLimitesAmbientales(tipo, valor);
        
        return metrica;
    }
    
    // Verificar límites ambientales
    verificarLimitesAmbientales(tipo, valor) {
        const limites = {
            "huella_carbono": 1000,    // kg CO2 máximo
            "agua_consumida": 10000,   // litros máximo
            "residuos_generados": 500  // kg máximo
        };
        
        if (limites[tipo] && valor > limites[tipo]) {
            const impacto = {
                tipo: "EXCESO_AMBIENTAL",
                metrica: tipo,
                valor,
                limite: limites[tipo],
                fecha: new Date().toISOString(),
                severidad: valor > limites[tipo] * 2 ? "ALTA" : "MEDIA"
            };
            
            this.impactosRegistrados.push(impacto);
            console.log(`⚠️  Alerta ambiental: ${tipo} excede límite (${valor} > ${limites[tipo]})`);
            
            return impacto;
        }
        
        return null;
    }
    
    // Generar reporte de sostenibilidad
    generarReporteSostenibilidad(periodo) {
        const metricasPeriodo = this.metricasAmbientales.filter(m => {
            const fechaMetrica = new Date(m.fecha);
            const ahora = new Date();
            
            switch(periodo) {
                case "mensual":
                    return fechaMetrica.getMonth() === ahora.getMonth();
                case "trimestral":
                    return fechaMetrica.getMonth() >= ahora.getMonth() - 3;
                case "anual":
                    return fechaMetrica.getFullYear() === ahora.getFullYear();
                default:
                    return true;
            }
        });
        
        // Calcular totales
        const totalHuellaCarbono = metricasPeriodo
            .filter(m => m.tipo === "huella_carbono")
            .reduce((sum, m) => sum + m.valor, 0);
            
        const totalAgua = metricasPeriodo
            .filter(m => m.tipo === "agua_consumida")
            .reduce((sum, m) => sum + m.valor, 0);
            
        const totalResiduos = metricasPeriodo
            .filter(m => m.tipo === "residuos_generados")
            .reduce((sum, m) => sum + m.valor, 0);
        
        const reporte = {
            periodo,
            fechaGeneracion: new Date().toISOString(),
            metricas: {
                huellaCarbono: totalHuellaCarbono,
                aguaConsumida: totalAgua,
                residuosGenerados: totalResiduos
            },
            impactos: this.impactosRegistrados.filter(i => 
                new Date(i.fecha) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            ),
            recomendaciones: this.generarRecomendaciones(totalHuellaCarbono, totalAgua, totalResiduos)
        };
        
        this.reportesSostenibilidad.push(reporte);
        return reporte;
    }
    
    // Generar recomendaciones basadas en métricas
    generarRecomendaciones(huellaCarbono, agua, residuos) {
        const recomendaciones = [];
        
        if (huellaCarbono > 500) {
            recomendaciones.push("Considerar usar energías renovables para reducir huella de carbono");
        }
        
        if (agua > 5000) {
            recomendaciones.push("Implementar sistema de recolección de agua lluvia");
        }
        
        if (residuos > 250) {
            recomendaciones.push("Establecer programa de reciclaje y compostaje");
        }
        
        if (huellaCarbono < 100 && agua < 1000 && residuos < 50) {
            recomendaciones.push("Proyecto con excelente desempeño ambiental");
        }
        
        return recomendaciones;
    }
    
    // Calcular puntaje ecológico
    calcularPuntajeEcologico() {
        const ultimoMes = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const metricasRecientes = this.metricasAmbientales.filter(m => 
            new Date(m.fecha) >= ultimoMes
        );
        
        if (metricasRecientes.length === 0) return 0;
        
        let puntaje = 100;
        
        // Penalizar por excesos
        this.impactosRegistrados.forEach(impacto => {
            if (new Date(impacto.fecha) >= ultimoMes) {
                puntaje -= impacto.severidad === "ALTA" ? 20 : 10;
            }
        });
        
        // Bonificar por bajas emisiones
        const huellaCarbono = metricasRecientes
            .filter(m => m.tipo === "huella_carbono")
            .reduce((sum, m) => sum + m.valor, 0);
            
        if (huellaCarbono < 100) puntaje += 10;
        if (huellaCarbono < 50) puntaje += 5;
        
        return Math.max(0, Math.min(100, puntaje));
    }
    
    // Sobreescribir obtenerInfo para incluir datos ambientales
    obtenerInfo() {
        const infoBase = super.obtenerInfo();
        const puntajeEcologico = this.calcularPuntajeEcologico();
        
        return {
            ...infoBase,
            ambiental: {
                puntajeEcologico,
                totalMetricas: this.metricasAmbientales.length,
                totalImpactos: this.impactosRegistrados.length,
                totalReportes: this.reportesSostenibilidad.length,
                ultimoReporte: this.reportesSostenibilidad.length > 0 
                    ? this.reportesSostenibilidad[this.reportesSostenibilidad.length - 1].fechaGeneracion
                    : null
            }
        };
    }
    
    // Métodos adicionales del decorator
    obtenerMetricasAmbientales() {
        return this.metricasAmbientales;
    }
    
    obtenerImpactosRegistrados() {
        return this.impactosRegistrados;
    }
    
    obtenerReportesSostenibilidad() {
        return this.reportesSostenibilidad;
    }
    
    esSostenible() {
        return this.calcularPuntajeEcologico() >= 70;
    }
}

module.exports = SeguimientoAmbientalDecorator;