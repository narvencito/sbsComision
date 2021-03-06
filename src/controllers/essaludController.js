'use strict'
const express = require('express');
const router = express.Router();
const url = 'http://ww4.essalud.gob.pe:7777/acredita/index.jsp';
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const eModel = require('../models/essalud.model');
const tesseract = require('tesseract.js');
const Axios = require('axios').default;
//const tokenApiDevNarv = '0470665df727241c9fcbd9ef019c6bfa1cd1376709c09a69d0e6452f93b0c5be';// correo @narvencito
const tokenApiDevNarv = '15728f3b3c06cc0ed0d008f0f381b99fa5331f1c15e1f90f3bb90d6aa4f032b6';// correo @em.
const path = require("path");
const { Console } = require('console');

router.post('/seguro', async (req, res) => {
  var pDni = req.body.dni;
  //var arr = [];
  // const browser = await puppeteer.launch({
  //   //ignoreHTTPSErrors: true,
  //   //headless: false,
  //   ignoreDefaultArgs: ['--disable-extensions'],
  //   'args': [
  //     '--no-sandbox',
  //     '--disable-setuid-sandbox',
  //   ]
  // });
  // const context = await browser.createIncognitoBrowserContext();
  // const page = await context.newPage();
  try {
            console.log("obteniendo fecha de nacimiento");
            await new Promise(r => setTimeout(r, 1000));
            console.log("iniciando");
            const config = {
                headers: { Authorization: `Bearer ${tokenApiDevNarv}` }
            };
            var model = new eModel();
            await Axios.get( 
              'https://apiperu.dev/api/dni/'+pDni,
              config
            )
            .then(resp => {
              var data = resp.data;
              model.nombres = data.data.nombres;
              model.apellidoMaterno = data.data.apellido_materno;
              model.apellidoPaterno = data.data.apellido_paterno;
              model.dni = data.data.numero;
              model.tipoAsegurado = null;
              model.codigo = null;
              model.tipoSeguro = null;
              model.centroSistencial = null;
              model.direccion = null;
              model.afiliado = null;
              model.fechaNacimiento = data.data.fecha_nacimiento;
            }).catch((err)=>console.log("error ", err));
 
      //     await page.goto(url, {timeout: 1000});
      //     await page.type('#BuscarPor', 'Tipo de Documento');
      //     await page.select('select[name="td"]', '1')
      //     await page.$eval('input[name="nd"]', (el, value) => el.value = value, pDni);
      //     const element = await page.$('#tdocumento');      
      //     await element.screenshot({path: 'captcha.jpg', clip: {x: 560, y: 265, width: 110, height: 35}});
      //     var code = null;
      //     var aux =false;
      //     var cont = 0;
      //   do{
      //       const worker = tesseract.createWorker();
      //       await (async () => {
      //       await worker.load();
      //       await worker.loadLanguage('eng');
      //       await worker.initialize('eng');
      //       const { data: { text } } = await worker.recognize('./captcha.jpg');
      //         code = text;
      //         if(code.trim().length === 5){
      //           aux = true;
      //         }else{
      //           aux = false;
      //           await page.reload(url);
      //           await page.type('#BuscarPor', 'Tipo de Documento');
      //           await page.select('select[name="td"]', '1')
      //           await page.$eval('input[name="nd"]', (el, value) => el.value = value, pDni);
      //           const element = await page.$('#tdocumento');      
      //           await element.screenshot({path: 'captcha.jpg', clip: {x: 560, y: 265, width: 110, height: 35}});
      //         }
      //       await worker.terminate();
      //     })();
      //     if(cont==1){
      //       console.log("ejecuntado error de contador");
      //       throw '';
      //     }
      //     cont++;
      //   }while(!aux);

      // await page.$eval('input[name="captchafield_doc"]', (el, value) => el.value = value, code);
      // const buttons = await page.$$('[name="submit"]');
      // await buttons[1].click();
      // await page.waitForNavigation();
      // var html = await page.content();
      // const $ = cheerio.load(html);
      // $('form > table > tbody > tr > td').toArray().map(item => {
      //   arr.push($(item).text())
      // });

      // var model = new eModel();
      // console.log("arr "+ arr.length);
      // if(arr.length == 1 || arr.length == 0){
      //     // llamada a apis
      //     console.log("llamada a apis");
      //   const config = {
      //       headers: { Authorization: `Bearer ${tokenApiDevNarv}` }
      //   };
        
      //   await Axios.get( 
      //     'https://apiperu.dev/api/dni/'+pDni,
      //     config
      //   ).then(resp => {
      //     var data = resp.data;
      //     model.nombres = data.data.nombres;
      //     model.apellidoMaterno = data.data.apellido_materno;
      //     model.apellidoPaterno = data.data.apellido_paterno;
      //     model.dni = data.data.numero;
      //     model.tipoAsegurado = null;
      //     model.codigo = null;
      //     model.tipoSeguro = null;
      //     model.centroSistencial = null;
      //     model.direccion = null;
      //     model.afiliado = null;
      //     model.fechaNacimiento = data.data.fecha_nacimiento;
      //   }).catch(e =>{
      //     console.log("error se servicio timeout", e);
      //   });
        

      // }else{
      // var currentdate = new Date();
      // var anio = arr[8].substring(0,2).trim();
      // var mes = arr[8].substring(2,4).trim();
      // var dia = arr[8].substring(4,6).trim();
      // var dif = parseInt(currentdate.getFullYear().toString().substring(2,4)) - parseInt(anio);
      //   for (var i = 0; i < arr.length; i++) {
      //     model.nombres = arr[2].trim().split(",")[1].trim();
      //     model.apellidoPaterno = arr[2].trim().split(",")[0].split(' ')[0];
      //     model.apellidoMaterno = arr[2].trim().split(",")[0].split(' ')[1];
      //     model.dni = arr[4].trim();
      //     model.tipoAsegurado = arr[6].trim();
      //     model.codigo = arr[8].trim();
      //     model.tipoSeguro = arr[12].trim();
      //     model.centroSistencial = arr[16].trim();
      //     model.direccion = arr[20].trim();
      //     model.afiliado = arr[24].trim();
      //     model.fechaNacimiento = dif < 0 ? "19"+anio+"-"+mes+"-"+dia:"20"+anio+"-"+mes+"-"+dia;
      //   }
      // }
       res.status(200).send({
         ok: true,
         data: model
       });

      // await context.close();
      // await browser.close();

    } catch (error) {
      console.log("error al obtener fecha de nacimiento", error);
      const config = {
        headers: { Authorization: `Bearer ${tokenApiDevNarv}` }
    };
    var model = new eModel();
    await Axios.get( 
      'https://apiperu.dev/api/dni/'+pDni,
      config
    ).then(resp => {
      var data = resp.data;
      console.log("data ", data);
      model.nombres = data.data.nombres;
      model.apellidoMaterno = data.data.apellido_materno;
      model.apellidoPaterno = data.data.apellido_paterno;
      model.dni = data.data.numero;
      model.tipoAsegurado = null;
      model.codigo = null;
      model.tipoSeguro = null;
      model.centroSistencial = null;
      model.direccion = null;
      model.afiliado = null;
      model.fechaNacimiento = data.data.fecha_nacimiento;
    }).catch(console.log);

      res.status(200).send({
        ok: true,
        data: model
      });

      // await context.close();
      // await browser.close();
    }
});


module.exports = router;