import React from 'react';
import { Link } from 'bisheng/router';
import collect from 'bisheng/collect';
import { Helmet } from 'react-helmet-async';
import Layout from './Layout';
import Demo from './Demo'

const Post = (props) => {
  const { pageData, utils, demo, locale } = props;
  const { meta, description, content } = pageData;
  const leftChildren = []
  const rightChildren = []
  const demoValues = Object.values(demo)
  demoValues
    .sort((a, b) => a.meta.order - b.meta.order)
    .forEach((demoData, index) => {
      const demoElem = (
        <Demo
          {...demoData}
          locale={locale}
          location={location}
          key={demoData.meta.filename}
          utils={utils}
          expand={false}
        />
      );
      if (index % 2 === 0) {
        leftChildren.push(demoElem);
      } else {
        rightChildren.push(demoElem);
      }
    })
  return (
    <Layout {...props}>
      <div className="hentry">
        <Helmet>
          <title>{meta.title}</title>
          <meta name="description" content={description} />
        </Helmet>
        <h1 className="entry-title">{meta.title}</h1>
        {
          !description ? null :
            <div className="entry-description">{utils.toReactComponent(description)}</div>
        }
        <div className="entry-content">{utils.toReactComponent(content)}</div>
        {leftChildren}
        {rightChildren}
        {/* {
          utils.toReactComponent(
            [
              'section',
              {
                className: 'markdown api-container',
              },
            ].concat(getChildren(doc.api || ['placeholder'])),
          )
        } */}

        <div className="entry-meta">
          {
            !meta.tags ? null :
              <span>
                in <span className="entry-tags">
                {
                  meta.tags.map((tag, index) =>
                    <Link to={`/tags#${tag}`} key={index}>{tag}</Link>
                  )
                }
                </span>
              </span>
          }
          {
            !meta.source ? null :
              <a className="source sep" href={meta.source}>
                {meta.source}
              </a>
          }
        </div>
      </div>
    </Layout>
  );
}

export default collect(async (nextProps) => {
  const { params, data, utils, themeConfig } = nextProps
  const { langeList } = themeConfig
  const [ component, locale = 'zh-cn' ] = params.c.split('-')
  const _l = locale === 'cn' ? 'zh-cn' : locale
  const componentStrArr = component.split('')
  componentStrArr[0] = componentStrArr[0].toLocaleUpperCase()
  const pageData = utils.get(data, ['src', 'component', componentStrArr.join('')])
  if (!pageData) {
    throw 404;
  }
  const demo = {}
  
  Object.keys(pageData.demo).forEach(async v => {
    const t = await pageData.demo[v]()
    const langs = t.content.filter(v => langeList.includes(v[1]))
    const langIndex = langs.map(v => t.content.findIndex(tt => tt === v))
    const descIndex = langIndex.map(v => v + 1)
    const currentIndex = t.content.findIndex((v) => v[1] === _l) + 1
    const currentDesc = t.content[currentIndex] || ''
    const arr =  ([]).concat(descIndex, langIndex)
    arr.forEach(v => {
      t.content[v] = ''
    })
    t.content[currentIndex] = currentDesc
    t.content = t.content.filter(Boolean)
    demo[v] = t
  })
  const [pageD, d] = await Promise.all([pageData.index[_l](), demo])
  return { pageData: pageD, demo: d,  locale: _l };
})(Post);

// TODO
// {%- if config.disqus %}
// {%- include "_disqus.html" %}
// {%- endif %}
// {%- if config.duoshuo %}
// {%- include "_duoshuo.html" %}
// {%- endif %}
