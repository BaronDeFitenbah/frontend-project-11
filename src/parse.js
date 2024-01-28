export default (data) => {
    const parser = new DOMParser();
    const Doc = parser.parseFromString(data, 'application/xml');
  
    if (Doc.querySelector('parsererror')) throw new Error('invalid rss');
  
    const feedTitle = Doc.querySelector('title').textContent;
    const feedDescr = Doc.querySelector('description').textContent;
  
    const posts = [];
    const postsElems = Doc.querySelectorAll('item');
    postsElems.forEach((post) => {
      const postTitle = post.querySelector('title').textContent;
      const postDescr = post.querySelector('description').textContent;
      const postLink = post.querySelector('link').textContent;
      posts.push({
        postTitle, postDescr, postLink,
      });
    });
  
    return {
      feed: {
        feedTitle, feedDescr,
      },
      posts,
    };
}