import { useRef } from "react";
import {
  Box,
  Heading,
  Text,
  Field,
  SimpleGrid,
  Input,
  Dialog,
  Portal,
  CloseButton,
} from "@chakra-ui/react";
import { PaystackButton } from "react-paystack";
import { useState } from "react";
import { useAppStore } from "../store";
import { toaster } from "./ui/toaster";
import SubscriptionCard from "./SubscriptionCard";

const SubscriptionSection = () => {
  const user = useAppStore((state) => state.user);
  const triggerRef = useRef(null);
  let fullName = user?.first_name + " " + user?.last_name;
  const [formData, setFormData] = useState({
    fullName: fullName || "",
    phoneNumber: user?.telephone || "",
    email: user?.email || "",
    subscriptionAmount: 9999,
  });
  const publicKey =
    import.meta.env.PUBLIC_KEY ||
    "pk_test_61662d3911a864984f6d29a24e6d6242d9f20cf5";

  const freeBenefits = [
    "Free Property Listings",
    "Placement Of Your Property In Search",
    // "Direct Lead Notifications",
    "High-Resolution Picture Of Your Property",
  ];

  const paidBenefits = [
    "Active Property Listings",
    "Guaranteed Spot in Featured Section",
    "Daily Automatic Listing Boosts",
    "Dedicated Social Media Post (Weekly)",
    // "Exclusive Market Analytics Dashboard",
    "Priority Support (24hr response time)",
    // "Video & Virtual Tour Support",
    // "Premium 'Verified Agent' Badge",
  ];

  const handleSubscribe = (isPaid) => {
    if (!isPaid) {
      window.location.href = "/post-property";
      return;
    }
    if (user) {
      triggerRef.current?.click();
    } else {
      window.location.href = "/signin";
    }
  };

  const handleSuccess = () => {
    toaster.create({
      title: "Subscription successful!",
      description: "Thank you for subscribing to the Premium plan.",
      type: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleClose = () => {
    toaster.create({
      title: "Subscription dialog closed",
      description: "You can subscribe anytime from your dashboard.",
      type: "info",
      duration: 5000,
      isClosable: true,
    });
  };

  const componentProps = {
    email: formData.email,
    amount: formData.subscriptionAmount * 100,
    metadata: {
      name: formData.fullName,
      phoneNumber: formData.phoneNumber,
    },
    publicKey,
    text: "Subscribe",
    onSuccess: handleSuccess,
    onClose: handleClose,
  };

  return (
    <Box
      py={20}
      px={4}
      bg="gray.50"
      _dark={{ bg: "gray.900" }}
      textAlign="center"
      id="subscription-section"
    >
      <Heading
        as="h2"
        size="xl"
        mb={4}
        color="gray.800"
        _dark={{ color: "white" }}
      >
        Boost Your Listings, Close More Deals
      </Heading>
      <Text
        fontSize="lg"
        color="gray.600"
        _dark={{ color: "gray.400" }}
        mb={10}
        maxW="3xl"
        mx="auto"
      >
        Get maximum visibility on your property with our Premium subscription.
      </Text>

      <SimpleGrid
        columns={{ base: 1, md: 2 }}
        spacing={10}
        columnGap={4}
        rowGap={4}
        maxW="5xl"
        mx="auto"
      >
        <SubscriptionCard
          isPaid={false}
          title="Free Tier"
          price="₦0"
          benefits={freeBenefits}
          onSubscribe={() => handleSubscribe(false)}
        />
        <SubscriptionCard
          isPaid={true}
          title="Premium Pro"
          price="₦9,999"
          benefits={paidBenefits}
          onSubscribe={() => handleSubscribe(true)}
        />
      </SimpleGrid>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button ref={triggerRef} style={{ display: "none" }} />
        </Dialog.Trigger>

        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content display="flex" flexDirection="column" gap={4} p={4}>
              <Dialog.Header
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Dialog.Title fontWeight="semibold">Subscribe</Dialog.Title>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Dialog.CloseTrigger>
              </Dialog.Header>

              <Dialog.Body>
                <Field.Root mb={3}>
                  <Field.Label>
                    Full Name <Field.RequiredIndicator />
                  </Field.Label>
                  <Input
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                  />
                </Field.Root>
                <Field.Root mb={3}>
                  <Field.Label>
                    Phone Number <Field.RequiredIndicator />
                  </Field.Label>
                  <Input
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                  />
                </Field.Root>
                <Field.Root mb={3}>
                  <Field.Label>
                    Email <Field.RequiredIndicator />
                  </Field.Label>
                  <Input
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </Field.Root>
                <Field.Root mb={3}>
                  <Field.Label>
                    Subscription Amount <Field.RequiredIndicator />
                  </Field.Label>
                  <Input
                    value={`₦${formData.subscriptionAmount.toLocaleString()}`}
                    isReadOnly
                    focusBorderColor="transparent"
                    _readOnly={{ bg: "gray.100", _dark: { bg: "gray.800" } }}
                  />
                </Field.Root>
              </Dialog.Body>

              <Dialog.Footer
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Dialog.ActionTrigger asChild>
                  <PaystackButton
                    {...componentProps}
                  />
                </Dialog.ActionTrigger>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      {/* <toaster /> */}
    </Box>
  );
};

export default SubscriptionSection;
