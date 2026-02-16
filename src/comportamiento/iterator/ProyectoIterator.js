// src/comportamiento/iterator/ProyectoIterator.js

class ProyectoIterator {
    constructor(proyectos) {
        this.proyectos = proyectos;
        this.index = 0;
    }

    hasNext() {
        return this.index < this.proyectos.length;
    }

    next() {
        if (this.hasNext()) {
            const proyecto = this.proyectos[this.index];
            this.index++;
            return proyecto;
        }
        return null;
    }

    current() {
        if (this.index < this.proyectos.length) {
            return this.proyectos[this.index];
        }
        return null;
    }

    reset() {
        this.index = 0;
    }

    // Método para filtrar proyectos por estado
    filterByEstado(estado) {
        return this.proyectos.filter(proyecto => proyecto.estado === estado);
    }

    // Método para buscar proyectos por facultad
    filterByFacultad(facultad) {
        return this.proyectos.filter(proyecto => proyecto.facultad === facultad);
    }

    // Método para obtener proyectos con evaluaciones bajas (<70)
    getProyectosConEvaluacionesBajas() {
        return this.proyectos.filter(proyecto => {
            if (proyecto.evaluaciones && proyecto.evaluaciones.length > 0) {
                const bajas = proyecto.evaluaciones.filter(e => e.nota < 70);
                return bajas.length >= proyecto.evaluaciones.length * 0.5;
            }
            return false;
        });
    }

    // Método para ordenar proyectos por presupuesto
    orderByPresupuesto(ascendente = true) {
        const sorted = [...this.proyectos].sort((a, b) => {
            const presupuestoA = parseFloat(a.presupuesto) || 0;
            const presupuestoB = parseFloat(b.presupuesto) || 0;
            return ascendente ? presupuestoA - presupuestoB : presupuestoB - presupuestoA;
        });
        return new ProyectoIterator(sorted);
    }

    // Método para contar proyectos por tipo
    contarPorTipo() {
        const conteo = {};
        this.proyectos.forEach(proyecto => {
            const tipo = proyecto.tipo || 'General';
            conteo[tipo] = (conteo[tipo] || 0) + 1;
        });
        return conteo;
    }

    // Método para obtener estadísticas generales
    getEstadisticas() {
        if (this.proyectos.length === 0) {
            return {
                total: 0,
                promedioPresupuesto: 0,
                proyectosActivos: 0,
                proyectosCerrados: 0
            };
        }

        const totalPresupuesto = this.proyectos.reduce((sum, proyecto) => {
            return sum + (parseFloat(proyecto.presupuesto) || 0);
        }, 0);

        const proyectosActivos = this.proyectos.filter(p => p.estado === 'activo').length;
        const proyectosCerrados = this.proyectos.filter(p => p.estado === 'cerrado').length;

        return {
            total: this.proyectos.length,
            promedioPresupuesto: totalPresupuesto / this.proyectos.length,
            proyectosActivos,
            proyectosCerrados,
            porcentajeActivos: (proyectosActivos / this.proyectos.length) * 100
        };
    }

    // Método para convertir a array (útil para JSON)
    toArray() {
        return [...this.proyectos];
    }

    // Método para obtener un rango de proyectos
    slice(start, end) {
        return new ProyectoIterator(this.proyectos.slice(start, end));
    }
}

export default ProyectoIterator;