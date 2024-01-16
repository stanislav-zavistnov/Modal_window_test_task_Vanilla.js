const organizationNameInput = document.querySelector('.form-top-input--organization');
const phoneInput = document.querySelector('.form-top-input--phone');
const emailInput = document.querySelector('.form-top-input--mail');
const directionSelect = document.querySelector('.form-select');
const siteInput = document.querySelector('.form-input--site');
const vkontakteInput = document.querySelector('.form-input--vk');
const odnoklassnikiInput = document.querySelector('.form-input--ok');
const facebookInput = document.querySelector('.form-input--facebook');
const instagramInput = document.querySelector('.form-input--instagram');
const youtubeInput = document.querySelector('.form-input--youtube');
const bossInput = document.querySelector('.form-input--boss');
const submitButton = document.querySelector('.form-submit-btn');
const modalButton = document.querySelector('.button-modal');
const blurDiv = document.querySelector('.blur');
const modalWindow = document.querySelector('.modal-wrap');
const removeModalWindow = document.querySelector('.form-remove-btn');

// отркытие окна
modalButton.addEventListener('click', () => {
  modalWindow.style.display = 'flex';
  blurDiv.style.display = 'block';
  checkMyForm();
});

// закрытие окна
removeModalWindow.addEventListener('click', (event) => {
  event.preventDefault();
  modalWindow.style.display = 'none';
  blurDiv.style.display = 'none';
  clearAllInputs();
});

// объект куда запишутся все поля, если все ок
const appObject = {};

// объект, который разрешает кнопке "стать нашим партнером" стать рабочей
const allowObject = {
  organization: false,
  phone: false,
  email: false,
  image: false,
  select: false,
}

// проверяет заполнены ли поля, разрешил ли валидатор, где он есть, эти поля.
function checkMyForm() {
  if (
    allowObject.organization === true &&
    allowObject.phone === true &&
    allowObject.email === true &&
    allowObject.image === true &&
    allowObject.select === true
  ) {
    submitButton.style.opacity = '1';
    return true;
  } else {
    submitButton.style.opacity = '0.5';
    return false;
  }
}

// убираем лишние пробелы, дефисы, первая буква будет большой (копировал из какой-то своей работы на события браузера)
function normalizeValueLetters(string) {
  let copyString = (string.slice(0)).toLowerCase().trim();
  let arrayString = copyString.split('');
  let newArrayString = [];
  let newArrayFromString;
  for (let i = 0; i < arrayString.length; i++) {
    if (arrayString[i] === ' ') {
      if (arrayString[i + 1] === ' ') {
        arrayString[i] = '';
      }
    }

    if (arrayString[i] === '-') {
      if (arrayString[i + 1] === '-') {
        arrayString[i] = '';
      }
    }
  }
  for (let i = 0; i < arrayString.length; i++) {
    if (arrayString[i] !== '') {
      newArrayString.push(arrayString[i])
    }
  }
  if (newArrayString[0] === ' ' || newArrayString[0] === '-') {
    newArrayString.splice(0, 1);
  }

  if (newArrayString[newArrayString.length - 1] === ' ' || newArrayString[newArrayString.length - 1] === '-') {
    newArrayString.splice((newArrayString.length - 1), 1);
  }

  newArrayFromString = newArrayString.join('');
  let firstLetter = (newArrayFromString.slice(0, 1)).toUpperCase();
  let anotherLetters = newArrayFromString.slice(1);
  let newString = firstLetter + anotherLetters;
  return newString;
}

// это для нормализации вызовов ниже
function normalizeAndSetInputValue(inputElement) {
  inputElement.addEventListener('blur', () => {
    let string = inputElement.value;
    let newString = normalizeValueLetters(string);
    inputElement.value = newString;
  });
}

