import {
  Box,
  Button,
  Input,
  Heading,
  VStack,
  Field,
  Fieldset,
  Text,
  Link,
  HStack,
  Image,
} from "@chakra-ui/react";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import logo from "../assets/property.png";
import { signin } from "../api";

const SigninPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errs = {};
    if (!form.email) errs.email = "Email is required";
    if (!form.password) errs.password = "Password is required";
    setErrors(errs);
    setServerError("");
    if (Object.keys(errs).length === 0) {
      try {
        await signin(form);
        navigate("/dashboard");
      } catch (err) {
        if (err.response && err.response.data && err.response.data.status) {
          setServerError(err.response.data.status.message || "Signin failed");
        } else {
          setServerError("Signin failed. Please try again.");
        }
      }
    }
  };

  return (
    <Box
      maxW="md"
      mx="auto"
      mt={12}
      p={8}
      boxShadow="md"
      bg="white"
      rounded="lg"
    >
      <VStack spacing={4} mb={6}>
        <Image src={logo} alt="PropertyBusStopLogo" boxSize="48px" />
        <Text fontSize="2xl" fontWeight="bold" color="purple.700">
          Property BusStop
        </Text>
      </VStack>
      <Heading mb={6} textAlign="center">
        Sign In
      </Heading>
      {serverError && (
        <Text color="red.500" fontSize="sm" mb={2} textAlign="center">
          {serverError}
        </Text>
      )}
      <form onSubmit={handleSubmit}>
        <Fieldset.Root>
          <VStack spacing={4}>
            <Field.Root>
              <Field.Label>Email</Field.Label>
              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && (
                <Text color="red.500" fontSize="sm">
                  {errors.email}
                </Text>
              )}
            </Field.Root>
            <Field.Root>
              <Field.Label>Password</Field.Label>
              <Input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
              />
              {errors.password && (
                <Text color="red.500" fontSize="sm">
                  {errors.password}
                </Text>
              )}
            </Field.Root>
            <Button colorScheme="purple" type="submit" w="full">
              Sign In
            </Button>
          </VStack>
        </Fieldset.Root>
      </form>
      <VStack spacing={2} mt={6}>
        <HStack>
          <Text fontSize="sm">Don't have an account?</Text>
          <Link
            as={RouterLink}
            to="/signup"
            color="purple.600"
            fontWeight="bold"
          >
            Sign Up
          </Link>
        </HStack>
        <Link
          as={RouterLink}
          to="/forgot-password"
          color="purple.600"
          fontSize="sm"
        >
          Forgot Password?
        </Link>
      </VStack>
    </Box>
  );
};

export default SigninPage;
