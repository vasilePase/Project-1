module.exports.pageActions = {
    clickOnTheHrefLink: (page, url) => page.locator(`a[href="${url}"]`).click(),
    clickOnTheButton: (page, buttonSelector) => page.locator(buttonSelector).click(),
    popup: (page) => {
        return new Promise((resolve) => {
            const dialogHandler = async (dialog) => {
                console.log('Dialog message:', dialog.message());
                console.log('TYPE:', dialog.type()); // Log the dialog message
                await dialog.accept(); // Accept the dialog
                resolve(dialog);
                page.off('dialog', dialogHandler); // Resolve the promise with the dialog
            };
            page.on('dialog', dialogHandler);
        });
    },
    acceptPopup: (page) => {
    page.on('dialog', async (dialog) => {
        console.log('TYPE', dialog.type());
        console.log('Message:', dialog.message()); // Log the dialog message
        
        if (dialog.message()){
        // If it's a prompt dialog and you want to send text
        if (dialog.type() === 'prompt') {
            await dialog.accept('new text'); // Accept with new text
        } else {
            await dialog.accept(); // Just accept if it's an alert or confirm
        }
      }
    })},
}