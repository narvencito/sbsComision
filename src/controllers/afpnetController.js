'use strict'
const express = require('express');
const router = express.Router();
const urlAfpnet = 'https://www.afpnet.com.pe';
const urlComisiones = 'https://comision-sbs.herokuapp.com/comision/sbs';
const puppeteer = require('puppeteer');
const tesseract = require('tesseract.js');// para lectura de codigo
const Excel = require('exceljs');

const aModel = require('../models/afiliado1.model');
const ruc = "20494637074";
const user = "ADM0001";
const password = "101010";
const Axios = require('axios').default;

////para la descarga del archivo de exel de la pagina
const mkdirp = require('mkdirp');
const path = require('path');
const myDownloadPath = path.resolve("file");
mkdirp(myDownloadPath);

router.post('/spp', async (req, res) => {
  console.log("inicio consulta spp afpnet");
  // console.log("body ", req.body);
  var pListDni = req.body.list;
  var periodo = req.body.devengue;
  var pDevengue = req.body.devengue.split("-")[0]+req.body.devengue.split("-")[1];
  var arr = [];

  //get comisiones por el periodo
  try {
    var comisiones = [];
  var respuestaComisiones = await Axios.post(urlComisiones,{"periodo":periodo});
  comisiones = respuestaComisiones.data.data;
  // console.log("comisiones ", comisiones);
  } catch (error) {
    console.log("error en comisiones ", error);
  }
  
  //para crear el archivo excel para la consulta masiva
  const inserDataExcel = [];

  for(let item of pListDni) {
      var d = {"tipoDocumento":"0", "dni":item.dni};
      inserDataExcel.push(d);
  }

  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet('Hoja1');
  inserDataExcel.forEach((data,index)=>{
    worksheet.addRow([data.tipoDocumento,data.dni]);
  });

  await workbook.xlsx.writeFile('./file/consultaSbs.xlsx');

  //inicio de puppeter
  const browser = await puppeteer.launch({
    headless: false,
    //slowMo: 25,
    'args': [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ]
  });

  try {
      const page = await browser.newPage();
      await page._client.send('Page.setDownloadBehavior', {behavior: 'allow', downloadPath: myDownloadPath });// para descargar el archivo
      await page.goto(urlAfpnet);
      // await page.waitForSelector(".close");
      await new Promise(r => setTimeout(r, 1050));
      if(await page.$$('.close')){// para validar si se encuentra la clase  y eliminar modales
        const modals = await page.$$('.close');
        for (let index = 0; index < modals.length; index++) {
          await new Promise(r => setTimeout(r, 150));
          await page.evaluate((index) =>{document.querySelectorAll(".close")[index].click();}, index);
          
        }
      }else{
        throw '';
      }

    await page.focus('#NumeroDocumento');
    await page.evaluate(val => document.querySelector('#NumeroDocumento').value = val, ruc);
    await page.focus('#NombreUsuario');
    await page.evaluate(val => document.querySelector('#NombreUsuario').value = val, user);
    const element = await page.$('#CaptchaImg');      
    await element.screenshot({path: 'captcha.jpg'});
    var code = "";
    var aux = false;
    // refreshh new code 
    do{
      const worker = tesseract.createWorker();
        await (async () => {
            await worker.load();
            await worker.loadLanguage('eng');
            await worker.initialize('eng');
            const { data: { text } } = await worker.recognize('./captcha.jpg');
              code = text.trim();
            await worker.terminate();
            if(code.length == 4){// si la longitud del codigo es correcta
              await page.evaluate(val => document.querySelector('#txtContrasenia').value = val, password);
              await page.focus('#Contrasenia');
              await page.evaluate(val => document.querySelector('#Contrasenia').value = val, password);
              await page.focus('#Captcha');
              await page.evaluate(val => document.querySelector('#Captcha').value = val, code.toUpperCase());
              await new Promise(r => setTimeout(r, 150));
              await page.click('#btn-ingresar');

              try {
                if(await page.waitForSelector(".login-mensajes",{timeout:1500})){// validar si en la pagina se encuentra la clase y determinar si volvemos a cargar un nuevo captcha
                  console.log("login message");
                  const messageLogin = await page.waitForSelector(".login-mensajes");
                  if(messageLogin){// si existe
                    const text = await page.evaluate(messageLogin => messageLogin.textContent, messageLogin);
                    if(text.trim()=="El texto ingresado es incorrecto."){
                      await new Promise(r => setTimeout(r, 150));
                      const element2 = await page.$('#CaptchaImg');      
                      await element2.screenshot({path: 'captcha.jpg'});
                      aux = true;
                    }else{// si 
                      aux = false;
                      await page.goto(urlAfpnet +"/GestionarAfiliado/Afiliado/ConsultaCusppMasiva?parguid=ZyM3bE7wzNY3wrJkjYBK", {waitUntil: 'networkidle2'});
                    }
                  }else{
                    aux = false;
                    await page.goto(urlAfpnet +"/GestionarAfiliado/Afiliado/ConsultaCusppMasiva?parguid=ZyM3bE7wzNY3wrJkjYBK", {waitUntil: 'networkidle2'});
                  }
                }
              } catch (error) {
                  aux = true;
                  try {
                    await page.evaluate(val => document.querySelector('#txtContrasenia').value = val, password);
                    await page.focus('#Contrasenia');
                    await page.evaluate(val => document.querySelector('#Contrasenia').value = val, password);
                    await page.focus('#Captcha');
                    await page.evaluate(val => document.querySelector('#Captcha').value = val, code.toUpperCase());
                    await new Promise(r => setTimeout(r, 150));
                    await page.click('#btn-ingresar');
                    const element3 = await page.$('#CaptchaImg');      
                    await element3.screenshot({path: 'captcha.jpg'});
                    console.log("contin");
                  } catch (error) {
                    aux = false;
                    await page.goto(urlAfpnet +"/GestionarAfiliado/Afiliado/ConsultaCusppMasiva?parguid=ZyM3bE7wzNY3wrJkjYBK", {waitUntil: 'networkidle2'});
                  }
              }
              
            }else{
              aux = true;
              await page.evaluate(val => document.querySelector('#txtContrasenia').value = val, password);
              await page.focus('#Contrasenia');
              await page.evaluate(val => document.querySelector('#Contrasenia').value = val, password);
              await page.focus('#Captcha');
              await page.evaluate(val => document.querySelector('#Captcha').value = val, code.toUpperCase());
              await new Promise(r => setTimeout(r, 150));
              await page.click('#btn-ingresar');
              const element1 = await page.$('#CaptchaImg');      
              await element1.screenshot({path: 'captcha.jpg'});
            }
            })();
            console.log("aux ", aux);
    }while(aux);        
    
    await new Promise(r => setTimeout(r, 150));
    await page.select('select[name="devengue"]', pDevengue);
    await new Promise(r => setTimeout(r, 150));
    const elementHandle = await page.$("input[type=file]");
    await elementHandle.uploadFile('./file/consultaSbs.xlsx');
    await new Promise(r => setTimeout(r, 3000));// tiempo para esperar la carga del archivo
    const [button] = await page.$x("//button[contains(., 'Cargar')]");
    if (button) {
        await button.click();
    }
    await new Promise(r => setTimeout(r, 3000));
    const workbook1 = new Excel.Workbook();
    await workbook1.xlsx.readFile("./file/consultaCUSPPMasiva.xlsx");
    const worksheet1 = workbook1.getWorksheet(1);
    worksheet1.eachRow(function(row, rowNumber) {
      var model = new aModel();
          model.primer_nombre = null;
          model.nacionalidad = null;
          model.segundo_nombre = null;
          model.lugar_residencia = null;
          model.estado_civil = null;
          model.origen_afiliado = null;
          model.tipo_trabajador = null;
          model.fecha_defuncion = null;
          model.fecha_afiliacion = null;
          if(rowNumber != 1){
            row.eachCell(function(cell, colNumber) {
                if(colNumber == 2){
                  model.documento = cell.value;
                }
                if(colNumber == 6){
                  model.cuss = cell.value;
                }
                if(colNumber == 7){
                  model.apellido_paterno = cell.value;
                }
                if(colNumber == 8){
                  model.apellido_materno = cell.value;
                }
      
                if(colNumber == 9){
                  model.nombres = cell.value;
                }
                if(colNumber == 13){
                  model.situacion = cell.value;
                }
                if(colNumber == 14){
                  model.afp_actual = cell.value;
                }
                if(colNumber == 15){
                  model.tipo_comision = cell.value;
                }
            });
            arr.push(model);
          }
    });
    // console.log("data ", arr);
      res.status(200).send({
        success: true,
        result: arr
      });

       const fs = require('fs');
      // delete a file
      fs.unlink('./captcha.jpg', (err) => {
        if (err) {
            throw err;
        }
        console.log("File is deleted.");
    });
      fs.unlink('./file/consultaSbs.xlsx', (err) => {
          if (err) {
              throw err;
          }
          console.log("File is deleted.");
      });

      fs.unlink('./file/consultaCUSPPMasiva.xlsx', (err) => {
        if (err) {
            throw err;
        }
        console.log("File is deleted.");
    });
    await page.evaluate(() => {//cerrar session
      document.getElementById('form-logout').submit();
    });
    await new Promise(r => setTimeout(r, 150));
    await browser.close();

    } catch (error) {
    console.log("try error afpnet" + error);
    res.status(200).send({
      success: false,
        result: null
      });

    await browser.close();
  }

});


module.exports = router;