import './style.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as yup from 'yup';
import onChange from 'on-change';
import resources from './locale/index.js';
import i18n from 'i18next';
 
document.addEventListener('DOMContentLoaded', () => {
  const i18next = i18n.createInstance();
  i18next.init({
    lng: 'ru',
    debug: true,
    translation: {
      feedback: {
        success: 'RSS успешно загружен',
        invalidUrl: 'Ссылка должна быть валидным URL',
        invalidRequired: 'Не должно быть пустым',
        invalidNotOneOf: 'RSS уже существует',
        invalidUnknown: 'Возникла неизвестная ошибка. Попробуйте еще раз',
        invalidRSS: 'Ресурс не содержит валидный RSS',
        invalidNetwork: 'Ошибка сети',
        loading: 'Идет загрузка...',
      },
      modal: {
        read: 'Читать полностью',
        close: 'Закрыть',
      },
      posts: 'Посты',
      feeds: 'Фиды',
      postButtonRead: 'Просмотр',
    },
  })
    .then(() => console.log('inside',i18n.t('posts')))
    .catch((e) => e.message);
});

  const i18next = i18n.createInstance();
  i18next.init({
    lng: 'ru',
    debug: true,
    resources,
  })


console.log('Working');
console.log(yup);
// Создание схемы валидации с Yup
const schema = yup.object().shape({
  url: yup.string().url().required().trim(),
});

// Функция для валидации формы
const validateForm = (formData) => {
  try {
    // Валидация данных формы
    console.log(formData)
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
  console.log('Инсайд ерр',errors);

  // Очистка предыдущих ошибок
  // И отображение новых ошибок (если они есть)
  // Возможно, нужно добавить логику для подсветки полей с ошибками
  if (errors) {
    // Находим элемент по классу
    var feedbackElement = document.querySelector('.feedback');

    // Проверяем, найден ли элемент
    if (feedbackElement) {
        // Меняем внутренний текст
        console.log(i18n.t('feedback.invalidUrl'));
        feedbackElement.textContent = i18n.t('feedback.invalidUrl');
    }
    // Отображение ошибок в интерфейсе
    // errors содержит объект с ошибками валидации
    // Например:
    // errors.url содержит сообщение об ошибке для поля URL
  }
});

// Обработчик отправки формы
form.addEventListener('submit', (event) => {
  const formData = new FormData(event.target);
  event.preventDefault();
  console.log(formData)
  
  // const errors = validateForm({url: formData.get('url')});
  // console.log(errors);

  watchedFormData.url = formData.get('url');
});


// console.log("Hello World!");
