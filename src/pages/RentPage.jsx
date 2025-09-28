import React, { useEffect, useState } from "react";
import {
  Box,
  SimpleGrid,
  Spinner,
  Text,
  Skeleton,
  SkeletonText,
  Center,
  Flex,
  Button,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import PropertyCard from "../components/PropertyCard";
import { useAppStore } from "../store";
import InfiniteScroll from "react-infinite-scroll-component";

const PER_PAGE = 6;

const RentPage = () => {
  const [properties, setProperties] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [included] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const deletedPropertyIds = useAppStore((s) => s.deletedPropertyIds);

  const fetchProperties = async (pageNum = 1) => {
    try {
      const res = await API.get(`/api/v1/properties?page=${pageNum}`);
      const newProperties = res.data.data;
      if (pageNum === 1) {
        setProperties(newProperties);
      } else {
        setProperties((prev) => [...prev, ...newProperties]);
      }
      setHasMore(newProperties.length === PER_PAGE);
    } catch {
      setError("Failed to load properties.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchProperties(1);
    setPage(2);
  }, []);

  const fetchNext = () => {
    fetchProperties(page);
    setPage((prev) => prev + 1);
  };
  // Filter for rent properties
  const rentProperties = properties
    .filter((p) => p.attributes.purpose === "rent")
    .filter((p) => !deletedPropertyIds.includes(p.id));

  const renderSkeletonGrid = (count = 6) => (
    <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={4} spacing={6}>
      {Array.from({ length: count }).map((_, index) => (
        <Box
          key={index}
          bg="white"
          rounded="lg"
          boxShadow="md"
          overflow="hidden"
          w="full"
        >
          <Skeleton height="200px" />
          <Box p={4}>
            <SkeletonText mt="2" noOfLines={1} spacing="4" />
            <SkeletonText mt="4" noOfLines={2} spacing="4" />
          </Box>
        </Box>
      ))}
    </SimpleGrid>
  );

  if (loading && page === 2)
    return (
      <Box maxW="7xl" mx="20px" py={8} px={4}>
        <Flex align="baseline" justify="space-between" flexDir={{ base: "column", md: "row" }} mb={6}>
          <Text fontSize="2xl" fontWeight="bold">
            Properties for Rent
          </Text>
          <Text color="gray.500" fontSize="sm">
            Loading listings...
          </Text>
        </Flex>
        {renderSkeletonGrid(6)}
      </Box>
    );
  if (error)
    return (
      <Center minH="60vh">
        <Box textAlign="center">
          <Text color="red.400" mb={3}>
            {error}
          </Text>
          <Button onClick={() => window.location.reload()} colorScheme="purple">
            Retry
          </Button>
        </Box>
      </Center>
    );

  const isEmpty = rentProperties.length === 0 && !loading;

  return (
    <Box maxW="7xl" mx="auto" py={8} px={4}>
      <Flex align="baseline" justify="space-between" mb={6}>
        <Box>
          <Text fontSize="2xl" fontWeight="bold">
            Properties for Rent
          </Text>
          <Text color="gray.500" fontSize="sm">
            {rentProperties.length} results
          </Text>
        </Box>
      </Flex>

      {isEmpty ? (
        <Center minH="40vh">
          <Box textAlign="center">
            <Text fontWeight="semibold" fontSize="lg" mb={2}>
              No properties found
            </Text>
            <Text color="gray.600" mb={4}>
              Please check back later.
            </Text>
            <Button
              onClick={() => navigate("/")}
              colorScheme="purple"
              variant="outline"
            >
              Go to Home
            </Button>
          </Box>
        </Center>
      ) : (
        <InfiniteScroll
          dataLength={rentProperties.length}
          next={fetchNext}
          hasMore={hasMore}
          loader={<Box py={6}>{renderSkeletonGrid(3)}</Box>}
          endMessage={
            <Center py={6}>
              <Text color="gray.400">End of property list.</Text>
            </Center>
          }
        >
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={4} spacing={6}>
            {rentProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                included={included}
                onClick={() => navigate(`/rent/${property.id}`)}
              />
            ))}
          </SimpleGrid>
        </InfiniteScroll>
      )}
    </Box>
  );
};

export default RentPage;
