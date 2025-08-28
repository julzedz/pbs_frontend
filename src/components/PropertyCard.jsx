import {
  Box,
  Image,
  Text,
  Badge,
  Stack,
  Button,
  Dialog,
  Portal,
  CloseButton,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useAppStore } from "../store";
import { deleteProperty } from "../api";
import { toaster } from "./ui/toaster";

const PropertyCard = ({ property, onClick, isOwner = false }) => {
  const { title, price, description, image_url, property_type } =
    property.attributes;
  const markPropertyDeleted = useAppStore((s) => s.markPropertyDeleted);
  const user = useAppStore((s) => s.user);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const cancelRef = useRef();

  const openDialog = (e) => {
    e.stopPropagation();
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => setIsDialogOpen(false);

  const handleCancelDialog = (e) => {
    e.stopPropagation();
    setIsDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProperty(property.id);
      markPropertyDeleted(property.id);
      toaster.create({
        title: "Property deleted",
        description: `${title || "Property"} has been deleted`,
        type: "success",
      });
      handleCloseDialog();
    } catch (err) {
      const message = err.response?.data?.error || "Unable to delete property";
      toaster.create({
        title: "Delete failed",
        description: message,
        type: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const canDelete = isOwner || property.attributes?.user_id === user?.id;

  return (
    <Box
      onClick={!isDialogOpen ? onClick : undefined}
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
        {canDelete && (
          <Button
            mt={4}
            colorScheme="red"
            onClick={openDialog}
            variant="outline"
            isLoading={isDeleting}
            loadingText="Deleting"
          >
            Delete
          </Button>
        )}
      </Box>

      <Dialog.Root
        open={isDialogOpen}
        onOpenChange={(e) => setIsDialogOpen(e.open)}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Delete Property</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                Are you sure you want to delete {title || "this"} property?
              </Dialog.Body>
              <Dialog.Footer>
                <Button
                  variant="outline"
                  ref={cancelRef}
                  onClick={handleCancelDialog}
                >
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={handleConfirmDelete}
                  ml={3}
                  isLoading={isDeleting}
                  loadingText="Deleting"
                >
                  Delete
                </Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Box>
  );
};
export default PropertyCard;
