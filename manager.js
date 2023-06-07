let runningRerun = "false";
let runningProcess = "false";
if(localStorage.getItem('processing')==="true"){
  runningProcess = "true";
}

function getSelector(element) {
  if (!(element instanceof Element)) {
    return null;
  }
  const parts = [];
  while (element) {
    let part = element.tagName.toLowerCase();
    const id = element.id;
    const classes = element.className;
    if (id) {
      part += `#${id}`;
      parts.unshift(part);
      break;
    } else if (classes) {
      part += `.${classes.trim().replace(/\s+/g, '.')}`;
    }
    parts.unshift(part);
    element = element.parentElement;
  }
  return parts.join(' > ');
}

function findSelector(text, element) {
  const elements = document.querySelectorAll(element);
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    if (element.textContent === 'Rerun') {
      const selector = getSelector(element);
      return selector;
    }
  }
  return null;
}

const clickEvent = new MouseEvent('click', {
  bubbles: true,
  cancelable: true,
  view: window
});

function clickElement(text,element) {
  const rerunButton = document.querySelector(findSelector(text,element));
  if (rerunButton) {
      rerunButton.dispatchEvent(clickEvent);
  }
}

function clickRerun(text,element){
  if(runningRerun==="true")clickElement("Rerun","span");
}

function timerSet() {
  setInterval(clickRerun, 10000);
}

function toggleActiveState() {
  const isActive = localStorage.getItem('active') === 'true';
  const newActiveState = !isActive;
  localStorage.setItem('active', newActiveState.toString());
  if (newActiveState) {
    console.log('Script is active');
    runningRerun = "true";
    timerSet();
  } else {
    console.log('Script is inactive');
    runningRerun = "false";
  }
}

function createToggleRerunButton() {
  const button = document.createElement('button');
  button.textContent = 'Auto Rerun - do this when the modal of a generation is open';
  button.style.position = 'fixed';
  button.style.top = '60px';
  button.style.right = '20px';
  button.style.zIndex = '9999';
  button.addEventListener('click', toggleActiveState);
  document.body.appendChild(button);
}

createToggleRerunButton();

if(runningRerun==="true")timerSet();

//////////////////////////////////////////////////////////////////
// PROCESSING : OPEN, UPSCALE, DOWNLOAD, Delete
// make sure browser allows download without confirmation window
// control how many images you want to process on the fly, default 1000
// if mage.space is taking too long to upscale, increaset the setTimout for it.

const openFirstGrid = '#__next > div > div > main > div > div > div:nth-child(2) > div.mantine-Stack-root.mantine-zzfl27 > div.mantine-Stack-root.mantine-146brt7 > div > div[style*="position: absolute; writing-mode: horizontal-tb; top: 0px; left: 0px;"][style*="width"] > div > div > div > span > img';
const enhanceButton = "#mantine-r7-target > div > span.mantine-qo1k2.mantine-Button-label";
const upscaleOnlyButton = "#mantine-r7-dropdown > div.mantine-Stack-root.mantine-1y5ra44 > button:nth-child(2) > div > span > div > div.mantine-Text-root.mantine-h8n6mi";
const downloadButton = "#mantine-R3bm-body > div > div.mantine-Container-root.mantine-oro531 > div > div.mantine-Stack-root.mantine-kh5kgh > div > div.mantine-Group-root.mantine-1xbr06 > a > svg";
const deleteButton = "#mantine-rd-target > button > div > span.mantine-qo1k2.mantine-Button-label";
const confirmDeleteButton = "#mantine-R3bm-body > div.mantine-Group-root.mantine-puhv18 > button.mantine-UnstyledButton-root.mantine-Button-root.mantine-1q3qenk > div > span";

function updateCountField(countValue) {
  const countField = document.getElementById('countInput');
  countField.value = countValue || '';
}

function setCountRemaining() {
  const countInput = document.getElementById('countInput');
  const countValue = parseInt(countInput.value);
  countremaining = countValue.toString();
  localStorage.setItem('countremaining', countValue.toString());
}

