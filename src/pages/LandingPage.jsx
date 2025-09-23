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
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import API, { getStates, getLocalities, featuredProperties } from "../api";
import bgImage from "../assets/bgimage1.webp";

const tabOptions = [
  { value: "buy", label: "Buy", placeholder: "search sale" },
  { value: "rent", label: "Rent", placeholder: "search rent" },
];

const typeOptions = ["House", "Land"];
const bedroomOptions = ["1", "2", "3", "4+"];
const minPriceOptions = ["₦100,000", "₦500,000", "₦1,000,000"];
const maxPriceOptions = ["₦1,000,000", "₦10,000,000", "₦100,000,000"];

const parseNaira = (val) => Number(val.replace(/[^\d]/g, ""));

const truncateText = (str) => {
  if (!str) return "";
  if (str.length > 50) {
    return str.slice(0, 50) + "...";
  }
  const words = str.split(" ");
  if (words.length > 6) {
    return words.slice(0, 6).join(" ") + "...";
  }
  return str;
};

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
  const [featuredHomes, setFeaturedHomes] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);

  useEffect(() => {
    featuredProperties().then((res) => {
      setFeaturedHomes(res.data.data || []);
      setFeaturedLoading(false);
    });
  }, []);

  useEffect(() => {
    const onLoad = () => document.body.classList.add("loaded");
    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad);
      return () => window.removeEventListener("load", onLoad);
    }
  }, []);

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
    <Box className="main-container">
      {/* Hero Section */}
      <Box
        py={16}
        px={4}
        textAlign="center"
        bgImage={`url(${bgImage})`}
        bgSize="cover"
        bgPosition="center"
        bgRepeat="no-repeat"
      >
        <Heading
          color="black"
          fontFamily="Spectral"
          fontWeight="800"
          fontSize={{ base: "2xl", md: "4xl" }}
          mb={4}
        >
          Find your Next Property
        </Heading>
        <Text fontSize={{ base: "md", md: "xl" }} mb={8}>
          Buy, rent, or invest in your dream property
        </Text>
        {/* Search Bar */}
        <Box
          bg="#ffffffe0"
          color="gray.800"
          p={4}
          rounded="lg"
          maxW="3xl"
          mx="auto"
          boxShadow="md"
        >
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
            <Flex gap={2} mb={2} flexDir={{ base: "column", md: "row" }}>
              <Input
                placeholder={tab === "buy" ? "search sale" : "search rent"}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
              <Button
                onClick={handleSearch}
                marginBottom={{ base: 4, md: 0 }}
                colorScheme="purple"
              >
                Search
              </Button>
            </Flex>
            <Flex gap={4} flexWrap={{ base: "wrap", md: "nowrap" }} mb={2}>
              <select
                className="searchselect block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
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
                className="searchselect block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                className="searchselect block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
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
                className="searchselect block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
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
                className="searchselect block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
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
                className="searchselect block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
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
          <Button
            variant="link"
            color="purple.500"
            textDecoration="underline"
            onClick={() => navigate("/featured")}
          >
            See all
          </Button>
        </Flex>
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} spacing={8}>
          {featuredLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <Box
                  key={index}
                  bg="white"
                  rounded="lg"
                  boxShadow="md"
                  overflow="hidden"
                >
                  <Skeleton height="200px" />
                  <Box p={4}>
                    <SkeletonText mt="2" noOfLines={1} spacing="4" />
                    <SkeletonText mt="4" noOfLines={2} spacing="4" />
                  </Box>
                </Box>
              ))
            : featuredHomes.slice(0, 6).map((home) => (
                <Box
                  key={home.id}
                  bg="white"
                  rounded="lg"
                  boxShadow="md"
                  overflow="hidden"
                >
                  <Image
                    src={home.attributes.image_url}
                    alt={home.attributes.title}
                    w="full"
                    h="200px"
                    objectFit="cover"
                  />
                  <Box p={4}>
                    <Text
                      color="purple.500"
                      fontWeight="bold"
                      fontSize="sm"
                      mb={2}
                    >
                      {truncateText(home.attributes.title)}
                    </Text>
                    <Text fontSize="xl" fontWeight="bold" mb={1}>
                      ₦{Number(home.attributes.price).toLocaleString()}
                    </Text>
                    <Text color="gray.600">{`${home.attributes.street}`}</Text>
                  </Box>
                </Box>
              ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default LandingPage;
