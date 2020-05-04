const puppeteer = require('puppeteer');
const creds = require('./creds');

(async () => {
  const browser = await puppeteer.launch({
    headless: false
  });

  const page = await browser.newPage();
  await page.goto('https://webmail.tce.pi.gov.br', {waitUntil: 'networkidle2'});

  // username
  await page.waitForSelector("[name='username']");
  await page.type("[name='username']", creds.username);

  // password
  await page.keyboard.down("Tab");
  await page.keyboard.type(creds.password);

  await page.evaluate(() => {
    let btns = [...document.querySelector("form").querySelectorAll("input.ZLoginButton.DwtButton")];
    btns.forEach(function (btn) {
        if (btn.value == "Login")
            btn.click();
    });
  });
  // 1 segundos de dalay
  await page.waitFor(10000);

  // clique duplo em uma div relacionada a um email especifico
  await page.click( "div#zlif__CLV-main__-26782__rw.ZmRowDoubleHeader", {
    button : 'left',
    clickCount : 2, 
  });

  await page.waitFor(1000);

  await page.click( "td#zb__CV-1__ACTIONS_MENU_dropdown.ZDropDown", {
    button : 'left'
  });

  await page.waitFor(2000);
  //await page.keyboard.press('KeyP');
  let cont = 0;
  while (cont <= 8) {
    await page.keyboard.press('ArrowDown');
    cont++;
  }
  
  await page.keyboard.press('Enter');

  await page.waitFor(30000);

  //await page.pdf({path: 'teste.pdf', format: 'A4'});

  await browser.close();
})();