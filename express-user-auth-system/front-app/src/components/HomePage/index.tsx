"use client";

import {
  Button,
  Text,
  Box,
  Flex,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";

export default function Homepage() {
  return (
    <Flex
      h="100vh"
      justify={"center"}
      alignItems={"center"}
      direction={"column"}
    >
      <Text color="white" fontSize={"4xl"} fontWeight={"semibold"}>
        Welcome to Post'd
      </Text>
      <Flex justifyContent={"center"} gap="4">
        <Button>
          <Link href="/signup">Signup</Link>
        </Button>
        <Button>
          <Link href="/login">Login</Link>
        </Button>
      </Flex>
    </Flex>
  );
}
