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
    href: "https://facebook.com/",
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
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms of Service", to: "/terms" },
];

const Footer = () => (
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
          <Image src={logo} alt="PropertyBusStopLogo" boxSize={{ base: "150px", md: "150px" }} mr={1} />
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
  </Box>
);

export default Footer;
