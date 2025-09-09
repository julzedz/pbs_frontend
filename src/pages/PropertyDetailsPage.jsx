import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Image,
  Text,
  Badge,
  Stack,
  Flex,
  Spinner,
  Center,
  Link as ChakraLink,
  Avatar,
  Tag,
  HStack,
} from "@chakra-ui/react";
import API from "../api";
import { findIncluded, findAllIncluded } from "../utils/parseJsonApi";

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [included, setIncluded] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/api/v1/properties/${id}`);
        setProperty(res.data.data);
        setIncluded(res.data.included || []);
      } catch {
        setError("Failed to load property details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

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
  if (!property) return null;

  const attr = property.attributes;
  const rel = property.relationships;

  // Locality and State
  const locality = rel.locality?.data
    ? findIncluded(included, "locality", rel.locality.data.id)
    : null;
  const state = locality?.relationships?.state?.data
    ? findIncluded(included, "state", locality.relationships.state.data.id)
    : null;

  // Features
  const featureIds = rel.features?.data?.map((f) => f.id) || [];
  const features = findAllIncluded(included, "feature", featureIds);

  // Agent/User
  const agent = rel.user?.data
    ? findIncluded(included, "user", rel.user.data.id)
    : null;
  const agentAttr = agent?.attributes || {};

  return (
    <Box maxW="4xl" mx="auto" py={10} px={4}>
      <Flex direction={{ base: "column", md: "row" }} gap={8}>
        <Box flex={1} minW={0}>
          <Image
            src={attr.image_url}
            alt={attr.title}
            w="100%"
            h="320px"
            objectFit="cover"
            borderRadius="lg"
            mb={4}
          />
          <HStack spacing={2} mb={4}>
            {features.map((f) => (
              <Tag.Root key={f.id} colorScheme="purple">
                <Tag.Label>{f.attributes.name}</Tag.Label>
              </Tag.Root>
            ))}
          </HStack>
          <Text color="gray.600" fontSize="md" mb={2}>
            {attr.description}
          </Text>
          <Box divideX="2px" my={4} />
          <Stack spacing={2} fontSize="sm">
            <Text>
              <b>Street:</b> {attr.street}
            </Text>
            <Text>
              <b>Type:</b>{" "}
              {attr.property_type.charAt(0).toUpperCase() +
                attr.property_type.slice(1)}
            </Text>
            <Text>
              <b>Bedrooms:</b> {attr.bedrooms}
            </Text>
            <Text>
              <b>Bathrooms:</b> {attr.bathrooms}
            </Text>
            <Text>
              <b>Click for more images/videos:</b>{" "}
              <ChakraLink
                href={attr.instagram_video_link}
                color="purple.600"
                isExternal
              >
                View Video
              </ChakraLink>
            </Text>
            <Text>
              <b>Locality (LGA):</b> {locality?.attributes?.name}
            </Text>
            <Text>
              <b>State:</b> {state?.attributes?.name}
            </Text>
            <Text>
              <b>Purpose:</b>{" "}
              {attr.purpose.charAt(0).toUpperCase() + attr.purpose.slice(1)}
            </Text>
            <Text>
              <b>Contact Name:</b>{" "}
              {attr.contact_name}
            </Text>
            <Text>
              <b>Contact Phone:</b>{" "}
              {attr.contact_phone}
            </Text>
            <Text color="purple.700" fontWeight="bold" fontSize="lg">
              ₦{Number(attr.price).toLocaleString()}
            </Text>
          </Stack>
        </Box>
        <Box minW={{ md: "260px" }}>
          <Box
            borderWidth="1px"
            borderRadius="lg"
            p={4}
            bg="gray.50"
            mb={4}
            boxShadow="sm"
          >
            <Stack direction="row" align="center" mb={2}>
              <Avatar.Root size="md">
                <Avatar.Fallback
                  name={`${agentAttr.first_name} ${agentAttr.last_name}`}
                />
                {/* If you have an agent image URL, use <Avatar.Image src={agentAttr.image_url} /> */}
              </Avatar.Root>
              <Box>
                <Text fontWeight="bold" color="black">
                  {agentAttr.first_name} {agentAttr.last_name}
                </Text>
                <Text color="gray.600" fontSize="sm">
                  Agent
                </Text>
              </Box>
            </Stack>
            <Text fontSize="sm">
              <b>Phone:</b> {agentAttr.telephone}
            </Text>
            <Text fontSize="sm">
              <b>Email:</b> {agentAttr.email}
            </Text>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default PropertyDetailsPage;
