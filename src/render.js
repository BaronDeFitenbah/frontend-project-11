const renderFormError = (state, elements, i18n) => {
    const { input, submit, feedback } = elements;
    submit.disabled = false;
    input.classList.add('is-invalid');
    feedback.classList.remove('text-success');
    feedback.classList.add('text-danger');
    const errors = {
      'url':'errors.invalidUrl',
      'required':'errors.invalidRequired',
      'notOneOf':'errors.invalidNotOneOf',
      'network error':'errors.invalidNetwork',
      'invalid rss':'errors.invalidRSS',
    }
    if(state.error in errors){
      feedback.textContent = i18n.t(errors[state.error])
    } else {
      feedback.textContent = i18n.t('errors.invalidUnknown')
    }
  };

  const renderFormSuccess = (elements, i18n) => {
    const { form, input, submit, feedback } = elements;
    submit.disabled = false;
    input.classList.remove('is-invalid');
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
    feedback.textContent = i18n.t('feedback.success');
    form.reset();
  };

  const showPost = (state, elements, i18n) => {
    const {modal} = elements; 
    const modalTitle = modal.querySelector('.modal-title'),
          modalDescr = modal.querySelector('.modal-descr'),
          modalReadBtn = modal.querySelector('.modal-link'),
          modalCloseBtn = modal.querySelector('.modal-close');
  
    const currentPost = state.posts.find((post) => post.postID === state.currentVisitedPostID);
      modalTitle.textContent = currentPost.postTitle;
      modalDescr.textContent = currentPost.postDescr;
      modalReadBtn.setAttribute('href', `${currentPost.postLink}`);
      modalReadBtn.textContent = i18n.t('modal.read');
      modalCloseBtn.textContent = i18n.t('modal.close');
      const postElem = document.querySelector(`[data-id="${currentPost.postID}"]`);
      postElem.classList.remove('fw-bold');
      postElem.classList.add('fw-normal');
  };

const createPostItem = (post, state, i18n) => {
  const parser = new DOMParser(),
    htmlString = `
  <li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0">
    <a href="${post.postLink}"
      class="${state.visitedPostsID.includes(post.postID) ? 'fw-normal' : 'fw-bold'}"
      data-id="${post.postID}" target="_blank" rel="noopener noreferrer">
      ${post.postTitle}
    </a>
    <button type="button" class="btn btn-outline-primary btn-sm"
      data-id="${post.postID}" data-bs-toggle="modal" data-bs-target="#modal">
      ${i18n.t('postButtonRead')}
    </button>
  </li>
`,
 doc = parser.parseFromString(htmlString, 'text/html'),
 postItem = doc.body.firstChild;
  return postItem;
};

  const renderContent = (state, elements, i18n) => {
    const { postsContainer, feedsContainer } = elements;
    feedsContainer.replaceChildren();
    postsContainer.replaceChildren();
    if (state.feeds.length === 0) return state.feeds;
  
    createInnerContainer(feedsContainer, i18n);
    createInnerContainer(postsContainer, i18n);
  
    const feedsList = feedsContainer.querySelector('ul');
    const postsList = postsContainer.querySelector('ul');
  
    state.feeds.forEach((feed) => feedsList.prepend(createFeedItem(feed)));
    state.posts.flat().forEach((post) => {
      postsList.prepend(createPostItem(post, state, i18n));
    });
    return state;
  };
  
  const createInnerContainer = (container, i18n) => {
    const innerContainer = document.createElement('div'),
      itemsList = document.createElement('ul');
    innerContainer.innerHTML = `<div class="card-body card border-0"><h2 class="card-title h4">${i18n.t(`${container.id}`)}</h2></div>`;
    itemsList.setAttribute('class', 'list-group border-0 rounded-0');
    innerContainer.append(itemsList);
    return container.append(innerContainer);
  };

  const createFeedItem = (feed) => {
    const htmlString = `
    <li class="list-group-item border-0 border-end-0">
      <h3 class="h6 m-0">${feed.feedTitle}</h3>
      <p class="m-0 small text-black-50">${feed.feedDescr}</p>
    </li>
  `;

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const feedItem = doc.body.firstChild;

  return feedItem;
  };

  const handleFormState = (state, elements, i18n) => {
    const { input, submit, feedback } = elements;
    switch (state.formState) {
      case 'filling':
        submit.disabled = false;
        input.classList.remove('is-invalid');
        feedback.textContent = '';
        break;
      case 'sending':
        submit.disabled = true;
        feedback.textContent = i18n.t('feedback.success');
        break;
      case 'success':
        return renderFormSuccess(elements, i18n);
      case 'error':
        return renderFormError(state, elements, i18n);
      default:
        throw new Error(`Unknown state: ${state.formState}`);
    }
    return state;
  };

  export default (state, elements, i18n) => (path) => {
    switch (path) {
      case 'formState':
        return handleFormState(state, elements, i18n);
      case 'feeds':
      case 'posts':
        return renderContent(state, elements, i18n);
      case 'visitedPostsID':
        showPost(state, elements, i18n);
        return renderContent(state, elements, i18n);
      default:
        throw new Error(`Unknown path: ${path}`);
    }
  };