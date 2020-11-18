'use strict'
const express = require('express');
const router = express.Router();
const url = 'https://www2.sbs.gob.pe/afiliados/paginas/consulta.aspx';
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const aModel = require('../models/afiliado.model');

router.post('/spp', async (req, res) => {
  console.log("inicio consulta spp");
  var pDni = req.body.dni;
  console.log("DNI "+ pDni);
  var arr = [];
  try {
      const browser = await puppeteer.launch({
        'args': [
          '--no-sandbox',
          '--disable-setuid-sandbox'
        ]
      });
      const page = await browser.newPage();
      await page.goto(url);
      console.log((Math.random()*(1.5-0.25)).toFixed(2)*100);
      await page.waitFor((Math.random()*(1.5-0.25)).toFixed(2)*100);
      console.log("init 2");
      await page.evaluate(val => document.querySelector('#cphContent_txtDocumento').value = val, pDni);
      await page.click('input[type="submit"]', {waitUntil: 'domcontentloaded'});
      await page.waitForNavigation();
      var html = await page.content();
      const $ = cheerio.load(html);
      $('tr > td > span').toArray().map(item => {
        arr.push($(item).text().trim())
      });
      var model = new aModel();
      if(arr.length > 0){
        model.dni = arr[1];
        model.apellidoPaterno = arr[2];
        model.apellidoMaterno = arr[4];
        model.primerNombre = arr[6];
        model.nacionalidad = arr[7];
        model.segundoNombre = arr[8];
        model.sexo = arr[12];
        model.lugarResidencia = arr[9] +"-"+arr[10]+"-"+arr[11];
        model.estadoCivil = arr[13];
        model.codigoAfiliado = arr[14];
        model.origenAfiliado = arr[15];
        model.situacionAfiliado = arr[16];
        model.tipoTrabajador = arr[17];
        model.tipoComision = arr[18];
        model.afpActual = arr[19];
        model.fechaDefuncion = arr[20];
        model.fechaIngresoSpp = arr[21];
      }
      
      res.status(200).send({
        ok: true,
        data: model
      });
      await browser.close();

    } catch (error) {
    console.log("try error " + error);
  }

});


module.exports = router;