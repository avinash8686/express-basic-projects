"use client";

import {
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
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginForm } from "@/utils/forms/loginForm";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Homepage() {
  const router = useRouter();

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
    resolver: yupResolver(loginForm),
    criteriaMode: "firstError",
    mode: "onChange",
    reValidateMode: "onChange",
  });

  type ILoginForm = yup.InferType<typeof loginForm>;
  const onSubmit = (data: ILoginForm) => {
    axios
      .post("http://localhost:5000/api/user/login", {
        data,
      })
      .then(function (response: any) {
        localStorage.setItem("token", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        router.push("/post");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <Flex
      h="100vh"
      justify={"center"}
      alignItems={"center"}
      direction={"column"}
    >
      <Text color="white" fontSize={"4xl"} fontWeight={"semibold"}>
        Login
      </Text>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <FormControl>
          <FormLabel>Email address</FormLabel>
          <Input type="email" {...register("email")} />
          <Text>{errors?.email?.message}</Text>
          <FormHelperText>We'll never share your email.</FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input type="password" {...register("password")} />
          <Text>{errors?.password?.message}</Text>
        </FormControl>

        <Button mt="4" textAlign={"center"} type="submit">
          Login
        </Button>
      </form>
    </Flex>
  );
}
