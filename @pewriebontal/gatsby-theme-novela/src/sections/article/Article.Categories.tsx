import React from 'react';
import styled from '@emotion/styled';
import { Link } from 'gatsby';

import mediaqueries from '@styles/media';
import { toKebabCase } from '@utils';

interface ArticleCategoriesProps {
  categories?: string[];
}

const ArticleCategories: React.FC<ArticleCategoriesProps> = ({ categories }) => {
  if (!categories || categories.length === 0) return null;

  return (
    <CategoriesContainer aria-label="Article categories">
      {categories.map((category) => (
        <CategoryPill
          key={category}
          to={`/category/${toKebabCase(category)}`}
        >
          {category}
        </CategoryPill>
      ))}
    </CategoriesContainer>
  );
};

export default ArticleCategories;

const CategoriesContainer = styled.nav`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin: 0 16px;

  ${mediaqueries.phablet`
    margin: 16px 0 0 0;
    order: 3;
  `}
`;

const CategoryPill = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 12px;
  margin-right: 8px;
  background: ${p => p.theme.colors.hover};
  color: ${p => p.theme.colors.primary};
  border-radius: 24px;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.25s ease-in-out;
  text-decoration: none;

  &:last-of-type {
    margin-right: 0;
  }

  &:hover {
    background: ${p => p.theme.colors.accent};
    color: ${p => p.theme.colors.background};
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }

  ${mediaqueries.phablet`
    font-size: 10px;
    padding: 2px 8px;
    margin-right: 6px;
    margin-bottom: 6px;
  `}
`;
