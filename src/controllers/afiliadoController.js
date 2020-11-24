'use strict'
const express = require('express');
const router = express.Router();
const url = 'https://www2.sbs.gob.pe/afiliados/paginas/consulta.aspx';
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const aModel = require('../models/afiliado.model');
// const StealthPlugin = require('puppeteer-extra-plugin-stealth')
// puppeteer.use(StealthPlugin());

router.post('/spp', async (req, res) => {
  console.log("inicio consulta spp");
  var pDni = req.body.dni;
  var arr = [];
  try {
      const browser = await puppeteer.launch({
        //ignoreHTTPSErrors: true,
        headless: false,
        //slowMo: 25,
        //ignoreDefaultArgs: ['--disable-extensions'],
        'args': [
          '--no-sandbox',
          '--disable-setuid-sandbox',
         // '--ignore-certificate-errors'
        ]
      });
      const context = await browser.createIncognitoBrowserContext();
      const page = await context.newPage();
      //await page.setUserAgent('5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');
      await page.goto(url);
      await page.focus('#cphContent_txtDocumento');
      await new Promise(r => setTimeout(r, 550));
      await page.evaluate(val => document.querySelector('#cphContent_txtDocumento').value = val, pDni);
      await new Promise(r => setTimeout(r, 550));
      await page.click('input[type="submit"]', {waitUntil: 'domcontentloaded'});
      await page.waitForNavigation({delay:350});
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
      await context.close();
      await browser.close();

    } catch (error) {
    console.log("try error " + error);
  }

});


module.exports = router;