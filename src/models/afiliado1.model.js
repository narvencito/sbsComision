class AfiliadoModel  {
  
    constructor(documento,nombres, apellido_paterno, apellido_materno, primer_nombre, segundo_nombre, sexo, nacionalidad, lugar_residencia, estado_civil, cuss, origen_afiliado, situacion, tipo_trabajador, afp_actual, tipo_comision, fecha_defuncion, fecha_afiliacion){
        this.documento = documento;
        this.apellido_paterno = apellido_paterno;
        this.apellido_materno = apellido_materno;
        this.primer_nombre = primer_nombre;
        this.segundo_nombre = segundo_nombre;
        this.sexo = sexo;
        this.nacionalidad = nacionalidad;
        this.lugar_residencia = lugar_residencia;
        this.estado_civil = estado_civil;
        this.cuss = cuss;
        this.origen_afiliado = origen_afiliado;
        this.situacion = situacion;
        this.tipo_comision = tipo_comision;
        this.tipo_trabajador = tipo_trabajador;
        this.afp_actual = afp_actual;
        this.fecha_afiliacion = fecha_afiliacion;
        this.fecha_defuncion = fecha_defuncion;
        this.nombres = nombres;
  }

}

module.exports = AfiliadoModel;