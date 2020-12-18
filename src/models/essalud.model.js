class essaludModel  {
  
    constructor(nombres, apellidoPaterno, apellidoMaterno, tipoAsegurado, dni, codigo, tipoSeguro , afiliado, centroSistencial, direccion, fechaNacimiento){
        this.nombres = nombres;
        this.apellidoMaterno = apellidoMaterno;
        this.apellidoPaterno = apellidoPaterno;
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