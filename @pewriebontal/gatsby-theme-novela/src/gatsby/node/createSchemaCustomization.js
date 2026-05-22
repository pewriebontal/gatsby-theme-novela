module.exports = ({ actions }) => {
  const { createTypes } = actions;

  const typeDefs = `
    type PluginOptions {
      basePath: String
      rootPath: String
      search: Boolean
      searchPath: String
    }
    type SitePlugin implements Node {
      pluginOptions: PluginOptions
    }
    type Article implements Node {
      id: ID!
      slug: String!
      title: String!
      date: Date! @dateformat
      author: String!
      categories: [String]!
      excerpt(pruneLength: Int = 140): String!
      body: String!
      hero: File @fileByRelativePath
      timeToRead: Int
      canonical_url: String
    }
  `;

  createTypes(typeDefs);
};
