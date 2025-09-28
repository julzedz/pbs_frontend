import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Button,
  Stack,
  Center,
  Spinner,
  Flex,
} from "@chakra-ui/react";
import { useAppStore } from "../store";
import { useNavigate } from "react-router-dom";
import { getMyPropertiesCount } from "../api";
import ProfileCard from "../components/ProfileCard";
import { toaster } from "../components/ui/toaster";

const DashboardPage = () => {
  const user = useAppStore((state) => state.user);
  const logout = useAppStore((state) => state.logout);
  const [listingCount, setListingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCount = async () => {
      setLoading(true);
      try {
        const res = await getMyPropertiesCount(user.id);
        setListingCount(res.data.count);
        console.log(res.data);
        
      } catch {
        // Optionally show error toast here
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchCount();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/signin");
    } catch {
      toaster.create({ description: "Logout failed", type: "error" });
    }
  };

  if (loading)
    return (
      <Flex minH="60vh" align="center" justify="center">
        <Spinner size="xl" />
      </Flex>
    );

  return (
    <Box maxW="5xl" mx="auto" py={10} px={4}>
      {/* Greeting and Post Property Button - Responsive */}
      <Stack
        direction={{ base: "column", md: "row" }}
        align={{ md: "center" }}
        justify="space-between"
        mb={8}
        spacing={4}
      >
        <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" w="full">
          Good day, {user.first_name} {user.last_name}
        </Text>
        <Button
          colorScheme="purple"
          size="lg"
          alignSelf={{ base: "flex-start", md: "auto" }}
          onClick={() => navigate("/post-property")}
        >
          Post a Property
        </Button>
      </Stack>

      {/* Profile Card and Listings Card - Uniform Size */}
      <Flex
        direction={{ base: "column", md: "row" }}
        gap={8}
        mb={8}
        align="stretch"
      >
        <Box w={{ base: "90vw", md: "full" }} flex={1} maxW="full">
          <ProfileCard user={user} large />
        </Box>
        <Box
          flex={1}
          maxW="full"
          borderWidth="1px"
          borderRadius="lg"
          p={6}
          bg="gray.50"
          boxShadow="md"
          textAlign="center"
          alignSelf="stretch"
        >
          <Text fontWeight="bold" fontSize="2xl" mb={2}>
            Listings
          </Text>
          <Text fontSize="5xl" color="purple.700" fontWeight="bold" mb={4}>
            {listingCount}
          </Text>
          <Button
            colorScheme="purple"
            size="lg"
            variant="outline"
            onClick={() => navigate("/my-listings")}
          >
            View my Listings
          </Button>
        </Box>
      </Flex>

      {/* Logout Button */}
      <Button
        colorScheme="red"
        size="lg"
        mt={4}
        onClick={handleLogout}
        alignSelf="flex-start"
      >
        Logout
      </Button>
    </Box>
  );
};

export default DashboardPage;
