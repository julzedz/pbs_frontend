import React, { useState } from "react";
import {
  Box,
  Text,
  Button,
  Stack,
  Input,
  HStack,
  VStack,
  Heading,
  Spinner,
  Flex,
} from "@chakra-ui/react";
import { useAppStore } from "../store";
import { updateUserProfile } from "../api";
import { useNavigate } from "react-router-dom";
import { toaster } from "../components/ui/toaster";

const EditProfilePage = () => {
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    telephone: user?.telephone || "",
  });

  // Editing state for each field
  const [editingFields, setEditingFields] = useState({
    first_name: false,
    last_name: false,
    email: false,
    telephone: false,
  });

  // Loading state for each field
  const [loadingFields, setLoadingFields] = useState({
    first_name: false,
    last_name: false,
    email: false,
    telephone: false,
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleEditMode = (field) => {
    setEditingFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));

    // Reset form data to original values if canceling edit
    if (editingFields[field]) {
      setFormData((prev) => ({
        ...prev,
        [field]: user[field] || "",
      }));
    }
  };

  const handleSave = async (field) => {
    setLoadingFields((prev) => ({
      ...prev,
      [field]: true,
    }));

    try {
      await updateUserProfile({
        ...formData,
        [field]: formData[field],
      });

      // Update the user in the store immediately using local form state
      const updatedUser = {
        ...user,
        ...formData,
      };
      setUser(updatedUser);

      // Exit edit mode
      setEditingFields((prev) => ({
        ...prev,
        [field]: false,
      }));

      toaster.create({
        title: "Profile Updated",
        description: `${field.replace("_", " ")} updated successfully`,
        type: "success",
      });
    } catch (error) {
      toaster.create({
        title: "Update Failed",
        description:
          error.response?.data?.message || "Failed to update profile",
        type: "error",
      });
    } finally {
      setLoadingFields((prev) => ({
        ...prev,
        [field]: false,
      }));
    }
  };

  const renderField = (field, label, type = "text") => {
    const isEditing = editingFields[field];
    const isLoading = loadingFields[field];

    return (
      <HStack key={field} spacing={4} align="center" w="full">
        <Text fontWeight="medium" minW="120px">
          {label}:
        </Text>
        <Input
          type={type}
          value={formData[field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          disabled={!isEditing}
          flex={1}
          maxW="400px"
        />
        <Button
          size="sm"
          colorScheme={isEditing ? "green" : "blue"}
          onClick={() =>
            isEditing ? handleSave(field) : toggleEditMode(field)
          }
          isLoading={isLoading}
          loadingText="Saving"
          minW="80px"
        >
          {isLoading ? <Spinner size="sm" /> : isEditing ? "Save" : "Edit"}
        </Button>
        {isEditing && !isLoading && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => toggleEditMode(field)}
          >
            Cancel
          </Button>
        )}
      </HStack>
    );
  };

  return (
    <Box maxW="4xl" mx="auto" py={10} px={4}>
      <Stack spacing={8}>
        {/* Header */}
        <Box>
          <Heading size="lg" mb={2}>
            Edit Profile
          </Heading>
          <Text color="gray.600">
            Update your personal information. Click "Edit" next to any field to
            make changes.
          </Text>
        </Box>

        {/* Profile Form */}
        <Box
          borderWidth="1px"
          borderRadius="lg"
          p={6}
          bg="white"
          boxShadow="md"
        >
          <VStack spacing={6} align="stretch">
            {renderField("first_name", "First Name")}
            {renderField("last_name", "Last Name")}
            {renderField("email", "Email", "email")}
            {renderField("telephone", "Phone Number", "tel")}
          </VStack>
        </Box>

        {/* Navigation Buttons */}
        <Flex gap={4} justify="flex-start">
          <Button colorScheme="purple" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </Flex>
      </Stack>
    </Box>
  );
};

export default EditProfilePage;
