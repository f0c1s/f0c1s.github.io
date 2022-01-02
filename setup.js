function setup() {
    // localStorage
    const storedColorMode = localStorage.getItem("color-mode") || 'dark';
    console.log(storedColorMode);
    window.APP = {
        storedColorMode: storedColorMode
    };
    // assign the values from localStorage to objects
    // // color mode to body
    document.querySelector('body').className = '';
    document.querySelector('body').className = storedColorMode;

    progressBar();
    takeToTopButton();
    setFontSize();
    setFontFamily();
}

function setFontFamily() {
    const fontFamily = (localStorage.getItem("text-font-family") || document.querySelector("body").style.fontFamily);
    localStorage.setItem("text-font-family", fontFamily);
    document.querySelector("body").style.fontFamily = fontFamily;
}

function setFontSize() {
    const fontSize = (localStorage.getItem("text-font-size") || document.querySelector("body").style.fontSize || 13);
    localStorage.setItem("text-font-size", fontSize);
    document.querySelector("body").style.fontSize = fontSize + "px";
}

function progressBar() {
    const bar = document.createElement("div");
    bar.id = "progress-bar";
    const h = document.body.getClientRects()[0].height - window.innerHeight;
    const docWidth = window.innerWidth;
    bar.style.maxWidth = docWidth;
    console.log(docWidth);

    window.addEventListener("scroll", () => {
        const top = document.body.scrollTop;
        const percent = Math.floor((top * 100) / h);
        bar.style.width = (docWidth / 100) * percent + 'px';
    });

    document.body.appendChild(bar);
}

function takeToTopButton() {
    const btn = document.createElement("div");
    btn.id = "take-to-top-btn";
    btn.innerText = 'top';
    btn.style.display = 'none';
    window.addEventListener("scroll", () => {
        btn.style.display = document.body.scrollTop > window.innerHeight ? 'unset' : 'none';
    });
    btn.addEventListener('click', () => {
        document.body.scrollTop = 0;
    });
    document.body.appendChild(btn);
}