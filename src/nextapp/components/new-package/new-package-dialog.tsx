import * as React from 'react';
import api from '@/shared/services/api';
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
} from '@chakra-ui/react';
import { useMutation } from 'react-query';

import { ADD_ENV, ADD_PACKAGE } from './queries';

interface NewPackageDialogProps {
  open: boolean;
  onClose: () => void;
}

const NewPackageDialog: React.FC<NewPackageDialogProps> = ({
  open,
  onClose,
}) => {
  const packageMutation = useMutation((name: string) =>
    api(ADD_PACKAGE, { name })
  );
  // const environmentMutation = useMutation((packageId: string, name: string) =>
  //   api(ADD_ENV, { packageId, name })
  // );
  const form = React.useRef<HTMLFormElement>();
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createPackage();
  };
  const createPackage = async () => {
    if (form.current) {
      const data = new FormData(form.current);

      if (form.current.checkValidity()) {
        const packageName = data.get('name') as string;
        // const environment = data.get('environment') as string;
        const res = await packageMutation.mutateAsync(packageName);
        // await environmentMutation.mutateAsync(packageName, environment);
        console.log(res);
      }
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose}>
      <ModalOverlay />
      <ModalContent borderRadius="4px">
        <ModalHeader>Create Package</ModalHeader>
        <ModalBody>
          <form ref={form} onSubmit={onSubmit}>
            <FormControl isRequired mb={4}>
              <FormLabel>Package Name</FormLabel>
              <Input placeholder="Package Name" name="name" />
            </FormControl>
            <FormControl as="fieldset" isRequired>
              <FormLabel as="legend">Environment</FormLabel>
              <RadioGroup defaultValue="dev">
                <Stack>
                  <Radio name="environment" value="dev">
                    Development
                  </Radio>
                  <Radio name="environment" value="test">
                    Test
                  </Radio>
                  <Radio name="environment" value="sandbox">
                    Sandbox
                  </Radio>
                  <Radio name="environment" value="prod">
                    Production
                  </Radio>
                  <Radio name="environment" value="other">
                    Other
                  </Radio>
                </Stack>
              </RadioGroup>
              <FormHelperText>
                Select the first environment for this package
              </FormHelperText>
            </FormControl>
          </form>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button onClick={onClose}>Cancel</Button>
            <Button variant="primary" onClick={createPackage}>
              Create
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NewPackageDialog;
