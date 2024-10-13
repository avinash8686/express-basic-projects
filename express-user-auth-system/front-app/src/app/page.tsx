import Image from "next/image";
import styles from "./page.module.css";
import { Box } from "@chakra-ui/react";
import Homepage from "@/components/HomePage";

export default function Home() {
  return (
    <Box width="full" height="auto" overflow={"hidden"} maxW="1240px" mx="auto">
      <Homepage />
    </Box>
  );
}