function createUIElements() {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '90px';
  container.style.right = '20px';
  container.style.zIndex = '9999';
  const toggleButton = document.createElement('button');
  toggleButton.textContent = 'Process, DL, Delete, (from profile page)';
  toggleButton.addEventListener('click', toggleProcessingState);
  const textField = document.createElement('input');
  textField.type = 'text';
  textField.id = 'countInput';
  textField.placeholder = 'Enter count remaining';
  const setButton = document.createElement('button');
  setButton.textContent = 'Set Count';
  setButton.addEventListener('click', setCountRemaining);
  container.appendChild(toggleButton);
  container.appendChild(textField);
  container.appendChild(setButton);
  const body = document.querySelector('body');
  body.appendChild(container);
}

createUIElements();

let countMax = 1000;
let countremaining = 1000;

const storedCount = localStorage.getItem('countremaining');
if (storedCount) {
  countremaining = parseInt(storedCount, 10);
  console.log("countremaining: ",countremaining);
}
updateCountField(countremaining);

function process(stepNumber) {
  if(countremaining <= 0) {
    localStorage.setItem(storedCount,countMax);
    return;
  }
  if (stepNumber === 1) {
    console.log("trying step 1");
    setTimeout(function () {
      const button1 = document.querySelector(openFirstGrid);
      if (button1) {
          button1.dispatchEvent(clickEvent);
          process(stepNumber + 1);
      } else {
        countremaining+=1;
        updateCountField(countremaining);
        process(7);
      }
    }, 2500);
  } else if (stepNumber === 2) {
    console.log("trying step 2");
    setTimeout(function () {
      const button2 = document.querySelector(enhanceButton);
      if (button2) {
          button2.dispatchEvent(clickEvent);
          process(stepNumber + 1);
      } else {
        countremaining+=1;
        updateCountField(countremaining);
        process(7);
      }
    }, 2000);
  } else if (stepNumber === 3) {
    console.log("trying step 3");
    setTimeout(function () {
      const button3 = document.querySelector(upscaleOnlyButton);
      if (button3) {
          button3.dispatchEvent(clickEvent);
          process(stepNumber + 1);
      } else {
        countremaining+=1;
        updateCountField(countremaining);
        process(7);
      }
    }, 500);
  } else if (stepNumber === 4) {
    console.log("trying step 4");
    setTimeout(function () {
      const button4 = document.querySelector(downloadButton);
      if (button4) {
          button4.dispatchEvent(clickEvent);
          process(stepNumber + 1);
      } else {
        countremaining+=1;
        updateCountField(countremaining);
        process(7);
      }
    }, 12000);
  } else if (stepNumber === 5) {
    console.log("trying step 5");
    setTimeout(function () {
      const button5 = document.querySelector(deleteButton);
      if (button5) {
          button5.dispatchEvent(clickEvent);
          process(stepNumber + 1);
      } else {
        countremaining+=1;
        updateCountField(countremaining);
        process(7);
      }
    }, 500);
  } else if (stepNumber === 6) {
    console.log("trying step 6");
    setTimeout(function () {
      const button6 = document.querySelector(confirmDeleteButton);
      if (button6) {
          button6.dispatchEvent(clickEvent);
          process(stepNumber + 1);
      } else {
        countremaining+=1;
        updateCountField(countremaining);
        process(7);
      }
    }, 500);
  } else if (stepNumber === 7) {
    console.log("Reloading Window");
    countremaining = countremaining-1;
    updateCountField(countremaining);
    setTimeout(function () {
      window.location.reload();
      localStorage.setItem('countremaining', countremaining.toString());
    }, 500);
  }
}

function startProcess() {
  if(runningProcess==="true")process(1);
}

window.addEventListener("load", startProcess);

function toggleProcessingState() {
  const isActive = localStorage.getItem('processing') === 'true';
  const newActiveState = !isActive;
  localStorage.setItem('processing', newActiveState.toString());
  if (newActiveState) {
    console.log('Processing is active');
    runningProcess = "true";
    startProcess();
  } else {
    console.log('Processing is inactive');
    runningProcess = "false";
  }
}
