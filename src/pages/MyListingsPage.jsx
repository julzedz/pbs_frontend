import React, { useEffect, useState } from "react";
import { Box, SimpleGrid, Spinner, Text, Center } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store";
import { API } from "../api";
import PropertyCard from "../components/PropertyCard";
import InfiniteScroll from "react-infinite-scroll-component";

const PER_PAGE = 6;

const MyListingsPage = () => {
  const user = useAppStore((state) => state.user);
  const deletedPropertyIds = useAppStore((s) => s.deletedPropertyIds);
  const [properties, setProperties] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchMyProperties = async (pageNum = 1) => {
    if (!user?.id) return;
    // setLoading(true);
    try {
      const res = await API.get(
        `/api/v1/properties?user_id=${user.id}&page=${pageNum}`
      );
      const newProperties = res.data.data || [];
      setProperties((prev) =>
        pageNum === 1 ? newProperties : [...prev, ...newProperties]
      );
      setHasMore(newProperties.length === PER_PAGE);
    } catch {
      setError("Failed to load your listings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchMyProperties(1);
    setPage(2);
  }, [user?.id]);

  const fetchNext = () => {
    fetchMyProperties(page);
    setPage((prev) => prev + 1);
  };

  const visible = properties.filter((p) => !deletedPropertyIds.includes(p.id));

  if (loading && page === 2)
    return (
      <Center minH="60vh">
        <Spinner size="xl" />
      </Center>
    );
  if (error)
    return (
      <Center minH="60vh">
        <Text color="red.500">{error}</Text>
      </Center>
    );

  const isEmpty = visible.length === 0 && !loading;

  return (
    <Box maxW="7xl" mx="auto" py={8} px={4}>
      <Text fontSize="2xl" fontWeight="bold" mb={6}>
        My Listings
      </Text>
      {isEmpty ? (
        <Center minH="40vh">
          <Text color="gray.600">You haven't listed any properties yet.</Text>
        </Center>
      ) : (
        <InfiniteScroll
          dataLength={visible.length}
          next={fetchNext}
          hasMore={hasMore}
          loader={
            <Center my={4}>
              <Spinner />
            </Center>
          }
          endMessage={
            <Center my={4}>
              <Text color="gray.400">End of your listed properties.</Text>
            </Center>
          }
        >
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={4} spacing={6}>
            {visible.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                isOwner
                onClick={() => navigate(`/rent/${property.id}`)}
              />
            ))}
          </SimpleGrid>
        </InfiniteScroll>
      )}
    </Box>
  );
};

export default MyListingsPage;
