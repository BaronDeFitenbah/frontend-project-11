export default (link, rssLinks) => {
    const schemaStr = yup.string().required().url().trim(),
        schemaMix = yup.mixed().notOneOf([rssLinks]);
    return schemaStr.validate(link)
      .then((url) => schemaMix.validate(url));
}