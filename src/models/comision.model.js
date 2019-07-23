
class ComisionModel  {
  
      constructor(IdRegimenPensionario,DenominacionRegimen, ComisionFija,ComisionFlujo,ComisionFlujoMixta,ComisionSaldo,PrimaSeguro,AporteObligatorio,RemuneracionTope){
            this.IdRegimenPensionario= IdRegimenPensionario;
            this.DenominacionRegimen = DenominacionRegimen;
            this.ComisionFija= ComisionFija;
            this.ComisionFlujo= ComisionFlujo;
            this.ComisionFlujoMixta =ComisionFlujoMixta;
            this.ComisionSaldo= ComisionSaldo;
            this.PrimaSeguro = PrimaSeguro;
            this.AporteObligatorio = AporteObligatorio;
            this.RemuneracionTope= RemuneracionTope;
      }
}

module.exports = ComisionModel;