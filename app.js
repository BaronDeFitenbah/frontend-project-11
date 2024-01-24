import onChange from 'on-change';
import uniqueId from 'lodash/uniqueId.js';
import axios from 'axios';
import render from './src/render.js';
import validate from './src/validate.js';
import parse from './src/parse.js';

const TIMER = 5000;

export default (i18n) => {
  const getData = (url) =>{ 
    console.log(123)
    const res = axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
  return res};
  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('#url-input'),
    submit: document.querySelector('[type="submit"]'),
    feedback: document.querySelector('.feedback'),
    postsContainer: document.querySelector('.posts'),
    feedsContainer: document.querySelector('.feeds'),
    modal: document.querySelector('.modal'),
  };

  const state = {
    formState: 'filling',
    rssLinks: [],
    feeds: [],
    posts: [],
    visitedPostsID: [],
  };
  const watchedState = onChange(state, render(state, elements, i18n));

  const updateRss = () => {
    const promises = state.rssLinks.map((url) => {
      getData(url)
        .then((rss) => {
          const updatingFeed = state.feeds.find((feed) => feed.feedLink === url);
          const { feed, posts } = parse(rss.data.contents);
          feed.id = updatingFeed.id;
          const newPosts = posts.filter((post) => {
            const collOfPostsLinks = state.posts.map((postInState) => postInState.postLink);
            return !collOfPostsLinks.includes(post.postLink);
          });

          if (newPosts.length === 0) return;
          newPosts.forEach((post) => {
            post.postID = uniqueId();
            post.feedID = feed.id;
          });
          watchedState.posts = [...state.posts, ...newPosts];
        })
        .catch((error) => {
          throw new Error(`Ошибка при обновлении фида: ${url}`, error);
        });
      return state;
    });
    Promise.all(promises)
      .then(setTimeout(() => {
        updateRss();
      }, TIMER))
      .catch((error) => {
        throw new Error(error);
      });
  };

  const handleEnteredLink = (link) => {
    console.log('beforelink', link);
    validate(link, state.rssLinks)
      .then((validURL) => {
        console.log('after validate', validURL)
        watchedState.formState = 'sending';
        console.log('Before getData', getData);
        return getData(validURL);
      })
      .then((rss) => {
        console.log(rss)
        const parsedRss = parse(rss.data.contents);
        console.log('going through parsed')
        parsedRss.feed.id = uniqueId();
        parsedRss.feed.feedLink = link;
        console.log('before change state', watchedState.feeds)
        console.log('before change','STATE', state.formState)
        watchedState.feeds.push(parsedRss.feed);
        console.log('after watched state')
        parsedRss.posts.forEach((post) => {
          console.log('going through post', post)
          const { postTitle, postDescr, postLink } = post,
          postID = uniqueId(),
          feedID = parsedRss.feed.id;
          watchedState.posts.push({ postTitle, postDescr, postLink, postID, feedID });
        });
        console.log('before succes')
        state.rssLinks.push(link);
        state.error = '';
        watchedState.formState = 'success';
        console.log()
      })
      .catch((err) => {
        console.log(
          'catch err'
        )
        state.error = err.type ?? err.message.toLowerCase();
        watchedState.formState = 'error';
      });
  };

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    handleEnteredLink(formData.get('url'));
  });

  elements.postsContainer.addEventListener('click', (e) => {
    e.preventDefault();
    state.currentVisitedPostID = e.target.dataset.id;
    watchedState.visitedPostsID.push(e.target.dataset.id);
  });

  updateRss();
};