/**
 * Modelo para representar un país
 * Cada estudiante tiene un país de origen
 */
class Pais {
    constructor(codigo, nombre, continente) {
        this.codigo = codigo;           // Ej: "CO", "PE", "BR"
        this.nombre = nombre;           // Ej: "Colombia", "Perú", "Brasil"
        this.continente = continente;   // Ej: "América del Sur"
    }

    obtenerInfo() {
        return `${this.nombre} (${this.codigo}) - ${this.continente}`;
    }

    static obtenerPaisesSudamericanos() {
        return [
            new Pais("AR", "Argentina", "América del Sur"),
            new Pais("BO", "Bolivia", "América del Sur"),
            new Pais("BR", "Brasil", "América del Sur"),
            new Pais("CL", "Chile", "América del Sur"),
            new Pais("CO", "Colombia", "América del Sur"),
            new Pais("EC", "Ecuador", "América del Sur"),
            new Pais("PE", "Perú", "América del Sur"),
            new Pais("PY", "Paraguay", "América del Sur"),
            new Pais("UY", "Uruguay", "América del Sur"),
            new Pais("VE", "Venezuela", "América del Sur")
        ];
    }
}

module.exports = Pais;