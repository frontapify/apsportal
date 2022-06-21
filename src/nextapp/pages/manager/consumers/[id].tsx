import * as React from 'react';
import api, { useApi } from '@/shared/services/api';
import {
  Avatar,
  Box,
  Container,
  Divider,
  Flex,
  Heading,
  Icon,
  Table,
  Tag,
  Th,
  Tr,
  Tbody,
  Td,
  Text,
  Thead,
  Wrap,
  WrapItem,
  Button,
  useDisclosure,
  Code,
} from '@chakra-ui/react';
import breadcrumbs from '@/components/ns-breadcrumb';
import Card from '@/components/card';
import groupBy from 'lodash/groupBy';
import PageHeader from '@/components/page-header';
import { dehydrate } from 'react-query/hydration';
import { QueryClient } from 'react-query';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { Environment, Product, Query } from '@/shared/types/query.types';
import { gql } from 'graphql-request';
import { IoLayers } from 'react-icons/io5';
import BusinessProfile from '@/components/business-profile';
import ClientRequest from '@/components/client-request';
import ConsumerEditDialog from '@/components/access-request/edit-dialog';
import ProfileCard from '@/components/profile-card';
import { uid } from 'react-uid';
import GrantAccessDialog from '@/components/access-request/grant-access-dialog';
import EnvironmentTag from '@/components/environment-tag';
import { env } from 'process';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params;
  const queryClient = new QueryClient();
  const queryKey = ['consumer', id];

  await queryClient.prefetchQuery(
    queryKey,
    async () =>
      await api<Query>(
        query,
        { id, serviceAccessId: id },
        {
          headers: context.req.headers as HeadersInit,
        }
      )
  );

  return {
    props: {
      id,
      dehydratedState: dehydrate(queryClient),
      queryKey,
    },
  };
};

const ConsumerPage: React.FC<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ id, queryKey }) => {
  const { data } = useApi(
    queryKey,
    {
      query,
      variables: { id, serviceAccessId: id },
    },
    { suspense: false }
  );
  const { isOpen, onClose, onToggle } = useDisclosure();
  const consumer = data?.getNamespaceConsumerAccess;
  const application = data?.getNamespaceConsumerAccess?.application;
  const products = Object.keys(groupBy(consumer?.prodEnvAccess, 'productName'));

  function renderRow(product: Product, environment: Environment) {
    const tags = [];
    const plugins = [];
    environment.services.forEach((d) => {
      consumer.plugins
        .filter((p) => p.service?.name === d.name || p.route?.name === d.name)
        .forEach((p) => {
          plugins.push(p);
          tags.push(
            <Tag key={d.name} variant="outline">
              {p.name}
            </Tag>
          );
        });
    });

    return (
      <Tr key={uid(environment.id)}>
        <Td>
          <EnvironmentTag name={environment.name} />
        </Td>
        <Td>
          {environment.services.length > 0 && <Wrap spacing={2}>{tags}</Wrap>}
          {environment.services.length === 0 && (
            <Text as="em" color="bc-component">
              No restrictions added
            </Text>
          )}
        </Td>
        <Td textAlign="right">
          <ConsumerEditDialog
            prodEnvId={environment.id}
            queryKey={queryKey}
            serviceAccessId={id}
          />
        </Td>
      </Tr>
    );
  }

  function Detail({
    children,
    title,
  }: {
    children: React.ReactNode;
    title?: string;
  }) {
    return (
      <Box px={9} py={6} flex={1} overflow="hidden">
        {title && (
          <Heading size="sm" mb={2}>
            {title}:
          </Heading>
        )}
        {children}
      </Box>
    );
  }

  return (
    <>
      <Head>
        <title>{`Consumers | ${consumer.owner?.name}`}</title>
      </Head>
      <GrantAccessDialog
        consumer={consumer}
        isOpen={isOpen}
        onClose={onClose}
        queryKey={queryKey}
      />
      <Container maxW="6xl">
        <PageHeader
          actions={<Button onClick={onToggle}>Grant Access</Button>}
          breadcrumb={breadcrumbs([
            { href: '/manager/consumers', text: 'Consumers' },
            {
              text: consumer.owner?.name,
            },
          ])}
          title={consumer.owner?.name}
        />
        <Box as="section" mb={9}>
          <Box as="header" mb={4}>
            <Heading size="md">Consumer Details</Heading>
          </Box>
          <Flex bgColor="white">
            <Detail title="Application">
              <Flex align="center">
                <Avatar
                  bgColor="bc-gray"
                  icon={<Icon as={IoLayers} color="bc-blue" />}
                  bg="bc-gray"
                />
                <Text ml={2}>{application?.name}</Text>
              </Flex>
            </Detail>
            <Detail title="Application Owner">
              <ProfileCard data={application?.owner} overflow="hidden" />
            </Detail>
          </Flex>
          <Divider />
          <Flex bgColor="white">
            <Detail title="Labels">
              <Wrap spacing={2.5}>
                {consumer.labels.map((label) => (
                  <WrapItem key={uid(label)}>
                    <Tag bgColor="white" variant="outline">
                      {`${label.labelGroup} = ${label.values.join(', ')}`}
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
            </Detail>
            <Detail>
              <ClientRequest fallback="loading...">
                <BusinessProfile serviceAccessId={id} />
              </ClientRequest>
            </Detail>
          </Flex>
        </Box>
        <Box as="section">
          <Box as="header" mb={4}>
            <Heading size="md">{`Products (${products.length ?? 0})`}</Heading>
          </Box>
          {products.map((p) => (
            <Card key={uid(p)} heading={p} mb={9}>
              <Table>
                <Thead>
                  <Tr>
                    <Th width="25%">Environment</Th>
                    <Th colSpan={2}>Restrictions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data.getNamespaceConsumerAccess?.prodEnvAccess
                    .filter((d) => d.productName === p)
                    .map((d) => (
                      <Tr key={uid(d)}>
                        <Td>
                          <EnvironmentTag name={d.environment?.name} />
                        </Td>
                        <Td>
                          {d.plugins.length > 0 && (
                            <Wrap spacing={2}>
                              {d.plugins.map((p) => (
                                <Tag key={p.name} variant="outline">
                                  {p.name}
                                </Tag>
                              ))}
                            </Wrap>
                          )}
                          {d.plugins.length === 0 && (
                            <Text as="em" color="bc-component">
                              No restrictions added
                            </Text>
                          )}
                        </Td>
                        <Td textAlign="right">
                          <ConsumerEditDialog
                            prodEnvId={d.environment.id}
                            queryKey={queryKey}
                            serviceAccessId={id}
                          />
                        </Td>
                      </Tr>
                    ))}
                </Tbody>
              </Table>
            </Card>
          ))}
        </Box>
      </Container>
    </>
  );
};

export default ConsumerPage;

const query = gql`
  query GetConsumer($id: ID!, $serviceAccessId: ID!) {
    getNamespaceConsumerAccess(serviceAccessId: $serviceAccessId) {
      application {
        name
      }
      owner {
        name
        username
        email
      }
      labels {
        labelGroup
        values
      }
      prodEnvAccess {
        productName
        environment {
          flow
          name
          id
          additionalDetailsToRequest
        }
        plugins {
          name
        }
        revocable
        authorization
        request {
          name
          isIssued
          isApproved
          isComplete
          additionalDetails
        }
      }
    }
  }
`;
