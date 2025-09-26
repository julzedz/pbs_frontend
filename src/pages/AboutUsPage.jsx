import {
  Box,
  Heading,
  Text,
  Icon,
  VStack,
  HStack,
  Image,
  Grid,
} from "@chakra-ui/react";
import React from "react";
import logo from "../assets/pbs-logo.png";
import headerImage from "../assets/aboutus.webp";
import {
  FaGlobeAfrica,
  FaEnvelope,
  FaWhatsapp,
  FaHandshake,
  FaBullseye,
} from "react-icons/fa";

const AboutUs = () => {
  const accentColor = "purple.700";
  const subtextColor = "gray.600";
  const subtextColor2 = "gray.300";

  const CustomDivider = (props) => (
    <Box
      w="full"
      maxW="md"
      borderBottomWidth="1px"
      borderColor="gray.300"
      my={4}
      {...props}
    />
  );

  return (
    <Box
      bgImage={`url(${headerImage})`}
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
      bgColor="rgba(0, 0, 0, 0.5)"
    >
      <VStack
        maxW={{ base: "full", md: "6xl" }}
        mx="auto"
        mt={{ base: 0, md: 10 }}
        mb={{ base: 0, md: 10 }}
        borderRadius="lg"
        py={{ base: 10, md: 10 }}
        px={6}
        spacing={12}
        textAlign="center"
        // bg="rgba(255, 255, 255, 0.75)"
        // backdropFilter="blur(3px)"
      >
        <VStack spacing={4}>
          <Image src={logo} alt="PropertyBusStopLogo" boxSize="120px" />

          <Heading as="h1" size="2xl" color={accentColor}>
            Our Story: Building Nigeria's Property Hub
          </Heading>

          <CustomDivider />

          <Text
            fontSize="lg"
            maxW="4xl"
            color={subtextColor2}
            fontWeight="medium"
          >
            Welcome to{" "}
            <Text as="span" fontWeight="bold" color={accentColor}>
              PropertyBusStop.com
            </Text>{" "}
            – Nigeria’s trusted online marketplace for real estate. Whether
            you’re buying, selling, or renting, we provide a simple, reliable,
            and accessible platform that connects property owners, agents, and
            seekers across the country.
          </Text>
        </VStack>
        <Heading as="h2" size="xl" mt={8} color={subtextColor2}>
          Our Core Pillars
        </Heading>
        <CustomDivider maxW="3xl" />

        <Grid
          templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
          gap={8}
          w="full"
          maxW="5xl"
        >
          <VStack
            spacing={4}
            p={8}
            bg="rgba(255, 255, 255, 0.75)"
            backdropFilter="blur(3px)"
            borderRadius="xl"
            boxShadow="2xl"
            align="center"
            border="1px solid"
            borderColor="purple.200"
          >
            <Icon as={FaGlobeAfrica} w={10} h={10} color={accentColor} />
            <Heading as="h3" size="md">
              A Nigerian Platform
            </Heading>
            <Text color={subtextColor} fontSize="sm">
              We are dedicated to{" "}
              <Text as="span" fontWeight="bold" color={accentColor}>
                serving the Nigerian market
              </Text>{" "}
              with integrity and innovation, connecting every state and city in
              one reliable location.
            </Text>
            <Text fontSize="sm" fontWeight="bold" color={accentColor}>
              🌍 Local Focus, Global Standards
            </Text>
          </VStack>

          <VStack
            spacing={4}
            p={8}
            bg="rgba(255, 255, 255, 0.75)"
            backdropFilter="blur(3px)"
            borderRadius="xl"
            boxShadow="2xl"
            align="center"
            border="1px solid"
            borderColor="purple.200"
          >
            <Icon as={FaBullseye} w={10} h={10} color={accentColor} />
            <Heading as="h3" size="md">
              Simple & Transparent
            </Heading>
            <Text color={subtextColor} fontSize="sm">
              At Property Bus Stop, we believe finding the right property should
              be{" "}
              <Text as="span" fontWeight="bold" color={accentColor}>
                easy and transparent
              </Text>
              . We are a one-stop hub for all property listings.
            </Text>
            <Text fontSize="sm" fontWeight="bold" color={accentColor}>
              🔎 Clarity in Every Transaction
            </Text>
          </VStack>

          <VStack
            spacing={4}
            p={8}
            bg="rgba(255, 255, 255, 0.75)"
            backdropFilter="blur(3px)"
            borderRadius="xl"
            boxShadow="2xl"
            align="center"
            border="1px solid"
            borderColor="purple.200"
          >
            <Icon as={FaHandshake} w={10} h={10} color={accentColor} />
            <Heading as="h3" size="md">
              Deals That Begin Here
            </Heading>
            <Text color={subtextColor} fontSize="sm">
              From houses, lands, and apartments to commercial spaces—your next
              property deal{" "}
              <Text as="span" fontWeight="bold" color={accentColor}>
                begins here
              </Text>
              , fostering trust between all parties.
            </Text>
            <Text fontSize="sm" fontWeight="bold" color={accentColor}>
              🤝 Connecting People & Property
            </Text>
          </VStack>
        </Grid>

        <CustomDivider />

        <Box pt={4} pb={4} maxW="3xl">
          <Heading as="h3" size="lg" mb={3} color={accentColor}>
            Property Bus Stop – Where Property Deals Begin!
          </Heading>
          <HStack spacing={4} justify="center" color={subtextColor2} pt={2}>
            <Icon as={FaEnvelope} />
            <Text>info@propertybusstop.com</Text>
            <Icon as={FaWhatsapp} />
            <Text>+234 810 654 1981</Text>
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default AboutUs;