// Убираем лишние пробелы и дефисы во всех полях
normalizeAndSetInputValue(organizationNameInput);
// normalizeAndSetInputValue(phoneInput);
normalizeAndSetInputValue(emailInput);
normalizeAndSetInputValue(siteInput);
normalizeAndSetInputValue(vkontakteInput);
normalizeAndSetInputValue(odnoklassnikiInput);
normalizeAndSetInputValue(facebookInput);
normalizeAndSetInputValue(instagramInput);
normalizeAndSetInputValue(youtubeInput);
normalizeAndSetInputValue(bossInput);

// input-file
const customInput = document.querySelector('.input-file');
const fileInput = document.querySelector('.file-input');
const resetFile = document.querySelector('.input-file-btn');
const inputFileSvg = document.querySelector('.input-file__img');
const inputFileDescr = document.querySelectorAll('.input-file__descr');

customInput.addEventListener('click', (event) => {
  if (!fileInput) {
    const fileInput = document.createElement('input');
    fileInput.classList.add('file-input');
    fileInput.type = 'file';
    fileInput.accept = 'image/jpeg, image/png';
    document.querySelector('.form-download-file-wrap').append(fileInput);
    if (event.target !== resetFile) {
      fileInput.click(); // Симулируем клик на скрытом input
    }
    fileInput.addEventListener('change', () => {
      // Выполняем действия при выборе файла
      const selectedFile = fileInput.files[0];
      if (selectedFile && selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        resetFile.style.display = 'block';
        allowObject.image = true;
        appObject.image = selectedFile;
        document.querySelector('.form-download-file-wrap').style.outline = 'transparent';
        checkMyForm();

        reader.onload = function (e) {
          const imageUrl = e.target.result;
          customInput.style.backgroundImage = `url(${imageUrl})`;
          customInput.style.backgroundColor = 'transparent';
          inputFileSvg.style.display = 'none';
          for (const iterator of inputFileDescr) {
            iterator.style.display = 'none';
          }
        };

        reader.readAsDataURL(selectedFile);

        // удаляем загруженный файл, чистим background
        resetFile.addEventListener('click', (event) => {
          event.preventDefault();
          fileInput.value = null;
          customInput.style.backgroundImage = 'none';
          customInput.style.backgroundColor = 'var(--text-grey)';
          inputFileSvg.style.display = 'block';
          for (const iterator of inputFileDescr) {
            iterator.style.display = 'block';
          }
          allowObject.image = false;
          checkMyForm();
          resetFile.style.display = 'none';
        });
      }
    });
  }
});

