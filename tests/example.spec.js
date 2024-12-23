const { test, expect } = require('@playwright/test');
const { pageActions } = require('../pageAction/pageActions');
const exp = require('constants');

test.beforeEach(async({page}) => {
  await page.goto('http://uitestingplayground.com/');
  await expect(page).toHaveTitle(/UI Test Automation/);
})

test('Dynamic ID', async ({ page }) => {
  await pageActions.clickOnTheHrefLink(page, '/dynamicid');
  await page.getByRole('button', {name : 'Button with Dynamic ID' }).click();
}); 

test('Class attribute',async({ page }) => {
  await pageActions.clickOnTheHrefLink(page, '/classattr');
  await pageActions.clickOnTheButton(page, '.btn.btn-primary');

  page.on('dialog', async(dialog) => {
    expect(dialog.message()).toEqual('Primary button pressed');
    await dialog.accept();
  });
});

test('Hide layers', async({ page }) => {
  await pageActions.clickOnTheHrefLink(page, '/hiddenlayers');
  await expect(page.locator('#greenButton')).toBeVisible();
  await expect(page.locator('#blueButton')).toBeHidden();
  await pageActions.clickOnTheButton(page, '#greenButton');
  await expect(page.locator('#blueButton')).toBeVisible();
  await pageActions.clickOnTheButton(page, '#blueButton');
});

test('load Delays', async({ page }) => {
  await pageActions.clickOnTheHrefLink(page, '/loaddelay');
  await page.waitForSelector('.btn.btn-primary')
  await page.getByRole('button', {text : 'Button Appearing After Delay'}).click()
});

test('AJAX data', async({page}) => {
  await pageActions.clickOnTheHrefLink(page, '/ajax');
  await pageActions.clickOnTheButton(page, '#ajaxButton');
  await page.waitForSelector('.bg-success')
  await expect(page.locator('.bg-success')).toContainText('Data loaded with AJAX get request.');
})

test('Client Side Delay', async({page}) =>{
  await pageActions.clickOnTheHrefLink(page, '/clientdelay');
  await pageActions.clickOnTheButton(page, '#ajaxButton');
  await expect(page.locator('.bg-success')).toContainText('Data calculated on the client side.', {timeout: 20000 });
});

test('Click', async({page}) => {
  await pageActions.clickOnTheHrefLink(page, '/click');
  await pageActions.clickOnTheButton(page, '#badButton');
  const buttonColor = page.locator('#badButton');
  await expect(buttonColor).toHaveCSS('background-color', 'rgb(33, 136, 56)');
  await page.locator('#badButton').click({ position: { x: 0, y: 0 } });
});

test('Text input', async({ page }) => {
  await pageActions.clickOnTheHrefLink(page, '/textinput');
  await page.locator('#newButtonName').fill('This will be new button name');
  const buttonSelector = page.getByRole('button', {type: 'button'}); 
  await buttonSelector.click();
  await expect(buttonSelector).toContainText('This will be new button name');
});

test('Scrollbars', async({ page }) => {
  await pageActions.clickOnTheHrefLink(page, '/scrollbars');
  const buttonSelector = page.locator('#hidingButton');
  await buttonSelector.scrollIntoViewIfNeeded();
  await buttonSelector.click();
});

test('Dinamic Table', async({ page }) =>{
  await pageActions.clickOnTheHrefLink(page, '/dynamictable');
  await expect(page.locator('div[role="row"]').filter({ hasText: 'Chrome' })).toBeVisible();
  const chromeRowSelector = page.locator('div[role="row"]').filter({ hasText: 'Chrome' });
  const CPUwarningMessage = await page.locator('.bg-warning').innerText();
  const textValue = CPUwarningMessage.split(' ');
  
  await expect(chromeRowSelector).toContainText(textValue[2]);
  });

test('Verify Text', async({page}) =>{
  await pageActions.clickOnTheHrefLink(page, '/verifytext');
  await expect(page.locator('.badge-secondary').filter({hasText: 'Welcome UserName!'})).toContainText('Welcome');
})

