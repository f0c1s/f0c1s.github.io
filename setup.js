function setup() {
    // localStorage
    const storedColorMode = localStorage.getItem('color-mode');
    console.log(storedColorMode);

    // assign the values from localStorage to objects
    // // color mode to body
    document.querySelector('body').className = storedColorMode;
}