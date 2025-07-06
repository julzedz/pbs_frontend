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
  Spinner,
  Center,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import API, { getStates, getLocalities } from "../api";

const featuredHomes = [
  {
    id: 1,
    title: "5 BEDROOM FULLY DETACHED DUPLEX",
    price: "₦250,000,000",
    location: "Ajah Lagos",
    image:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGhvdXNlJTIwZm9yJTIwc2FsZXxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: 2,
    title: "LUXURY 3 BEDROOM PENTHOUSE WITH BALCONY, POOL AND GYM",
    price: "₦340,000/day",
    location: "phase 1 Lekki Lagos",
    image:
      "https://images.unsplash.com/photo-1707484687082-9493754d389f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVudGhvdXNlJTIwZm9yJTIwc2FsZXxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: 3,
    title: "LUXURY WATERFRONT 3 BEDROOM APARTMENT WITH POOL AND GYM",
    price: "₦270,000/day",
    location: "Joneers court Lekki Phase 1 Lekki Lagos",
    image:
      "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhvdXNlJTIwZm9yJTIwc2FsZXxlbnwwfHwwfHx8MA%3D%3D",
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

const parseNaira = (val) => Number(val.replace(/[^\d]/g, ""));

const LandingPage = () => {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [tab, setTab] = useState("buy");
  const [states, setStates] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedLocality, setSelectedLocality] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getStates().then((res) => {
      setStates(res.data.data || []);
    });
  }, []);

  useEffect(() => {
    if (selectedState) {
      getLocalities(selectedState).then((res) => {
        setLocalities(res.data.data || []);
      });
    } else {
      setLocalities([]);
      setSelectedLocality("");
    }
  }, [selectedState]);

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      params.purpose = tab === "buy" ? "sale" : "rent";
      if (search) params.search = search;
      if (type) params.property_type = type.toLowerCase();
      if (bedrooms) params.bedrooms = bedrooms;
      if (minPrice) params.min_price = parseNaira(minPrice);
      if (maxPrice) params.max_price = parseNaira(maxPrice);
      if (selectedState) params.state_id = selectedState;
      if (selectedLocality) params.locality_id = selectedLocality;
      const res = await API.get("/api/v1/properties", { params });
      setResults(res.data.data || []);
    } catch {
      setError("Failed to fetch properties.");
    } finally {
      setLoading(false);
    }
  };

  // Optionally, auto-search on filter change (except search input)
  useEffect(() => {
    if (
      type ||
      bedrooms ||
      minPrice ||
      maxPrice ||
      selectedState ||
      selectedLocality
    ) {
      handleSearch();
    } else {
      setResults([]);
    }
    // eslint-disable-next-line
  }, [
    tab,
    type,
    bedrooms,
    minPrice,
    maxPrice,
    selectedState,
    selectedLocality,
  ]);

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
          Find your Next Property
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
          {/* Custom Tab Buttons */}
          <Flex mb={4} gap={2}>
            {tabOptions.map((option) => (
              <Button
                key={option.value}
                onClick={() => setTab(option.value)}
                colorScheme={tab === option.value ? "purple" : "gray"}
                variant={tab === option.value ? "solid" : "ghost"}
                px={4}
                py={2}
                fontWeight="bold"
                borderRadius="md"
                _hover={{
                  bg: tab === option.value ? "purple.600" : "gray.100",
                }}
              >
                {option.label}
              </Button>
            ))}
          </Flex>
          <Box w="full">
            <Flex gap={2} mb={2}>
              <Input
                placeholder={tab === "buy" ? "search sale" : "search rent"}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
              <Button onClick={handleSearch} colorScheme="purple">
                Search
              </Button>
            </Flex>
            <Flex gap={4} flexWrap={{ base: "wrap", md: "nowrap" }} mb={2}>
              <select
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
              >
                <option value="">State</option>
                {states.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.attributes.name}
                  </option>
                ))}
              </select>
              <select
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                value={selectedLocality}
                onChange={(e) => setSelectedLocality(e.target.value)}
                disabled={!selectedState}
              >
                <option value="">Locality</option>
                {localities.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.attributes.name}
                  </option>
                ))}
              </select>
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
        </Box>
      </Box>
      {/* Search Results Grid */}
      {loading && (
        <Center minH="30vh">
          <Spinner size="xl" />
        </Center>
      )}
      {error && (
        <Center minH="30vh">
          <Text color="red.500">{error}</Text>
        </Center>
      )}
      {results.length > 0 && !loading && (
        <Box maxW="7xl" mx="auto" py={8} px={4}>
          <Text fontSize="2xl" fontWeight="bold" mb={6}>
            Search Results
          </Text>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={4} spacing={6}>
            {results.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onClick={() => navigate(`/rent/${property.id}`)}
              />
            ))}
          </SimpleGrid>
        </Box>
      )}
      {/* Featured Homes */}
      <Box maxW="7xl" mx="auto" py={12} px={4}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading fontSize={{ base: "xl", md: "2xl" }}>
            Our Featured Properties
          </Heading>
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