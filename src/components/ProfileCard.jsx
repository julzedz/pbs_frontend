import {
  Box,
  Text,
  Stack,
  Avatar,
  Button,
  HStack,
  Input,
  VisuallyHidden,
} from "@chakra-ui/react";
import { useRef, useState } from "react";

const ProfileCard = ({ user, large }) => {
  const [profilePic, setProfilePic] = useState(user?.profilePicUrl || "");
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setProfilePic(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={large ? 6 : 4}
      bg="gray.50"
      boxShadow={large ? "md" : "sm"}
      mb={4}
      mx="auto"
      height="100%"
    >
      <Stack
        direction="row"
        align="center"
        spacing={large ? 6 : 4}
        mb={large ? 4 : 2}
      >
        <Avatar.Root size={large ? "2xl" : "lg"}>
          {profilePic ? (
            <Avatar.Image src={profilePic} alt={user.first_name} />
          ) : (
            <Avatar.Fallback name={`${user.first_name} ${user.last_name}`} />
          )}
        </Avatar.Root>
        <Button
          size={large ? "md" : "xs"}
          colorScheme="purple"
          borderRadius="full"
          onClick={() => fileInputRef.current.click()}
        >
          +
        </Button>
        <VisuallyHidden>
          <Input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </VisuallyHidden>
      </Stack>
      <Text
        fontWeight="bold"
        fontSize={large ? "2xl" : "lg"}
        mb={large ? 1 : 0}
      >
        {user.first_name} {user.last_name}
      </Text>
      <Text color="gray.600" fontSize={large ? "lg" : "sm"} mb={large ? 1 : 0}>
        {user.email}
      </Text>
      <Text color="gray.600" fontSize={large ? "lg" : "sm"} mb={large ? 1 : 0}>
        {user.telephone}
      </Text>
      <Text color="gray.500" fontSize={large ? "md" : "xs"} mt={large ? 2 : 1}>
        Member Since:{" "}
        {user.created_at ? new Date(user.created_at).toLocaleDateString() : "-"}
      </Text>
    </Box>
  );
};

export default ProfileCard;
