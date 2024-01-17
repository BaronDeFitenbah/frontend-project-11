const renderFormError = (state, elements, i18n) => {
    const { input, submit, feedback } = elements;
    submit.disabled = false;
    input.classList.add('is-invalid');
    feedback.classList.remove('text-success');
    feedback.classList.add('text-danger');
    switch (state.error) {
      case 'url':
        feedback.textContent = i18n.t('feedback.invalidUrl');
        break;
      case 'required':
        feedback.textContent = i18n.t('feedback.invalidRequired');
        break;
      case 'notOneOf':
        feedback.textContent = i18n.t('feedback.invalidNotOneOf');
        break;
      case 'network error':
        feedback.textContent = i18n.t('feedback.invalidNetwork');
        break;
      case 'invalid rss':
        feedback.textContent = i18n.t('feedback.invalidRSS');
        break;
      default:
        feedback.textContent = i18n.t('feedback.invalidUnknown');
    }
  };
  
  export default (state, elements, i18n) => (path) => {
    switch (path) {
      case 'formState':
        return handleFormState(state, elements, i18n);
      case 'feeds':
      case 'posts':
        return renderContent(state, elements, i18n);
      case 'visitedPostsID':
        handleReadButton(state, elements, i18n);
        return renderContent(state, elements, i18n);
      default:
        throw new Error(`Unknown path: ${path}`);
    }
  };