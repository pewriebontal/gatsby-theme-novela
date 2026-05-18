import React, { useEffect, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import Fuse from 'fuse.js';

import Headings from '@components/Headings';
import Layout from '@components/Layout';
import SEO from '@components/SEO';
import Section from '@components/Section';
import Icons from '@icons';
import mediaqueries from '@styles/media';
import ArticlesList from '../sections/articles/Articles.List';

import { IArticle } from '@types';

interface SearchItem {
  author: string;
  body: string;
  categories: string[];
  date: string;
  excerpt: string | React.ReactNode;
  hero?: IArticle['hero'];
  id: string;
  slug: string;
  timeToRead?: number;
  title: string | React.ReactNode;
}

interface SearchTemplateProps {
  location: Location;
  pageContext: {
    basePath: string;
    searchPath: string;
  };
}

const MIN_QUERY_LENGTH = 2;

const fuseOptions = {
  includeScore: true,
  ignoreLocation: true,
  minMatchCharLength: MIN_QUERY_LENGTH,
  threshold: 0.35,
  includeMatches: true,
  keys: [
    { name: 'title', weight: 0.4 },
    { name: 'excerpt', weight: 0.25 },
    { name: 'body', weight: 0.2 },
    { name: 'author', weight: 0.1 },
    { name: 'categories', weight: 0.05 },
  ],
};

function getInitialQuery(location: Location) {
  if (!location.search) return '';
  return new URLSearchParams(location.search).get('q') || '';
}

const highlightMatches = (text: string, matches: readonly Fuse.FuseResultMatch[] = [], key: string) => {
  const match = matches.find((m) => m.key === key);
  if (!match || !match.indices || match.indices.length === 0) return text;

  let result: React.ReactNode[] = [];
  let lastIndex = 0;

  match.indices.forEach(([start, end], i) => {
    if (start > lastIndex) {
      result.push(text.slice(lastIndex, start));
    }
    result.push(
      <mark key={`${key}-${i}`} style={{ backgroundColor: 'rgba(255, 225, 0, 0.4)', color: 'inherit', borderRadius: '2px', padding: '0 2px' }}>
        {text.slice(start, end + 1)}
      </mark>
    );
    lastIndex = end + 1;
  });

  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }

  return <>{result}</>;
};

const SearchPage: React.FC<SearchTemplateProps> = ({
  location,
}) => {
  const [searchIndex, setSearchIndex] = useState<SearchItem[]>([]);
  const [query, setQuery] = useState(getInitialQuery(location));
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    fetch('/search-index.json')
      .then((res) => res.json())
      .then((data) => setSearchIndex(data))
      .catch((err) => console.error('Failed to load search index', err));
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 200);
    return () => clearTimeout(handler);
  }, [query]);

  const fuse = useMemo(
    () => new Fuse<SearchItem>(searchIndex, fuseOptions),
    [searchIndex],
  );

  const trimmedQuery = debouncedQuery.trim();
  const hasSearchQuery = trimmedQuery.length >= MIN_QUERY_LENGTH;
  const hasQuery = query.length > 0;

  const results = useMemo(() => {
    if (!hasSearchQuery) return searchIndex as unknown as IArticle[];
    return fuse.search(trimmedQuery).map((result) => {
      const item = { ...result.item };
      item.title = highlightMatches(item.title as string, result.matches, 'title');
      item.excerpt = highlightMatches(item.excerpt as string, result.matches, 'excerpt');
      return item;
    }) as unknown as IArticle[];
  }, [fuse, hasSearchQuery, searchIndex, trimmedQuery]);

  return (
    <Layout>
      <SEO
        pathname={location.pathname}
        title="Search"
        description="Search articles by title, author, category, excerpt, and body content."
      />
      <Section narrow>
        <Hero>
          <HiddenHeading>Search articles</HiddenHeading>
          <SearchControl>
            <SearchInput
              aria-label="Search archive"
              autoComplete="off"
              autoFocus
              name="q"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search the archive"
              type="text"
              value={query}
            />
            {hasQuery ? (
              <ClearButton
                aria-label="Clear search"
                onClick={() => setQuery('')}
                type="button"
              >
                <Icons.Ex fill="currentColor" />
              </ClearButton>
            ) : (
              <SearchIcon aria-hidden="true">
                <Icons.Search fill="currentColor" />
              </SearchIcon>
            )}
          </SearchControl>
        </Hero>
      </Section>

      <Section narrow>
        <ResultsMeta>
          {hasSearchQuery
            ? `${results.length} match${results.length === 1 ? '' : 'es'}`
            : `${searchIndex.length} stories in the archive`}
        </ResultsMeta>

        {results.length > 0 ? (
          <ArticlesList articles={results} alwaysShowAllDetails />
        ) : (
          <EmptyState>
            <EmptyTitle>No articles found</EmptyTitle>
            <EmptyText>{trimmedQuery}</EmptyText>
          </EmptyState>
        )}
      </Section>
    </Layout>
  );
};

