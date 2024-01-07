import './style.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import onChange from 'on-change';
import { yup, reach } from 'yup';
 
// Создание схемы валидации с Yup
const schema = yup.object().shape({
  url: yup.string().url().required().notOneOf(['список ранее введенных URL']).trim(),
});

// Функция для валидации формы
const validateForm = (formData) => {
  try {
    // Валидация данных формы
    schema.validateSync(formData, { abortEarly: false });
    return null; // В случае успешной валидации возвращаем null
  } catch (error) {
    console.log('err', error);
    return error.inner.reduce((errors, err) => {
      return {
        ...errors,
        [err.path]: err.message,
      };
    }, {});
  }
};

// Обработчик изменений в форме
const form = document.querySelector('.rss-form');
const formData = {
  url: '',
};

// Применение onChange для отслеживания изменений формы
const watchedFormData = onChange(formData, (path, value) => {
  const errors = validateForm(watchedFormData);

  // Очистка предыдущих ошибок
  // И отображение новых ошибок (если они есть)
  // Возможно, нужно добавить логику для подсветки полей с ошибками
  if (errors) {
    // Отображение ошибок в интерфейсе
    // errors содержит объект с ошибками валидации
    // Например:
    // errors.url содержит сообщение об ошибке для поля URL
  }
});

// Обработчик отправки формы
form.addEventListener('submit', (event) => {
  event.preventDefault();
  
  const errors = validateForm(watchedFormData);
  
  if (!errors) {
    // Добавление логики для отправки данных, если они прошли валидацию
    // Например, вызов функции для добавления RSS-потока в список
    // Или отправка запроса на сервер для обработки данных
  } else {
    // Отображение ошибок в интерфейсе (если они есть)
    // Возможно, нужно добавить логику для подсветки полей с ошибками
  }
});


// console.log("Hello World!");
