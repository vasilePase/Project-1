const getComputedStyles = async(locator) => {
    return await locator.evaluate((button) => {
        return {
            backgroundColor: window.getComputedStyle(button).backgroundColor,
            opacity: window.getComputedStyle(button).opacity,
            width: window.getComputedStyle(button).width,
            height: window.getComputedStyle(button).height,
            position: window.getComputedStyle(button).position
        };
    })
};

module.exports = { getComputedStyles }