export default SearchPage;

const Hero = styled.div`
  position: relative;
  z-index: 1;
  margin: 120px auto 72px;

  ${mediaqueries.desktop`
    margin: 100px auto 64px;
  `}

  ${mediaqueries.phablet`
    margin: 72px auto 44px;
  `}
`;

const HiddenHeading = styled.h1`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

const SearchControl = styled.div`
  position: relative;
  width: 100%;
  color: ${(p) => p.theme.colors.primary};
`;

const SearchInput = styled.input`
  display: block;
  width: 100%;
  height: 72px;
  padding: 0 58px 0 0;
  border: 0;
  border-bottom: 2px solid ${(p) => p.theme.colors.horizontalRule};
  border-radius: 0;
  background: transparent;
  color: ${(p) => p.theme.colors.primary};
  font-size: 38px;
  font-weight: 600;
  line-height: 1.2;
  transition: ${(p) => p.theme.colorModeTransition}, border-color 0.25s ease;

  &::placeholder {
    color: ${(p) => p.theme.colors.secondary};
    opacity: 0.4;
  }

  &:focus {
    border-color: ${(p) => p.theme.colors.accent};
  }

  ${mediaqueries.phablet`
    height: 60px;
    padding-right: 46px;
    font-size: 27px;
  `}
`;

const SearchIcon = styled.span`
  position: absolute;
  right: 0;
  top: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  color: ${(p) => p.theme.colors.primary};
  opacity: 0.28;
  transform: translateY(-50%);
`;

const ClearButton = styled.button`
  position: absolute;
  right: 0;
  top: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  color: ${(p) => p.theme.colors.primary};
  opacity: 0.35;
  transform: translateY(-50%);
  transition: opacity 0.25s ease;

  &:hover,
  &:focus {
    opacity: 1;
  }

  &[data-a11y='true']:focus::after {
    content: '';
    position: absolute;
    left: -10%;
    top: -10%;
    width: 120%;
    height: 120%;
    border: 2px solid ${(p) => p.theme.colors.accent};
    background: rgba(255, 255, 255, 0.01);
    border-radius: 50%;
  }
`;

const ResultsMeta = styled.p`
  position: relative;
  z-index: 1;
  margin: 0 0 42px;
  color: ${(p) => p.theme.colors.grey};
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
  text-transform: uppercase;
  letter-spacing: 0.1em;

  ${mediaqueries.phablet`
    margin-bottom: 30px;
    font-size: 13px;
  `}
`;

const EmptyState = styled.div`
  position: relative;
  z-index: 1;
  margin: 0 auto 120px;
  max-width: 540px;
  padding-top: 35px;
  border-top: 1px solid ${(p) => p.theme.colors.horizontalRule};
  text-align: center;
`;

const EmptyTitle = styled(Headings.h2)`
  margin-bottom: 10px;
`;

const EmptyText = styled.p`
  color: ${(p) => p.theme.colors.grey};
  font-size: 16px;
  line-height: 1.6;
`;
