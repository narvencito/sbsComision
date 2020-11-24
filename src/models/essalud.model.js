class essaludModel  {
  
    constructor(nombres, tipoAsegurado, dni, codigo, tipoSeguro , afiliado, centroSistencial, direccion, fechaNacimiento){
        this.nombres = nombres;
        this.tipoAsegurado = tipoAsegurado;
        this.dni = dni;
        this.codigo = codigo;
        this.tipoSeguro = tipoSeguro;
        this.afiliado = afiliado;
        this.centroSistencial = centroSistencial;
        this.direccion = direccion;
        this.fechaNacimiento = fechaNacimiento;
    }
}

module.exports = essaludModel;