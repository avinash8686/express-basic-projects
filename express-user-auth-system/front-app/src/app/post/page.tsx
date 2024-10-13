"use client";

import {
  Icon,
  Tooltip,
  Heading,
  Button,
  Text,
  Box,
  Flex,
  List,
  ListItem,
  ListIcon,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  useDisclosure,
} from "@chakra-ui/react";
import { IoLogOut } from "react-icons/io5";

import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginForm } from "@/utils/forms/loginForm";
import axios from "axios";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import { MdEditDocument } from "react-icons/md";
import EditPost from "@/components/EditPost";
import { MdDelete } from "react-icons/md";

export default function Homepage() {
  const [posts, setPosts] = useState<any>();

  const [editPostData, setEditPostData] = useState<any>();

  const [editingPost, setEditingPost] = useState<boolean>(false);

  const getUserPosts = async () => {
    const accessToken = localStorage.getItem("token");

    try {
      const response = await axios.get("http://localhost:5000/api/posts/", {
        headers: {
          "auth-token": accessToken,
        },
      });
      setPosts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserPosts();
  }, []);

  const editAPost = (postId: string) => {
    console.log("editing post", editingPost);
    const post = posts.filter((el: any) => el._id === postId);
    setEditPostData(post);
    setEditingPost(true);
  };

  const deleteAPost = async (postId: string) => {
    const accessToken = localStorage.getItem("token");
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/posts/${postId}`,
        {
          headers: {
            "auth-token": accessToken,
          },
        }
      );
      getUserPosts();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar getUserPosts={getUserPosts} />
      <Flex
        mt="12"
        mb="20"
        h="fit-content"
        justify={"center"}
        alignItems={"center"}
        direction={"column"}
      >
        <Text color="white" fontSize={"4xl"} fontWeight={"semibold"}>
          Posts
        </Text>
        {posts &&
          posts.length > 0 &&
          posts.map((post: any) => (
            <Card maxW="lg" mt="4">
              <CardHeader>
                <Flex justifyContent={"space-between"}>
                  <Heading size="lg">{post.title}</Heading>
                  <Flex gap="2">
                    <Tooltip hasArrow label="Edit" bg="gray.300" color="black">
                      <Button
                        bgColor={"transparent"}
                        _hover={{
                          bgColor: "transparent",
                        }}
                        p="0"
                        cursor={"pointer"}
                        onClick={() => editAPost(post._id)}
                      >
                        <Icon
                          as={MdEditDocument}
                          color="black"
                          zIndex={50}
                          boxSize="6"
                        />
                      </Button>
                    </Tooltip>
                    <Tooltip
                      hasArrow
                      label="Delete"
                      bg="gray.300"
                      color="black"
                    >
                      <Button
                        bgColor={"transparent"}
                        _hover={{
                          bgColor: "transparent",
                        }}
                        p="0"
                        cursor={"pointer"}
                        onClick={() => deleteAPost(post._id)}
                      >
                        <Icon
                          as={MdDelete}
                          color="black"
                          zIndex={50}
                          boxSize="6"
                        />
                      </Button>
                    </Tooltip>
                  </Flex>
                </Flex>
              </CardHeader>
              <CardBody>
                <Text>{post.body}</Text>
              </CardBody>
            </Card>
          ))}
      </Flex>
      {editPostData && editPostData.length > 0 && (
        <EditPost
          editingPost={editingPost}
          getUserPosts={getUserPosts}
          editPostData={editPostData}
          setEditingPost={setEditingPost}
        />
      )}
    </>
  );
}
