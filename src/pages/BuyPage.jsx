import React, { useEffect, useState } from "react";
import { Box, SimpleGrid, Spinner, Text, Center } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import PropertyCard from "../components/PropertyCard";

const BuyPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const res = await API.get("/api/v1/properties");
        setProperties(res.data.data);
      } catch {
        setError("Failed to load properties.");
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // Filter for sale properties
  const saleProperties = properties.filter(
    (p) => p.attributes.purpose === "sale"
  );

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
        Properties for Sale
      </Text>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={4} spacing={6}>
        {saleProperties.map((property) => (
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

export default BuyPage;
