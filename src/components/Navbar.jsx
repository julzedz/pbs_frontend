import {
  Box,
  Flex,
  HStack,
  Button,
  Stack,
  Link,
  Image,
  Portal,
  CloseButton,
  Drawer,
  Dialog,
} from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import logo from "../assets/pbs-logo.webp";
import API from "../api";
import { useAppStore } from "../store";

const Links = [
  { label: "Buy", to: "/buy" },
  { label: "Rent", to: "/rent" },
  { label: "About Us", to: "/about" },
  { label: "Contact Us", to: "/contact" },
];

const Navbar = () => {
  const btnRef = useRef();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false); // Add drawer state
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);
  const logout = useAppStore((state) => state.logout);

  const handleLogout = async () => {
    setLoading(true);
    try {
      // This request might fail if the token is already expired
      await API.delete("/users/sign_out");
    } catch (error) {
      // Log the error for debugging purposes, but don't block the logout
      console.error("Server-side logout failed:", error);
    } finally {
      // Always perform client-side cleanup
      logout();
      setDialogOpen(false);
      setLoading(false);
      navigate("/signin");
    }
  };

  return (
    <Box
      bg="white"
      w="100%"
      px={4}
      boxShadow="sm"
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <HStack spacing={8} alignItems={"center"}>
          <RouterLink to="/">
            <HStack gap={{ base: 0, md: "0.5rem" }} mr={{ base: 0, md: 8 }}>
              <Image
                src={logo}
                alt="PropertyBusStopLogo"
                boxSize={{ base: "100px", md: "110px" }}
                mr={{ base: 0, md: 1 }}
              />
            </HStack>
          </RouterLink>
          <HStack as={"nav"} spacing={4} display={{ base: "none", md: "flex" }}>
            {Links.map((link) => {
              return (
                <Link
                  as={RouterLink}
                  key={link.label}
                  to={link.to}
                  px={2}
                  py={1}
                  rounded={"md"}
                  _hover={{ bg: "gray.100" }}
                  fontWeight="bold"
                  transition="border-bottom 0.2s"
                  textDecoration="none"
                  _focus={{
                    outline: "none",
                  }}
                  _active={{ outline: "none" }}
                  _focusVisible={{ outline: "none" }}
                >
                  {link.label}
                </Link>
              );
            })}
          </HStack>
        </HStack>
        <Flex alignItems={"center"}>
          <Button
            colorScheme="purple"
            size="sm"
            mr={2}
            display={{ base: "none", md: "inline-flex" }}
            onClick={() => {
              if (user) {
                navigate("/post-property");
              } else {
                navigate("/signin");
              }
            }}
          >
            Post Property
          </Button>
          {user ? (
            <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
              <Dialog.Trigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  mr={2}
                  display="inline-flex"
                  onClick={() => setDialogOpen(true)}
                >
                  Logout
                </Button>
              </Dialog.Trigger>
              <Portal>
                <Dialog.Backdrop
                  onClick={(e) => {
                    if (e.target === e.currentTarget) setDialogOpen(false);
                  }}
                />
                <Dialog.Positioner>
                  <Dialog.Content>
                    <Dialog.Header
                      display="flex"
                      justifyContent="space-between"
                    >
                      <Dialog.Title>Confirm Logout</Dialog.Title>
                      <CloseButton
                        size="sm"
                        onClick={() => setDialogOpen(false)}
                      />
                    </Dialog.Header>
                    <Dialog.Body>Are you sure you want to logout?</Dialog.Body>
                    <Dialog.Footer
                      display="flex"
                      gap={3}
                      justifyContent="flex-end"
                    >
                      <Button
                        onClick={() => setDialogOpen(false)}
                        variant="ghost"
                      >
                        Cancel
                      </Button>
                      <Dialog.ActionTrigger asChild>
                        <Button
                          colorPalette="red"
                          onClick={handleLogout}
                          isLoading={loading}
                        >
                          Logout
                        </Button>
                      </Dialog.ActionTrigger>
                    </Dialog.Footer>
                  </Dialog.Content>
                </Dialog.Positioner>
              </Portal>
            </Dialog.Root>
          ) : (
            <Button
              as={RouterLink}
              to="/signin"
              variant="outline"
              size={{ base: "xs", md: "sm" }}
              mr={2}
              display="inline-flex"
            >
              Login
            </Button>
          )}
          <Button
            as={RouterLink}
            to="/dashboard"
            variant="ghost"
            size="sm"
            display={{ base: "none", md: "inline-flex" }}
          >
            My Dashboard
          </Button>
          {/* Mobile Drawer Trigger */}
          <Drawer.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
            <Drawer.Trigger asChild>
              <Box
                ref={btnRef}
                ml={4}
                aria-label={"Open Menu"}
                display={{ md: "none" }}
              >
                <FiMenu size={32} />
              </Box>
            </Drawer.Trigger>
            <Portal>
              <Drawer.Backdrop onClick={() => setDrawerOpen(false)} />
              <Drawer.Positioner zIndex={1500}>
                <Drawer.Content minW="60vw" maxW="80vw" bg="white">
                  <CloseButton
                    size="lg"
                    position="absolute"
                    top={2}
                    right={2}
                    onClick={() => setDrawerOpen(false)}
                    _focus={{ outline: "none" }}
                  />
                  <Drawer.Body pt={12} px={4}>
                    <Stack as={"nav"} spacing={4} mt={4}>
                      {Links.map((link) => (
                        <Link
                          as={RouterLink}
                          key={link.label}
                          fontSize={"lg"}
                          fontWeight={"semibold"}
                          to={link.to}
                          px={2}
                          py={4}
                          rounded={"md"}
                          _hover={{ bg: "gray.100" }}
                          onClick={() => setDrawerOpen(false)}
                        >
                          {link.label}
                        </Link>
                      ))}
                      <Button
                        colorScheme="purple"
                        size="lg"
                        w="full"
                        onClick={() => {
                          setDrawerOpen(false);
                          if (user) {
                            navigate("/post-property");
                          } else {
                            navigate("/signin");
                          }
                        }}
                      >
                        Post Property
                      </Button>
                      {user ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          w="full"
                          onClick={() => {
                            setDrawerOpen(false);
                            setDialogOpen(true);
                          }}
                        >
                          Logout
                        </Button>
                      ) : (
                        <Button
                          as={RouterLink}
                          to="/signin"
                          variant="ghost"
                          size="lg"
                          fontSize={"lg"}
                          fontWeight={"semibold"}
                          w="full"
                          color={"purple.600"}
                          onClick={() => setDrawerOpen(false)}
                        >
                          Login
                        </Button>
                      )}
                      <Button
                        as={RouterLink}
                        to="/dashboard"
                        variant="ghost"
                        size="lg"
                        fontWeight={"semibold"}
                        w="full"
                        onClick={() => setDrawerOpen(false)}
                      >
                        My Dashboard
                      </Button>
                    </Stack>
                  </Drawer.Body>
                </Drawer.Content>
              </Drawer.Positioner>
            </Portal>
          </Drawer.Root>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
