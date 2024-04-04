const inputSlider = document.querySelector("[data-lengthSlider]");
const dataLength = document.querySelector("[data-lengthNumber]");
const pwdDisplay = document.querySelector("[data-pwd-display]");
const copyBtn = document.querySelector("[data-copy]");
const copyMssg = document.querySelector("[data-copyMssg]");
const upper = document.querySelector("#uppercase");
const lower = document.querySelector("#lowercase");
const number = document.querySelector("#numbers");
const symbol = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generate = document.querySelector(".generate-button");
const allCheckBox = document.querySelectorAll("input[type=checkbox]")
const symbols = '~`!@#$%^&*()_+=-[]{}|:;"<,>.?/';

let pwd = "";
let pwdLength = 10;
let checkCount = 0;
// setIndicator("#ccc");
handleSlider();

function handleSlider() {
    inputSlider.value = pwdLength;
    dataLength.innerText = pwdLength;
    //
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((pwdLength - min)*100/(max - min)) + "100%";
}
function setIndicator(color) {
    indicator.style.backgroundColor = color;
}
function getRdnInt(min,max) {
    return Math.floor(Math.random() * (max-min)) + min;
}
function generateRandomNumber() {
    return getRdnInt(0,9);
}
function generateLowerCase() {
    return String.fromCharCode(getRdnInt(97,123));
}
function generateUpperCase() {
    return String.fromCharCode(getRdnInt(65,91));
}
function generateSymbol() {
    const ranNum = getRdnInt(0,symbols.length);
    return symbols.charAt(ranNum);
}
//strength indicator
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (upper.checked) hasUpper = true;
    if (lower.checked) hasLower = true;
    if (number.checked) hasNum = true;
    if (symbols.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && pwdLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      pwdLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(pwdDisplay.value);
        copyMssg.innerText = "copied";
    }
    catch(e) {
        copyMssg.innerText = "failed";
    }
    copyMssg.classList.add("active");
    setTimeout(() => {
        copyMssg.classList.remove("active");
    },2000)
}


function shufflePwd(array) {
    //FISHER YATES METHOD
    for(let i=array.length - 1; i>0; i--) {
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})
function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked) {
            checkCount++;
        }
    });
    if(pwdLength < checkCount) {
        pwdLength = checkCount;
        handleSlider();
    }

}


inputSlider.addEventListener('input',(e) => {
    pwdLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if(pwdDisplay.value) {
        copyContent();
    }
})

generate.addEventListener('click', () => {
    if(checkCount == 0) {
        return;
    }
    if(pwdLength < checkCount) {
        pwdLength = checkCount;
        handleSlider();
    }
    // console.log("HI");
    pwd = "";
    // if(upper.checked) {
    //     pwd += generateUpperCase();
    // }
    // if(lower.checked) {
    //     pwd += generateLowerCase();
    // }
    // if(symbol.checked) {
    //     pwd += generateSymbol();
    // }
    // if (number.checked) {
    //     pwd += generateRandomNumber();
    // }

    let funArr = [];
    if(upper.checked) {
        funArr.push(generateUpperCase);
    }
    if(lower.checked) {
        funArr.push(generateLowerCase);
    }
    if(number.checked) {
        funArr.push(generateRandomNumber);
    }
    if(symbol.checked) {
        funArr.push(generateSymbol);
    }

    for(let i=0; i<funArr.length; i++) {
        pwd += funArr[i]();
    }
    // console.log("HI");

    for(let i=0; i<pwdLength-funArr.length; i++) {
        let randIndex = getRdnInt(0, funArr.length);
        console.log("randomIndex" + randIndex);
        pwd += funArr[randIndex]();
    }
    // console.log("HI");

    pwd = shufflePwd(Array.from(pwd));
    pwdDisplay.value = pwd;
    calcStrength();
})