import { Box, Image, Text, Badge, Stack } from "@chakra-ui/react";

const PropertyCard = ({ property, onClick }) => {
  const { title, price, description, image_url, property_type } =
    property.attributes;

  return (
    <Box
      onClick={onClick}
      cursor="pointer"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      _hover={{ boxShadow: "xl", transform: "scale(1.02)" }}
      transition="all 0.2s"
      bg="white"
    >
      <Image
        src={image_url}
        alt={title}
        w="100%"
        h="200px"
        objectFit="cover"
        borderTopRadius="lg"
      />
      <Box p={4}>
        <Stack direction="row" align="center" mb={2}>
          <Text fontWeight="bold" fontSize="lg" flex={1} noOfLines={1}>
            {title}
          </Text>
          <Badge
            colorScheme="purple"
            fontSize="0.9em"
            px={2}
            py={1}
            borderRadius="md"
          >
            {property_type.charAt(0).toUpperCase() + property_type.slice(1)}
          </Badge>
        </Stack>
        <Text color="purple.600" fontWeight="bold" fontSize="md" mb={1}>
          ₦{Number(price).toLocaleString()}
        </Text>
        <Text color="gray.600" fontSize="sm" noOfLines={2}>
          {description}
        </Text>
      </Box>
    </Box>
  );
};

export default PropertyCard;
