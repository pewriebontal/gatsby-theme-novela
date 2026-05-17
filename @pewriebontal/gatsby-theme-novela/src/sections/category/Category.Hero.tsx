import React from 'react';
import styled from '@emotion/styled';

import mediaqueries from '@styles/media';

const CategoryHero = ({ category }) => {
  return (
    <Hero>
      <Subheading>Articles in category</Subheading>
      <Heading>{category}</Heading>
    </Hero>
  );
};

export default CategoryHero;

const Hero = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 100px auto 110px;

  ${mediaqueries.desktop`
    margin: 100px auto 70px;
  `}

  ${mediaqueries.tablet`
    margin: 100px auto 70px;
  `}

  ${mediaqueries.phablet`
    margin: 80px auto 80px;
  `}
`;

const Subheading = styled.p`
  margin: 0 auto;
  max-width: 450px;
  color: ${p => p.theme.colors.grey};
  font-size: 16px;
  font-family: ${p => p.theme.fonts.sansSerif};
  line-height: 1.4;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
  margin-bottom: 15px;

  ${mediaqueries.phablet`
    font-size: 14px;
    margin-bottom: 10px;
  `}
`;

const Heading = styled.h1`
  font-style: normal;
  font-weight: 600;
  font-size: 52px;
  line-height: 1.15;
  font-family: ${p => p.theme.fonts.sansSerif};
  color: ${p => p.theme.colors.primary};
  text-transform: capitalize;
  text-align: center;

  ${mediaqueries.desktop`
    font-size: 38px;
  `}

  ${mediaqueries.phablet`
    font-size: 32px;
  `}
`;
