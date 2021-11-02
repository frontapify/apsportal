import * as React from 'react';
import { BiLinkExternal } from 'react-icons/bi';
import {
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
  Link,
  Text,
} from '@chakra-ui/react';
import { FaLock } from 'react-icons/fa';
import { HiChartBar } from 'react-icons/hi';
import NextLink from 'next/link';
import { RiEarthFill } from 'react-icons/ri';
import { Dataset, Environment, Product } from '@/shared/types/query.types';

export interface ApiEnvironment extends Environment {
  anonymous: boolean;
}

export interface ApiProduct extends Product {
  environments: ApiEnvironment[];
}

export interface ApiDataset extends Dataset {
  products: ApiProduct[];
}

export interface ApiProductItemProps {
  data: ApiProduct;
  id: string;
}

const ApiProductItem: React.FC<ApiProductItemProps> = ({ data, id }) => {
  const isPublic = data.environments.some((e) => e.anonymous);
  const accessLink = `/devportal/requests/new/${id}`;

  return (
    <>
      {' '}
      <Flex px={9} py={7}>
        <Grid gap={4} flex={1} templateRows="auto" mr={12}>
          <GridItem>
            <Flex align="center" mb={2}>
              <Flex align="center" width={8}>
                <Icon
                  as={isPublic ? RiEarthFill : FaLock}
                  color="bc-blue"
                  boxSize="5"
                />
              </Flex>
              <Heading size="xs">{data.name}</Heading>
            </Flex>
            {data.description && (
              <Text ml={8} fontSize="sm">
                {data.description}
              </Text>
            )}
          </GridItem>
        </Grid>
        {!isPublic && (
          <NextLink href={isPublic ? '#try-url' : accessLink}>
            <Button
              rightIcon={isPublic ? <Icon as={BiLinkExternal} /> : undefined}
            >
              {isPublic ? 'Try this API' : 'Request Access'}
            </Button>
          </NextLink>
        )}
      </Flex>
      {isPublic && (
        <Flex px={9} py={7}>
          <Grid gap={4} flex={1} templateRows="auto" mr={12}>
            <GridItem>
              <Flex align="center" mb={2}>
                <Flex align="center" width={8}>
                  <Icon as={HiChartBar} color="bc-blue" boxSize="5" />
                </Flex>
                <Heading size="xs">Limits</Heading>
              </Flex>
              {data.description && (
                <Text ml={8} fontSize="sm">
                  Public access has a rate limit of 1000 requests per hour. For
                  elevated access, please{' '}
                </Text>
              )}
              <Text ml={8} fontSize="sm">
                For elevated access, please{' '}
                <NextLink passHref href={accessLink}>
                  <Link>Request Access</Link>
                </NextLink>
              </Text>
            </GridItem>
          </Grid>
        </Flex>
      )}
    </>
  );
};

export default ApiProductItem;
