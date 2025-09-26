import {
  Box,
  Flex,
  Text,
  HStack,
  Image,
  Stack,
  Link as ChakraLink,
  IconButton,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa6";
import { BsTwitterX } from "react-icons/bs";
import { Link as RouterLink } from "react-router-dom";
import logo from "../assets/pbs-logo.png";

const socialLinks = [
  { icon: <BsTwitterX />, label: "X", href: "https://x.com/" },
  {
    icon: <FaInstagram />,
    label: "Instagram",
    href: "https://instagram.com/",
    color: "#E1306C",
  },
  {
    icon: <FaFacebook />,
    label: "Facebook",
    href: "https://www.facebook.com/share/14DgBeLaGQT/?mibextid=wwXIfr",
    color: "#1877f3",
  },
  {
    icon: <FaYoutube />,
    label: "YouTube",
    href: "https://youtube.com/",
    color: "#FF0000",
  },
];

const pageLinks = [
  { label: "Home", to: "/" },
  { label: "Buy", to: "/buy" },
  { label: "Rent", to: "/rent" },
  { label: "About Us", to: "/about" },
  { label: "Contact Us", to: "/contact" },
  // { label: "Terms of Service", to: "/terms" },
];

const Footer = () => {
  const [showDeveloper, setShowDeveloper] = useState(false);

  const handleDoubleClick = () => {
    setShowDeveloper(true);
  };

  return (
    <Box
      as="footer"
      bg="gray.700"
      color="gray.100"
      py={{ base: 4, md: 4 }}
      px={4}
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        align="center"
        justify="space-between"
        maxW="7xl"
        mx="auto"
        gap={8}
      >
        {/* Left: Brand & Copyright */}
        <RouterLink to="/">
          <HStack mr={{ base: 0, md: 8 }}>
            <Image
              src={logo}
              alt="PropertyBusStopLogo"
              boxSize={{ base: "150px", md: "150px" }}
              mr={1}
            />
            {/* <Text fontSize="md" fontFamily="body" fontWeight="bold" color="purple.300">
            Property BusStop
          </Text> */}
          </HStack>
        </RouterLink>

        {/* Center: Page Links */}
        <Stack direction="row" spacing={6} mb={{ base: 0, md: 0 }}>
          {pageLinks.map((link) => (
            <ChakraLink
              as={RouterLink}
              to={link.to}
              key={link.label}
              fontWeight="medium"
              color="gray.200"
              _hover={{ color: "purple.300", textDecoration: "underline" }}
              className="transition-colors"
              fontSize={{ base: "xs", md: "md" }}
              _focus={{ outline: "none" }}
              _active={{ outline: "none" }}
              _focusVisible={{ outline: "none" }}
            >
              {link.label}
            </ChakraLink>
          ))}
        </Stack>

        {/* Right: Social Icons */}
        <Stack direction="row" spacing={4}>
          {socialLinks.map((link) => (
            <IconButton
              as="a"
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              key={link.label}
              _hover={{ bg: "gray.800" }}
              size="lg"
              className="transition-colors"
              color={link.color}
              variant="ghost"
            >
              {link.icon}
            </IconButton>
          ))}
        </Stack>
      </Flex>
      <Flex justify="space-between" align="center" flexDir={{ base: "column", md: "row" }} w="full" mt={4}>
        <Text fontSize="sm" color="gray.500">
          &copy; {new Date().getFullYear()} Property Bus Stop. All rights
          reserved.
        </Text>
        <Text
          fontSize="xs"
          color="gray.600"
          opacity={showDeveloper ? 1 : 0}
          transition="opacity 0.5s ease-in-out"
          onDoubleClick={handleDoubleClick}
          cursor="pointer"
          _hover={{ opacity: showDeveloper ? 1 : 0.2 }}
        >
          Developed by{" "}
          <ChakraLink
            as={RouterLink}
            to="https://github.com/julzedz"
            fontWeight="bold"
            color="gray.400"
            _hover={{ color: "purple.300" }}
            fontSize={{ base: "xs", md: "xs" }}
          _focus={{ outline: "none" }}
          >
            julzedz
          </ChakraLink>
        </Text>
        <Text fontSize="sm" color="gray.300" fontWeight="bold">
          THIS SITE IS BUILT BY{" "}
          <ChakraLink
            as="a"
            href="https://nibcode.org"
            target="_blank"
            rel="noopener noreferrer"
            fontWeight="bold"
            color="gray.400"
            _hover={{ color: "purple.300" }}
            fontSize={{ base: "xs", md: "xs" }}
            _focus={{ outline: "none" }}
          >
            NIBCODE ICT
          </ChakraLink>{" "}
          - +2348106541981
        </Text>
      </Flex>
    </Box>
  );
};

export default Footer;