test('Progress Bar', async({page}) =>{
  await pageActions.clickOnTheHrefLink(page, '/progressbar');
  await pageActions.clickOnTheButton(page, '#startButton');
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
  await pageActions.clickOnTheHrefLink(page, '/visibility');
  const buttonIDs = ['#removedButton', '#zeroWidthButton', '#overlappedButton', '#transparentButton', '#invisibleButton', '#notdisplayedButton', '#offscreenButton', '#hideButton']

  for(let ID in buttonIDs){
    await expect(page.locator(buttonIDs[ID])).toBeVisible()
    await pageActions.clickOnTheButton(page, buttonIDs[ID]);
    if (buttonIDs[ID] === '#hideButton') {
      for(let buttonCount = 0; buttonCount <= (ID); buttonCount++) {
        switch(buttonIDs[buttonCount]){
          case '#overlappedButton':
            await expect(page.locator('#hidingLayer')).toBeVisible()
            break;
          case '#transparentButton':
            await expect(page.locator(buttonIDs[buttonCount])).toHaveCSS('opacity', '0')
            break;
          case '#offscreenButton':
            await expect(page.locator(buttonIDs[buttonCount])).toHaveCSS('position', 'absolute')
            break;
          case '#hideButton':
            await expect(page.locator(buttonIDs[buttonCount])).toBeVisible()
            break;
          default:
            await expect(page.locator(buttonIDs[buttonCount])).toBeHidden()
        }
      };
    }
  };
});

test('Sample App', async({ page })=> {
  await pageActions.clickOnTheHrefLink(page, '/sampleapp');
  await page.getByPlaceholder('User Name').fill('Dave');
  await page.locator('input[type="password"]').fill('pwd');
  await expect(page.locator('#login')).toHaveText('Log In');
  await pageActions.clickOnTheButton(page, '#login');
  await expect(page.locator('#loginstatus')).toHaveText('Welcome, Dave!');
  await expect(page.locator('#login')).toHaveText('Log Out');
  await pageActions.clickOnTheButton(page, '#login');
  await expect(page.locator('#loginstatus')).toHaveText('User logged out.');
});

test('Mouse Over', async({ page }) =>{
  await pageActions.clickOnTheHrefLink(page, '/mouseover');
  /*First solution
  await page.locator('a[title="Click me"]').hover();
  await page.locator('a[title="Active Link"]').dblclick();
  await page.locator('a[title="Link Button"]').dblclick();
  */

  //Second solution
  for (let clickCount=0; clickCount < 2; clickCount++) {
    await page.locator('a[title="Click me"]').hover();
    await page.locator('a[title="Active Link"]').click();
    await page.locator('a[title="Link Button"]').click();
  }
  await expect(page.locator('#clickCount')).toContainText('2');
  await expect(page.locator('#clickButtonCount')).toContainText('2');
});

test('Non-Breaking Space', async({ page}) =>{
  await pageActions.clickOnTheHrefLink(page, '/nbsp');
  await page.getByRole('button', {name : 'My Button' }).click();
});

test('Overlapped Element', async({ page }) =>{
  await pageActions.clickOnTheHrefLink(page, '/overlapped');
  await page.locator('#id').fill('My ID');
  await page.locator('div[style*="overflow-y"]').evaluate(e => e.scrollTop =+ 100)
  const nameLocator = page.locator('#name');
  await nameLocator.fill('My Name');
  const nameLocatorValue = await nameLocator.inputValue();
  await expect(nameLocatorValue).toEqual('My Name');
});

test('Shadow DOM', async({ page }) =>{
  await pageActions.clickOnTheHrefLink(page, '/shadowdom');
  await pageActions.clickOnTheButton(page, '#buttonGenerate');
  const guidValue = await page.locator('#editField').inputValue();
  await pageActions.clickOnTheButton(page, '#buttonCopy');
  //Copy button is not working
  //const buttonCopyValue = await page.locator('#buttonCopy').inputValue();
  //await expect(guidValue).toEqual(buttonCopyValue);
});

test('Alerts', async({ page }) =>{ 
  await pageActions.acceptPopup(page);
  await pageActions.clickOnTheHrefLink(page, '/alerts');
  await pageActions.clickOnTheButton(page, '#promptButton');
  await pageActions.clickOnTheButton(page, '#alertButton');
  await pageActions.clickOnTheButton(page, '#confirmButton');
  await page.waitForTimeout(1000);
  
   /*page.on('dialog2', async(dialog) => {
    expect(dialog.message()).toEqual('Yes');
    await dialog.accept();
  });

await new Promise((resolve) => {
    const dialogHandler = async(dialog) => {
      console.log('TYPE:', dialog.type())
        dialog.accept(); // Accept the dialog
        console.log('First dialog accepted');
        page.off('dialog', dialogHandler); // Remove the handler

        // Wait for the second dialog to appear
        page.on('dialog', async (secondDialog) => {
            console.log('Second dialog message:', secondDialog.message()); // Log the second dialog message
            await secondDialog.accept(); // Accept the second dialog
            console.log('Second dialog accepted');
            resolve(); // Resolve when both dialogs are handled
        });
    };

    page.on('dialog', dialogHandler); // Register the dialog handler
});

console.log('All dialogs processed, continuing...');*/
});