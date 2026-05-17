import React, { useMemo, useState } from 'react';
import styled from '@emotion/styled';
import Fuse from 'fuse.js';

import Headings from '@components/Headings';
import Layout from '@components/Layout';
import SEO from '@components/SEO';
import Section from '@components/Section';
import Icons from '@icons';
import mediaqueries from '@styles/media';
import ArticlesList from '../sections/articles/Articles.List';

interface SearchItem {
  author: string;
  body: string;
  categories: string[];
  date: string;
  excerpt: string;
  hero?: {
    narrow?: Record<string, unknown>;
    regular?: Record<string, unknown>;
  };
  id: string;
  slug: string;
  timeToRead?: number;
  title: string;
}

interface SearchTemplateProps {
  location: Location;
  pageContext: {
    searchIndex: SearchItem[];
  };
}

const MIN_QUERY_LENGTH = 2;

const fuseOptions = {
  includeScore: true,
  ignoreLocation: true,
  minMatchCharLength: MIN_QUERY_LENGTH,
  threshold: 0.35,
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

const SearchPage: React.FC<SearchTemplateProps> = ({
  location,
  pageContext,
}) => {
  const searchIndex = pageContext.searchIndex || [];
  const [query, setQuery] = useState(getInitialQuery(location));

  const fuse = useMemo(
    () => new Fuse<SearchItem>(searchIndex, fuseOptions),
    [searchIndex],
  );

  const trimmedQuery = query.trim();
  const hasSearchQuery = trimmedQuery.length >= MIN_QUERY_LENGTH;
  const hasQuery = query.length > 0;

  const results = useMemo(() => {
    if (!hasSearchQuery) return searchIndex;
    return fuse.search(trimmedQuery).map((result) => result.item);
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
          <ArticlesList articles={results as any} alwaysShowAllDetails />
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
