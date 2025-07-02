import {
  Box,
  Heading,
  Text,
  Tabs,
  Input,
  Button,
  SimpleGrid,
  Image,
  Flex,
} from "@chakra-ui/react";
import { useState } from "react";

const featuredHomes = [
  {
    id: 1,
    title: "5 BEDROOM FULLY DETACHED DUPLEX",
    price: "₦250,000,000",
    location: "Ajah Lagos",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    title: "LUXURY 3 BEDROOM PENTHOUSE WITH BALCONY, POOL AND GYM",
    price: "₦340,000/day",
    location: "phase 1 Lekki Lagos",
    image:
      "https://images.unsplash.com/photo-1460518451285-97b6aa326961?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    title: "LUXURY WATERFRONT 3 BEDROOM APARTMENT WITH POOL AND GYM",
    price: "₦270,000/day",
    location: "Joneers court Lekki Phase 1 Lekki Lagos",
    image:
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=400&q=80",
  },
];

const tabOptions = [
  { value: "buy", label: "Buy", placeholder: "search sale" },
  { value: "rent", label: "Rent", placeholder: "search rent" },
];

const typeOptions = ["House", "Land"];
const bedroomOptions = ["1", "2", "3", "4+"];
const minPriceOptions = ["₦100,000", "₦500,000", "₦1,000,000"];
const maxPriceOptions = ["₦1,000,000", "₦10,000,000", "₦100,000,000"];

const LandingPage = () => {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  return (
    <Box>
      {/* Hero Section */}
      <Box
        bgGradient="linear(to-r, purple.700, purple.400)"
        py={16}
        px={4}
        textAlign="center"
      >
        <Heading color="black" fontSize={{ base: "2xl", md: "4xl" }} mb={4}>
          Find your Next Home
        </Heading>
        <Text fontSize={{ base: "md", md: "xl" }} mb={8}>
          Buy, rent, or invest in your dream property
        </Text>
        {/* Search Bar */}
        <Box
          bg="white"
          color="gray.800"
          p={4}
          rounded="lg"
          maxW="3xl"
          mx="auto"
          boxShadow="md"
        >
          <Tabs.Root defaultValue="buy">
            <Tabs.List mb={4}>
              {tabOptions.map((option) => (
                <Tabs.Trigger
                  key={option.value}
                  value={option.value}
                  _selected={{ color: "white", bg: "purple.500" }}
                  px={4}
                  py={2}
                  fontWeight="bold"
                  borderRadius="md"
                  _hover={{ bg: "purple.100" }}
                >
                  {option.label}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
            {tabOptions.map((option) => (
              <Tabs.Content key={option.value} value={option.value}>
                <Box w="full">
                  <Flex gap={2} mb={2}>
                    <Input
                      placeholder={option.placeholder}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button>Search</Button>
                  </Flex>
                  <Flex gap={4} flexWrap={{ base: "wrap", md: "nowrap" }}>
                    <select
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    >
                      <option value="">Type</option>
                      {typeOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <select
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                    >
                      <option value="">Bedrooms</option>
                      {bedroomOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <select
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    >
                      <option value="">Min. Price</option>
                      {minPriceOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <select
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    >
                      <option value="">Max. Price</option>
                      {maxPriceOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </Flex>
                </Box>
              </Tabs.Content>
            ))}
          </Tabs.Root>
        </Box>
      </Box>
      {/* Featured Homes */}
      <Box maxW="7xl" mx="auto" py={12} px={4}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading fontSize={{ base: "xl", md: "2xl" }}>Featured homes</Heading>
          <Button variant="link">See all</Button>
        </Flex>
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} spacing={8}>
          {featuredHomes.map((home) => (
            <Box
              key={home.id}
              bg="white"
              rounded="lg"
              boxShadow="md"
              overflow="hidden"
            >
              <Image
                src={home.image}
                alt={home.title}
                w="full"
                h="200px"
                objectFit="cover"
              />
              <Box p={4}>
                <Text color="purple.500" fontWeight="bold" fontSize="sm" mb={2}>
                  {home.title}
                </Text>
                <Text fontSize="xl" fontWeight="bold" mb={1}>
                  {home.price}
                </Text>
                <Text color="gray.600">{home.location}</Text>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default LandingPage;
