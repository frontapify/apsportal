import * as React from 'react';
import { Avatar, Box, BoxProps, Flex, Text } from '@chakra-ui/react';
import { User } from '@/shared/types/query.types';
import { UserData } from '@/shared/types/app.types';

interface ProfileCardProps extends BoxProps {
  data: User | UserData;
  variant?: 'flat' | 'raised';
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  data,
  variant,
  ...rest
}) => {
  const isRaised = variant === 'raised';

  return (
    <Flex
      align="stretch"
      boxShadow={isRaised ? 'md' : 'none'}
      p={isRaised ? 4 : 0}
      borderRadius={4}
      {...rest}
    >
      <Avatar name={data.name} />
      <Flex
        flex={1}
        ml={2}
        lineHeight="4"
        direction="column"
        justify="space-between"
        py={1}
      >
        <Text isTruncated fontWeight="bold">
          {data.name}
          <Text isTruncated as="span" fontWeight="normal" color="gray.400">
            {` • ${data.username}`}
          </Text>
        </Text>
        <Text fontWeight="normal" color="bc-component">
          {data.email}
        </Text>
      </Flex>
    </Flex>
  );
};

export default ProfileCard;
