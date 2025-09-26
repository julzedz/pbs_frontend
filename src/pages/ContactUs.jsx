import { Text, Box, Icon, Link } from "@chakra-ui/react";
import React from "react";
import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa6";

const ContactUs = () => {
  return (
    <Box maxW="4xl" mx="auto" py={10} px={4}>
      <Text textAlign="center" fontSize="2xl" fontWeight="bold" mb={2}>
        Coming Soon...
      </Text>
      <Text mb={2}>
        Contact us at <Icon as={FaEnvelope} />{" "}
        <Link color="purple.500" href="mailto:info@propertybusstop.com">
          info@propertybusstop.com
        </Link>{" "}
      </Text>
      <Text>
        Call or Whatsapp <Icon as={FaWhatsapp} /> us at{" "}
        <Link
          isExternal
          target="_blank"
          color="purple.500"
          href="https://wa.me/+2348106541981?text=I%27m%20interested%20in%20buying%20or%20selling%20a%20property%20on%20propertybusstop"
        >
          +2348106541981
        </Link>{" "}
      </Text>
      <Text>
        Follow us on <Icon as={FaInstagram} />{" "}
        <Link
          color="purple.500"
          isExternal
          target="_blank"
          href="https://www.instagram.com/propertybusstop"
        >
          Instagram
        </Link>
      </Text>
      <Text>
        Follow us on <Icon as={FaFacebook} />{" "}
        <Link
          color="purple.500"
          isExternal
          target="_blank"
          href="https://www.facebook.com/share/14DgBeLaGQT/?mibextid=wwXIfr"
        >
          Facebook
        </Link>
      </Text>
    </Box>
  );
};

export default ContactUs;
