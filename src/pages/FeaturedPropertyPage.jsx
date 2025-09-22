import React, { useEffect, useState } from "react";
import { Box, SimpleGrid, Spinner, Text, Center } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { featuredProperties } from "../api";
import PropertyCard from "../components/PropertyCard";

const FeaturedPropertyPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [featuredHomes, setFeaturedHomes] = useState([]);

  useEffect(() => {
    setLoading(true);
    featuredProperties()
      .then((res) => {
        setFeaturedHomes(res.data.data || []);
        setError("");
        console.log(res.data.data);
      })
      .catch((err) => {
        setError("Failed to load properties.");
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading)
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

  return (
    <Box maxW="7xl" mx="auto" py={8} px={4}>
      <Text fontSize="2xl" fontWeight="bold" mb={6}>
        Our Featured Properties
      </Text>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={4} spacing={6}>
        {featuredHomes.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onClick={() => navigate(`/rent/${property.id}`)}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default FeaturedPropertyPage;
