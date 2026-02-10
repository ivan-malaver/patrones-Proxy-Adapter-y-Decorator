/**
 * ADAPTER para conectar el sistema del ICCIS con la UES
 * 
 * PROBLEMA: El ICCIS envía datos en formato JSON diferente al que usa la UES
 * SOLUCIÓN: Adapter convierte entre los dos formatos
 */

// FORMATO ICCIS (externo)
class ProyectoICCIS {
    constructor(datosICCIS) {
        this.id_proyecto = datosICCIS.id_proyecto;
        this.titulo_completo = datosICCIS.titulo_completo;
        this.investigador_responsable = datosICCIS.investigador_responsable;
        this.ubicacion_geografica = datosICCIS.ubicacion_geografica;
        this.presupuesto_total_usd = datosICCIS.presupuesto_total_usd;
        this.fecha_inicio_icc = datosICCIS.fecha_inicio; // Formato: "DD/MM/YYYY"
        this.estado_icc = datosICCIS.estado;
    }

    obtenerFormatoICCIS() {
        return {
            id_proyecto: this.id_proyecto,
            titulo_completo: this.titulo_completo,
            investigador_responsable: this.investigador_responsable,
            ubicacion_geografica: this.ubicacion_geografica,
            presupuesto_total_usd: this.presupuesto_total_usd,
            fecha_inicio: this.fecha_inicio_icc,
            estado: this.estado_icc
        };
    }
}

// ADAPTER (el traductor)
class SistemaExternoAdapter {
    /**
     * Convierte un proyecto del ICCIS al formato de la UES
     * @param {ProyectoICCIS} proyectoICCIS - Proyecto en formato ICCIS
     * @param {string} facultadUES - Facultad destino en la UES
     * @returns {Object} Proyecto en formato UES
     */
    static convertirAUES(proyectoICCIS, facultadUES) {
        console.log(`🔄 Adaptador: Convirtiendo proyecto ${proyectoICCIS.id_proyecto} a formato UES`);
        
        // 1. Convertir fecha de "DD/MM/YYYY" a "YYYY-MM-DD"
        const fechaParts = proyectoICCIS.fecha_inicio_icc.split('/');
        const fechaUES = `${fechaParts[2]}-${fechaParts[1]}-${fechaParts[0]}`;
        
        // 2. Convertir presupuesto de USD a COP (tasa aproximada)
        const presupuestoCOP = proyectoICCIS.presupuesto_total_usd * 4000;
        
        // 3. Acortar título si es muy largo
        const tituloUES = proyectoICCIS.titulo_completo.length > 100
            ? proyectoICCIS.titulo_completo.substring(0, 97) + "..."
            : proyectoICCIS.titulo_completo;
        
        // 4. Mapear estado ICCIS a estado UES
        const estadoMap = {
            "activo": "activo",
            "en_progreso": "activo",
            "finalizado": "completado",
            "cancelado": "cancelado"
        };
        const estadoUES = estadoMap[proyectoICCIS.estado_icc] || "pendiente";
        
        return {
            id: `UES-${proyectoICCIS.id_proyecto}`,
            titulo: tituloUES,
            descripcion: `Proyecto del ICCIS: ${proyectoICCIS.titulo_completo}`,
            facultad: facultadUES,
            presupuesto: Math.round(presupuestoCOP),
            fechaInicio: fechaUES,
            datosOriginales: {
                idICCIS: proyectoICCIS.id_proyecto,
                investigador: proyectoICCIS.investigador_responsable,
                ubicacion: proyectoICCIS.ubicacion_geografica,
                presupuestoUSD: proyectoICCIS.presupuesto_total_usd
            }
        };
    }
    
    /**
     * Convierte datos de la UES al formato del ICCIS (para reportes)
     * @param {Object} proyectoUES - Proyecto en formato UES
     * @returns {Object} Datos en formato ICCIS
     */
    static convertirAICCIS(proyectoUES) {
        console.log(`🔁 Adaptador: Convirtiendo proyecto ${proyectoUES.id} a formato ICCIS`);
        
        // Extraer ID original del ICCIS
        const idICCIS = proyectoUES.id.replace('UES-', '');
        
        // Convertir presupuesto de COP a USD
        const presupuestoUSD = proyectoUES.presupuesto / 4000;
        
        // Convertir fecha de "YYYY-MM-DD" a "DD/MM/YYYY"
        const fechaParts = proyectoUES.fechaInicio.split('-');
        const fechaICCIS = `${fechaParts[2]}/${fechaParts[1]}/${fechaParts[0]}`;
        
        return {
            id_proyecto: idICCIS,
            titulo_completo: proyectoUES.descripcion.replace('Proyecto del ICCIS: ', ''),
            investigador_responsable: `Profesor UES asignado`,
            ubicacion_geografica: "Amazonía Colombiana",
            presupuesto_total_usd: presupuestoUSD.toFixed(2),
            fecha_inicio: fechaICCIS,
            estado: proyectoUES.estado === "cerrado" ? "finalizado" : "en_progreso",
            notas_adicionales: "Proyecto adaptado al sistema UES"
        };
    }
    
    /**
     * Convierte múltiples proyectos del ICCIS
     * @param {Array} proyectosICCIS - Lista de proyectos ICCIS
     * @param {string} facultadUES - Facultad destino
     * @returns {Array} Proyectos convertidos
     */
    static convertirLoteAUES(proyectosICCIS, facultadUES) {
        return proyectosICCIS.map(proyectoICCIS => 
            this.convertirAUES(proyectoICCIS, facultadUES)
        );
    }
}

// Ejemplo de uso (para pruebas)
if (require.main === module) {
    // Datos de ejemplo del ICCIS
    const datosICCIS = {
        id_proyecto: "ICCIS-2024-015",
        titulo_completo: "Estudio de biodiversidad en la región amazónica con énfasis en especies endémicas y su relación con el cambio climático global",
        investigador_responsable: "Dra. Laura Méndez Fernández",
        ubicacion_geografica: "Amazonas, Colombia",
        presupuesto_total_usd: 85000.50,
        fecha_inicio: "15/03/2024",
        estado: "en_progreso"
    };
    
    const proyectoICCIS = new ProyectoICCIS(datosICCIS);
    console.log("📦 Proyecto ICCIS original:", proyectoICCIS.obtenerFormatoICCIS());
    
    // Usar el Adapter para convertir
    const proyectoUES = SistemaExternoAdapter.convertirAUES(
        proyectoICCIS, 
        "Ciencias Ambientales"
    );
    
    console.log("\n🎓 Proyecto UES convertido:");
    console.log(JSON.stringify(proyectoUES, null, 2));
    
    // Convertir de vuelta
    const datosDeVuelta = SistemaExternoAdapter.convertirAICCIS(proyectoUES);
    console.log("\n🔁 Convertido de vuelta a ICCIS:");
    console.log(JSON.stringify(datosDeVuelta, null, 2));
}

module.exports = { ProyectoICCIS, SistemaExternoAdapter };