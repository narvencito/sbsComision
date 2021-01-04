'use strict'
const express = require('express');
const router = express.Router();
//const url = 'https://www2.sbs.gob.pe/afiliados/paginas/consulta.aspx';
const url = 'https://reportedeudas.sbs.gob.pe/afiliados/paginas/Consulta.aspx';
const puppeteer = require('puppeteer-extra');
const cheerio = require('cheerio');
const proxyChain = require('proxy-chain');
const aModel = require('../models/afiliado.model');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
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
  //const oldProxyUrl = 'http://auto:iWycxsC3644Hk4qsmkeKt8g65@proxy.apify.com:8000';
  //const newProxyUrl = await proxyChain.anonymizeProxy(oldProxyUrl);
  //console.log("pro ",newProxyUrl);
  const browser = await puppeteer.launch({
     //args: [ '--proxy-server=https://181.30.60.147:8080'],
    //args: [`--proxy-server=${urlprox}`],
    ignoreHTTPSErrors: true,
    ignoreDefaultArgs: ['--disable-extensions'],
    //headless: false,
    //headless: false,
    'args': [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--proxy-server=https=https://191.242.178.209:3128'
    ]
  });
  try {

    const page = await browser.newPage();
    //console.log("prox ", urlprox);
   // await useProxy(page, null);
    // const page2 = await browser.newPage();
    //await page.authenticate({ username, password });
    // //   await page.setExtraHTTPHeaders({
    // //     'Proxy-Authorization': 'Basic ' + Buffer.from(':').toString('base64'),
    // // });
    //   await page2.goto("https://www.cual-es-mi-ip.net", { waitUntil: 'networkidle0' });
    //   console.log("await");

    //   await new Promise(r => setTimeout(r, 350));
    //   console.log("continue");
    //   await page2.screenshot({ path: 'example.png' });
    //   var html = await page2.content();
    //   const $ = cheerio.load(html);
    //   console.log("==== ", $);

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
    console.log("data ", arr);
    if (arr.length > 0) {
      if (arr[6] == "Error: La consulta es sospechosa.") {
        console.log("consulta sopechosa");
        throw "";
      } else {
        status = true;
        msn = "registro encontrado";
        model.documento = arr[1];
        model.apellido_paterno = arr[2];
        model.apellido_materno = arr[4];
        model.primer_nombre = arr[6];
        model.nacionalidad = arr[7];
        model.segundo_nombre = arr[8];
        model.sexo = arr[12];
        model.lugar_residencia = arr[9] + "-" + arr[10] + "-" + arr[11];
        model.estado_civil = arr[13];
        model.cuss = arr[14];
        model.origen_afiliado = arr[15];
        model.situacion = arr[16];
        model.tipo_trabajador = arr[17];
        model.tipo_comision = arr[18];
        model.afp_actual = arr[19];
        model.fecha_defuncion = arr[20];
        model.fecha_afiliacion = arr[21];
      }

    } else {
      console.log("trabajador no registardo");
      model = null;
      msn = "registro no encontrado";
    }

    res.status(200).send({
      ok: status,
      result: model,
      message: msn
    });
    await context.close();
    //res.status(200).send({ok:true});
    await browser.close();
    //await proxyChain.closeAnonymizedProxy(newProxyUrl, true);

  } catch (error) {
    console.log("try error " + error);

    res.status(200).send({
      ok: false,
      result: null,
      message: "error"
    });
    await browser.close();
    //await proxyChain.closeAnonymizedProxy(newProxyUrl, true);
  }

});


module.exports = router;