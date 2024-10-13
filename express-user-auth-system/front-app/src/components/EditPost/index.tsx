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
import { useEffect, useState, useMemo } from "react";

interface Props {
  getUserPosts: Function;
  editPostData: any;
  editingPost: boolean;
  setEditingPost: Function;
}

const EditPost: React.FC<Props> = ({
  getUserPosts,
  editPostData,
  editingPost,
  setEditingPost,
}) => {
  const values = editPostData[0];
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
    values: values,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  type IPostForm = yup.InferType<typeof postForm>;

  const onSubmit = (data: IPostForm) => {
    const accessToken = localStorage.getItem("token");
    console.log("Post Data", data);
    const dataToPost = {
      title: data.title,
      body: data.body,
    };
    axios
      .patch(`http://localhost:5000/api/posts/${data._id}`, dataToPost, {
        headers: {
          "Content-Type": "application/json",
          "auth-token": accessToken,
        },
      })
      .then(function (response: any) {
        setEditingPost(false);
        getUserPosts();
        onClose();
      })
      .catch(function (error) {
        setEditingPost(false);
        console.log(error);
      });
  };

  const handleOnClose = () => {
    console.log(";;;;;;;;;;editing post", editingPost);
    setEditingPost(false);
    onClose();
  };

  useEffect(() => {
    if (editingPost) {
      onOpen();
    }
  }, [editingPost]);

  return (
    <>
      <Modal onClose={handleOnClose} size={"lg"} isOpen={isOpen}>
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
              Edit post
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
                  value={getValues(`title`)}
                  onChange={(e) => {
                    console.log(e.target.value);
                    setValue("title", e.target.value, {
                      shouldValidate: true,
                    });
                  }}
                  // {...register("title")}
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
                  value={getValues(`body`)}
                  onChange={(e) => {
                    console.log(e.target.value);
                    setValue("body", e.target.value, {
                      shouldValidate: true,
                    });
                  }}
                  // {...register("body")}
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
                Update
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditPost;
