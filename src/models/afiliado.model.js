class AfiliadoModel  {
  
    constructor(dni, apellidoPaterno, apellidoMaterno, primerNombre, segundoNombre, sexo, nacionalidad, lugarResidencia, estadoCivil, codigoAfiliado, origenAfiliado, situacionAfiliado, tipoTrabajador, afpActual, tipoComision, fechaDefuncion, fechaIngresoSpp){
          this.dni = dni;
          this.apellidoPaterno = apellidoPaterno;
          this.apellidoMaterno = apellidoMaterno;
          this.primerNombre = primerNombre;
          this.segundoNombre = segundoNombre;
          this.sexo = sexo;
          this.nacionalidad = nacionalidad;
          this.lugarResidencia = lugarResidencia;
          this.estadoCivil = estadoCivil;
          this.codigoAfiliado = codigoAfiliado;
          this.origenAfiliado = origenAfiliado;
          this.situacionAfiliado = situacionAfiliado;
          this.tipoComision = tipoComision;
          this.tipoTrabajador = tipoTrabajador;
          this.afpActual = afpActual;
          this.fechaIngresoSpp = fechaIngresoSpp;
          this.fechaDefuncion = fechaDefuncion;
    }
}

module.exports = AfiliadoModel;