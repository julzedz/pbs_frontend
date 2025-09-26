import {
  Box,
  Heading,
  Text,
  Icon,
  Link,
  VStack,
  HStack,
  Image,
  Grid,
} from "@chakra-ui/react";
import logo from "../assets/pbs-logo.png";
import React from "react";
import {
  FaInstagram,
  FaFacebook,
  FaWhatsapp,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa6";
import headerImage from "../assets/contactus.jpg";

const ContactUs = () => {
  const accentColor = "purple.700";
  const subtextColor = "gray.300";
  const subtextColor2 = "gray.600";
  const cardBg = "rgba(255, 255, 255, 0.75)";

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
    >
      <VStack m={0} spacing={8} textAlign="center">
        <Box>
          <Image src={logo} alt="PropertyBusStopLogo" boxSize="150px" />
        </Box>
        <Box>
          <Heading as="h1" size="2xl" mb={3} color={accentColor}>
            Get in Touch 👋
          </Heading>
          <Text
            px={{ base: 10, md: "auto" }}
            fontSize="lg"
            color={subtextColor}
          >
            We're excited to help you with your property journey. Choose a
            method that works best for you!
          </Text>
        </Box>

        <CustomDivider />

        <Grid
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
          gap={8}
          w="full"
          maxW="4xl"
          px={{ base: 10, md: "auto" }}
        >
          <VStack
            spacing={4}
            p={8}
            bg={cardBg}
            borderRadius="xl"
            boxShadow="xl"
            align="center"
            border="1px solid"
            borderColor="gray.200"
          >
            <Icon as={FaEnvelope} w={8} h={8} color={accentColor} />
            <Heading as="h3" size="md">
              Send an Email
            </Heading>
            <Text color={subtextColor2}>For detailed inquiries.</Text>
            <Link
              href="mailto:info@propertybusstop.com"
              fontWeight="semibold"
              color={accentColor}
              fontSize="lg"
              _hover={{ textDecoration: "underline" }}
            >
              info@propertybusstop.com
            </Link>
          </VStack>

          <VStack
            spacing={4}
            p={8}
            bg={cardBg}
            borderRadius="xl"
            boxShadow="xl"
            align="center"
            border="1px solid"
            borderColor="gray.200"
          >
            <Icon as={FaWhatsapp} w={8} h={8} color={accentColor} />
            <Heading as="h3" size="md">
              Chat or Call Us
            </Heading>
            <Text color={subtextColor2}>
              Quickest way to get answers from our team.
            </Text>
            <Link
              isExternal
              target="_blank"
              href="https://wa.me/2348106541981?text=I%27m%20interested%20in%20buying%20or%20selling%20a%20property%20on%20propertybusstop"
              fontWeight="semibold"
              color={accentColor}
              fontSize="lg"
              _hover={{ textDecoration: "underline" }}
            >
              +234 810 654 1981
            </Link>
          </VStack>
        </Grid>

        <CustomDivider />

        <VStack spacing={4} w="full">
          <Text fontSize="xl" fontWeight="bold">
            Connect With Us
          </Text>
          <HStack spacing={6}>
            <Link
              href="https://www.instagram.com/propertybusstop"
              isExternal
              aria-label="Follow us on Instagram"
            >
              <Icon
                as={FaInstagram}
                w={8}
                h={8}
                color={accentColor}
                transition="transform 0.2s"
                _hover={{ color: "pink.500", transform: "scale(1.1)" }}
              />
            </Link>

            <Link
              href="https://www.facebook.com/share/14DgBeLaGQT/?mibextid=wwXIfr"
              isExternal
              aria-label="Follow us on Facebook"
            >
              <Icon
                as={FaFacebook}
                w={8}
                h={8}
                color={accentColor}
                transition="transform 0.2s"
                _hover={{ color: "blue.600", transform: "scale(1.1)" }}
              />
            </Link>

            <Link
              href="https://wa.me/2348106541981?text=I%27m%20interested%20in%20buying%20or%20selling%20a%20property%20on%20propertybusstop"
              isExternal
              aria-label="Chat with us on WhatsApp"
            >
              <Icon
                as={FaWhatsapp}
                w={8}
                h={8}
                color={accentColor}
                transition="transform 0.2s"
                _hover={{ color: "green.500", transform: "scale(1.1)" }}
              />
            </Link>
          </HStack>
        </VStack>

        <CustomDivider />

        <HStack mb={9} spacing={2} color={subtextColor} pt={4}>
          <Icon as={FaMapMarkerAlt} />
          <Text>Anambra, Nigeria</Text>
        </HStack>
      </VStack>
    </Box>
  );
};

export default ContactUs;
