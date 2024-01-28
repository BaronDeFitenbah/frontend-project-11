import * as yup from 'yup';
export default (link, rssLinks) => {
    const schemaStr = yup.string().required().notOneOf(rssLinks).url().trim();
    return schemaStr.validate(link)}
