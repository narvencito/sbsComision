'use strict'
const express = require('express');
const router = express.Router();
//const url = 'https://www2.sbs.gob.pe/afiliados/paginas/consulta.aspx';
const url = 'https://reportedeudas.sbs.gob.pe/afiliados/paginas/Consulta.aspx';
const puppeteer = require('puppeteer-extra');
const cheerio = require('cheerio');
const aModel = require('../models/afiliado.model');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
// const StealthPlugin = require('puppeteer-extra-plugin-stealth')
// puppeteer.use(StealthPlugin());
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha')
puppeteer.use(
 // StealthPlugin(),
  RecaptchaPlugin({
     provider: {
       id: '2captcha',
       token: '2d8bccd99cb847be44e3daefbf85a50f', // REPLACE THIS WITH YOUR OWN 2CAPTCHA API KEY ⚡
     },
    visualFeedback: true, // colorize reCAPTCHAs (violet = detected, green = solved)
  })
);

router.post('/spp', async (req, res) => {
  console.log("inicio consulta spp");
  var pDni = req.body.dni;
  var arr = [];
  var status = false;
  var msn = "";
  try {
      const browser = await puppeteer.launch({
        headless: false,
        'args': [
          '--no-sandbox',
          '--disable-setuid-sandbox',
        ]
      });
      
      const page = await browser.newPage();
      await page.goto(url);
      await page.focus('#cphContent_txtDocumento');
      await page.evaluate(val => document.querySelector('#cphContent_txtDocumento').value = val, pDni);
      await Promise.all([
           page.solveRecaptchas(),
           page.waitForNavigation(),
           page.click('#cphContent_btnBuscar'),
         ]);
      var html = await page.content();
      const $ = cheerio.load(html);
      $('tr > td > span').toArray().map(item => {
        arr.push($(item).text().trim())
      });
      var model = new aModel();
      console.log("data ",arr);
      if(arr.length > 0){
        if(arr[6]=="Error: La consulta es sospechosa."){
          console.log("consulta sopechosa");
          throw "";
        }else{
          status = true;
          msn = "registro encontrado";
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
        
      }else{
        console.log("trabajador no registardo");
        model = null;
        msn="registro no encontrado";
      }
      
      res.status(200).send({
        ok: status,
        data: model,
        message: msn
      });
      //await context.close();
      await browser.close();

    } catch (error) {
    console.log("try error " + error);
    res.status(200).send({
      ok: false,
      data: null,
      message: "error"
    });
  }

});


module.exports = router;