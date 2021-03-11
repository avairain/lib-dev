const path = require('path');

module.exports = {
  lazyLoad: true,
  pick: {
    component(markdownData) {
      const { filename } = markdownData.meta;
      if (!/^component/.test(filename) || /[/\\]demo$/.test(path.dirname(filename))) {
        return null;
      }
      return {
        meta: markdownData.meta,
      };
    },
  },
  plugins: [
    path.join(__dirname, '..', 'node_modules', 'bisheng-plugin-description'),
    'bisheng-plugin-toc?maxDepth=2&keepElem',
    '@ant-design/bisheng-plugin?injectProvider',
    'bisheng-plugin-react?lang=__react',
  ],
  routes: {
    path: '/',
    component: './template/Layout',
    childRoutes: [
      {
        path: 'archive',
        component: './template/Archive',
      },
      {
        path: 'component/:c',
        component: './template/Component'
      },
      {
        path: 'tags',
        component: './template/TagCloud',
      }
    ]
  }
};
