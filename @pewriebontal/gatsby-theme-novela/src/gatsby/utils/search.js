function normalizePath(pathname) {
  return `/${pathname || ''}`.replace(/\/\/+/g, '/').replace(/\/$/, '') || '/';
}

function buildSearchPath(searchPath, basePath) {
  if (searchPath) return normalizePath(searchPath);

  const normalizedBasePath = normalizePath(basePath || '/');
  return normalizedBasePath === '/'
    ? '/search'
    : normalizePath(`${normalizedBasePath}/search`);
}

module.exports = {
  normalizePath,
  buildSearchPath,
};
