import * as React from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  useDisclosure,
  ButtonProps,
} from '@chakra-ui/react';

import LoginButtons from '../login-buttons';
import { useGlobal } from '@/shared/services/global';

interface LoginDialogProps {
  buttonText: string;
  buttonVariant?: ButtonProps['variant'];
}

const LoginDialog: React.FC<LoginDialogProps> = ({
  buttonText = 'Login',
  buttonVariant,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { identities } = useGlobal();
  const size = identities.developer.length > 2 ? '2xl' : 'lg';
  const isInline = buttonVariant === 'link';
  const buttonProps = !isInline
    ? {}
    : {
        fontWeight: 'normal',
        fontSize: 'inherit',
        color: 'bc-link',
        textDecor: 'underline',
      };

  return (
    <>
      <Button onClick={onOpen} variant={buttonVariant} {...buttonProps}>
        {buttonText}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size={size}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Login to request access</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={7}>
              Choose which of the options you want to authenticate with. You
              will go to a secure website to log in and automatically return.{' '}
            </Text>
            <Text>
              Access to certain features of the APS portal will be based on the
              account type that you choose.
            </Text>
          </ModalBody>

          <ModalFooter justifyContent="flex-start">
            <LoginButtons buttons={identities.developer} />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default LoginDialog;
