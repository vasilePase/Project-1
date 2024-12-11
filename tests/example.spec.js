const { test, expect } = require('@playwright/test');
const exp = require('constants');
const { TIMEOUT } = require('dns');

test.beforeEach(async({page}) => {
  await page.goto('http://uitestingplayground.com/');
  await expect(page).toHaveTitle(/UI Test Automation/);
})

test('Dynamic ID', async ({ page }) => {
  await page.locator('a[href="/dynamicid"]').click();
  await page.getByRole('button', {name : 'Button with Dynamic ID' }).click();
}); 

test('Class attribute',async({ page }) => {
  await page.locator('a[href="/classattr"]').click();
  await page.locator('.btn.btn-primary').click();

  page.on('dialog', dialog => {
    expect(dialog.message().toEqual('Primary button pressed'));
    dialog.accept()
  })
});

test('Hide layers', async({ page }) => {
  await page.locator('a[href="/hiddenlayers"]').click();
  await expect(page.locator('#greenButton')).toBeVisible();
  await expect(page.locator('#blueButton')).toBeHidden();
  await page.locator('#greenButton').click();
  await expect(page.locator('#blueButton')).toBeVisible();
  await page.locator('#blueButton').click();
});

test('load Delays', async({ page }) => {
  await page.locator('a[href="/loaddelay"]').click();
  await page.waitForSelector('.btn.btn-primary')
  await page.getByRole('button', {text : 'Button Appearing After Delay'}).click()
});

test('AJAX data', async({page}) => {
  await page.locator('a[href="/ajax"]').click();
  await page.locator('#ajaxButton').click()
  await page.waitForSelector('.bg-success')
  await expect(page.locator('.bg-success')).toContainText('Data loaded with AJAX get request.');
})

test('Client Side Delay', async({page}) =>{
  await page.locator('a[href="/clientdelay"]').click();
  await page.locator('#ajaxButton').click()
  await expect(page.locator('.bg-success')).toContainText('Data calculated on the client side.', {timeout: 20000 });
});

test('Click', async({page}) => {
  await page.locator('a[href="/click"]').click();
  await page.locator('#badButton').click();
  const buttonColor = page.locator('#badButton');
  await expect(buttonColor).toHaveCSS('background-color', 'rgb(33, 136, 56)');
  await page.locator('#badButton').click({ position: { x: 0, y: 0 } });
});

test('Text input', async({ page }) => {
  await page.locator('a[href="/textinput"]').click();
  await page.locator('#newButtonName').fill('This will be new button name');
  const buttonSelector = page.getByRole('button', {type: 'button'}); 
  await buttonSelector.click();
  await expect(buttonSelector).toContainText('This will be new button name');
});

test('Scrollbars', async({ page }) => {
  await page.locator('a[href="/scrollbars"]').click();
  const buttonSelector = page.locator('#hidingButton');
  await buttonSelector.scrollIntoViewIfNeeded();
  await buttonSelector.click();
});

test('Dinamic Table', async({ page }) =>{
  await page.locator('a[href="/dynamictable"]').click();
  await expect(page.locator('div[role="row"]').filter({ hasText: 'Chrome' })).toBeVisible();
  const chromeRowSelector = page.locator('div[role="row"]').filter({ hasText: 'Chrome' });
  const CPUwarningMessage = await page.locator('.bg-warning').innerText();
  const textValue = CPUwarningMessage.split(' ');
  
  await expect(chromeRowSelector).toContainText(textValue[2]);
  });

test('Verify Text', async({page}) =>{
  await page.locator('a[href="/verifytext"]').click();
  await expect(page.locator('.badge-secondary').filter({hasText: 'Welcome UserName!'})).toContainText('Welcome');
})

test('Progress Bar', async({page}) =>{
  await page.locator('a[href="/progressbar"]').click();
  await page.locator('#startButton').click();
  const maxProgressBar = '75%';
  let progressBar;
  do {
    progressBar = await page.locator('#progressBar').innerText();
    await page.waitForTimeout(50);
  }
  while(progressBar !== maxProgressBar);
  await page.locator('#stopButton').click();
});

test('Visibility', async({ page}) =>{
  await page.locator('a[href="/visibility"]').click();
  const buttonIDs = ['#removedButton', '#zeroWidthButton', '#overlappedButton', '#transparentButton', '#invisibleButton', '#notdisplayedButton', '#offscreenButton', '#hideButton']

  for(let ID in buttonIDs){
    await expect(page.locator(buttonIDs[ID])).toBeVisible()
    await page.locator(buttonIDs[ID]).click();
    if (buttonIDs[ID] === '#hideButton') {
      for(let i = 0; i <= (ID); i++) {
        switch(buttonIDs[i]){
          case '#overlappedButton':
            await expect(page.locator('#hidingLayer')).toBeVisible()
            break;
          case '#transparentButton':
            await expect(page.locator(buttonIDs[i])).toHaveCSS('opacity', '0')
            break;
          case '#offscreenButton':
            await expect(page.locator(buttonIDs[i])).toHaveCSS('position', 'absolute')
            break;
          case '#hideButton':
            await expect(page.locator(buttonIDs[i])).toBeVisible()
            break;
          default:
            await expect(page.locator(buttonIDs[i])).toBeHidden()
        }
      };
    }
  };
}) 