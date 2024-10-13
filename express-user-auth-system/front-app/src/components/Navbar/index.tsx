import React from "react";
import {
  Flex,
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Icon,
  Tooltip,
} from "@chakra-ui/react";
import { postForm } from "@/utils/forms/postForm";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { IoLogOut } from "react-icons/io5";

interface Props {
  getUserPosts: Function;
}

const Navbar: React.FC<Props> = ({ getUserPosts }) => {
  console.log("inside navbar,,,,,,");
  const router = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    unregister,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(postForm),
    criteriaMode: "firstError",
    mode: "onChange",
    reValidateMode: "onChange",
  });

  type IPostForm = yup.InferType<typeof postForm>;

  const onSubmit = (data: IPostForm) => {
    const accessToken = localStorage.getItem("token");

    axios
      .post("http://localhost:5000/api/posts/", data, {
        headers: {
          "Content-Type": "application/json",
          "auth-token": accessToken,
        },
      })
      .then(function (response: any) {
        reset();
        getUserPosts();
        onClose();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    router.replace("/");
  };

  console.log("ttl", getValues("title"));

  return (
    <>
      <Box className="glass" w="full" h="80px">
        <Flex
          justifyContent="space-between"
          alignItems="center"
          w="80%"
          h="full"
          mx="auto"
        >
          <Text color="white" fontSize={"2xl"} fontWeight={"semibold"}>
            Post'd
          </Text>
          <Flex alignItems={"center"} h="fit-content" gap="6">
            <Button onClick={onOpen}>Create Post</Button>
            <Tooltip hasArrow label="Logout" bg="gray.300" color="black">
              <Button
                bgColor={"transparent"}
                _hover={{
                  bgColor: "transparent",
                }}
                cursor={"pointer"}
                onClick={logout}
              >
                <Icon as={IoLogOut} color="white" zIndex={50} boxSize="6" />
              </Button>
            </Tooltip>
          </Flex>
        </Flex>
      </Box>
      <Modal onClose={onClose} size={"lg"} isOpen={isOpen}>
        <ModalOverlay
          bg="none"
          backdropFilter="auto"
          backdropInvert="80%"
          backdropBlur="2px"
        />
        <ModalContent
          p="8"
          mx="auto"
          mt="10%"
          backgroundColor={"white"}
          borderRadius={"20px"}
          width="50%"
        >
          <Box display={"flex"} justifyContent={"space-between"} w="100%">
            <Text
              width="300px"
              display={"block"}
              fontSize={"24px"}
              fontWeight={700}
            >
              Create a post
            </Text>
            <ModalCloseButton />
          </Box>
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input
                  border="1px solid lightgrey"
                  borderRadius="14px"
                  p="6"
                  placeholder="Title...."
                  {...register("title")}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Post</FormLabel>
                <Textarea
                  border="1px solid lightgrey"
                  borderRadius="14px"
                  p="6"
                  placeholder="Post....."
                  resize="none"
                  {...register("body")}
                />
              </FormControl>
              <Button
                mt="4"
                backgroundColor="black"
                color="white"
                px="12"
                py="6"
                borderRadius="14px"
                type="submit"
              >
                Post
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Navbar;
