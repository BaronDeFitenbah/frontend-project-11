export default (data) => {
    const parser = new DOMParser(),
    xml = parser.parseFromString(data, 'application/xml');
  
    if (xml.querySelector('parsererror')) throw new Error('invalid rss');
  
    const feedTitle = xml.querySelector('title').textContent;
    const feedDescr = xml.querySelector('description').textContent;
  
    const posts = [];
    const postsElems = xml.querySelectorAll('item');
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