//  проверка на содержание одного символа @ и хотя бы одной точки
function isValidEmail(email) {
  // Используем регулярное выражение для проверки
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// ниже события инпута, реагирование валидатора и заполненности поля, проверка кнопки отправки - можно или нет.
organizationNameInput.addEventListener('input', () => {
  if (organizationNameInput.value) {
    allowObject.organization = true;
    document.querySelector('.form-top-input-wrap--organization').style.outline = 'transparent';
    checkMyForm();
  }
});

phoneInput.addEventListener('keydown', (event) => {
  if (event.key === 'Backspace') {
    phoneInput.value = '';
    abc.length = 0;
    abc.push('+7 ');
    allowObject.phone = false;
    checkMyForm();
    console.log(allowObject)
  }
});

phoneInput.addEventListener('keydown', (event) => {
  const keyCode = event.keyCode || event.which;
  if (keyCode >= 48 && keyCode <= 57) {
    if (abc.length === 14) {
      allowObject.phone = true;
      document.querySelector('.form-top-input-wrap--phone').style.outline = 'transparent';
      checkMyForm();
    }
    if (abc.length < 14) {
      abc.push(event.key);
    }
    if (abc.length === 4) {
      abc.push(' ');
    }
    if (abc.length === 8 || abc.length === 11) {
      abc.push('-');
    }
  } else {
    event.preventDefault();
  }
});

const abc = ['+7 '];
phoneInput.addEventListener('input', (event) => {
  const cleanedValue = event.target.value.replace(/[^\d]/g, '');
  const formattedValue = abc.join('');
  event.target.value = formattedValue;
});

emailInput.addEventListener('input', () => {
  if (isValidEmail(emailInput.value)) {
    allowObject.email = true;
    document.querySelector('.form-top-input-wrap--email').style.outline = 'transparent';
    checkMyForm();
  }
});

directionSelect.addEventListener('change', (event) => {
  const selectedValue = event.target.value;
  if (selectedValue) {
    allowObject.select = true;
    appObject.select = selectedValue;
    document.querySelector('.form-select-wrap').style.outline = 'transparent';
    checkMyForm();
  } else {
    allowObject.select = false;
    checkMyForm();
  }

});

// submit
// функция очистки полей. т.к. я не создаю форму заново, перед ее закрытием в случае отмены или
// успешной отправке нужно ее очистить
function clearAllInputs() {
  resetFile.style.display = 'none';
  organizationNameInput.value = '';
  phoneInput.value = '';
  emailInput.value = '';
  customInput.style.backgroundImage = 'none';
  directionSelect.selectedIndex = -1;
  siteInput.value = '';
  vkontakteInput.value = '';
  odnoklassnikiInput.value = '';
  facebookInput.value = '';
  instagramInput.value = '';
  youtubeInput.value = '';
  bossInput.value = '';
  document.querySelector('.form-top-input-wrap--organization').style.outline = 'transparent';
  document.querySelector('.form-top-input-wrap--phone').style.outline = 'transparent';
  document.querySelector('.form-top-input-wrap--email').style.outline = 'transparent';
  document.querySelector('.form-download-file-wrap').style.outline = 'transparent';
  document.querySelector('.form-select-wrap').style.outline = 'transparent';
  if (fileInput) {
    fileInput.remove();
  }
  customInput.style.backgroundColor = 'var(--text-grey)';
  inputFileSvg.style.display = 'block';
  for (const iterator of inputFileDescr) {
    iterator.style.display = 'block';
  }
  for (const key in allowObject) {
    if (Object.hasOwnProperty.call(allowObject, key)) {
      allowObject[key] = false;
    }
  }
}

submitButton.addEventListener('click', (event) => {
  event.preventDefault();
  if (checkMyForm()) {
    appObject.organization = organizationNameInput.value;
    appObject.phone = phoneInput.value;
    appObject.email = emailInput.value;
    const selectedOption = directionSelect.options[directionSelect.selectedIndex];
    appObject.select = selectedOption.value;
    if (siteInput.value) {
      appObject.site = siteInput.value;
    }
    if (vkontakteInput.value) {
      appObject.vk = vkontakteInput.value;
    }
    if (odnoklassnikiInput.value) {
      appObject.ok = odnoklassnikiInput.value;
    }
    if (facebookInput.value) {
      appObject.fb = facebookInput.value;
    }
    if (instagramInput.value) {
      appObject.ig = instagramInput.value;
    }
    if (youtubeInput.value) {
      appObject.yt = youtubeInput.value;
    }
    if (bossInput.value) {
      appObject.boss = bossInput.value;
    }
    console.log(appObject);
    clearAllInputs();
    checkMyForm();
    modalWindow.style.display = 'none';
    blurDiv.style.display = 'none';
    alert('в консоль сохранился объект с данными из формы')
  } else {
    alert('Пожалуйста проверьте корректность заполнения обязательных полей');
    if (!allowObject.organization) {
      document.querySelector('.form-top-input-wrap--organization').style.outline = '2px solid red';
    }
    if (!allowObject.phone) {
      document.querySelector('.form-top-input-wrap--phone').style.outline = '2px solid red';
    }
    if (!allowObject.email) {
      document.querySelector('.form-top-input-wrap--email').style.outline = '2px solid red';
    }
    if (!allowObject.image) {
      document.querySelector('.form-download-file-wrap').style.outline = '2px solid red';
    }
    if (!allowObject.select) {
      document.querySelector('.form-select-wrap').style.outline = '2px solid red';
    }
  }
});
