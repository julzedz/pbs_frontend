import { MdCheckCircle, MdStar } from "react-icons/md";
import {
  List,
  Flex,
  Spacer,
  Box,
  Heading,
  Text,
  Button,
} from "@chakra-ui/react";

const SubscriptionCard = ({ isPaid, title, price, benefits, onSubscribe }) => {
  const borderColor = isPaid ? "purple.600" : "gray.200";

  return (
    <Box
      bg={isPaid ? "purple.600" : "white"}
      color={isPaid ? "white" : "gray.800"}
      _dark={{
        bg: isPaid ? "purple.800" : "gray.700",
        color: "white",
        borderColor: isPaid ? "purple.800" : "gray.600",
      }}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="xl"
      p={8}
      shadow={isPaid ? "xl" : "md"}
      position="relative"
    >
      <Flex direction="column" h="full">
        {isPaid && (
          <Box
            position="absolute"
            top="-15px"
            left="50%"
            transform="translateX(-50%)"
            bg="orange.400"
            color="white"
            px={4}
            py={1}
            borderRadius="full"
            fontSize="sm"
            fontWeight="bold"
            letterSpacing="wide"
          >
            MOST POPULAR
          </Box>
        )}
        <Heading as="h3" size="lg" mb={4}>
          {title}
        </Heading>
        <Text fontSize="4xl" fontWeight="extrabold" mb={6}>
          {price}
          {isPaid && (
            <Text as="span" fontSize="xl" fontWeight="normal">
              /lifetime
            </Text>
          )}
        </Text>

        <List.Root spacing={3} mb={8} flexGrow={1}>
          {benefits.map((benefit, index) => (
            <List.Item
              key={index}
              display="flex"
              alignItems="flex-start"
              gap={2}
            >
              <List.Indicator
                asChild
                color={isPaid ? "orange.300" : "green.300"}
              >
                {isPaid ? (
                  <MdStar size="1.2em" />
                ) : (
                  <MdCheckCircle size="1.2em" />
                )}
              </List.Indicator>
              <Text as="span" fontSize="md" mt="-1px">
                {benefit}
              </Text>
            </List.Item>
          ))}
        </List.Root>

        <Spacer />

        <Button
          mt={4}
          size="lg"
          colorPalette={isPaid ? "orange" : "purple"}
          variant={isPaid ? "solid" : "outline"}
          onClick={onSubscribe}
          {...(!isPaid && {
            color: isPaid ? "white" : "purple.500",
            borderColor: "purple.500",
            _hover: { bg: "purple.50" },
            _dark: {
              color: "purple.300",
              borderColor: "purple.300",
              _hover: { bg: "purple.900" },
            },
          })}
        >
          {isPaid ? "Subscribe Now" : "Post a Property"}
        </Button>
      </Flex>
    </Box>
  );
};

export default SubscriptionCard;
