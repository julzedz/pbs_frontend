import {
  Box,
  Button,
  Input,
  Heading,
  VStack,
  Field,
  Fieldset,
  Text,
  Image,
} from "@chakra-ui/react";
import { useState } from "react";
import { signup } from "../api";
import { useNavigate } from "react-router-dom";
import logo from "../assets/property.png";

const SignupPage = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errs = {};
    if (!form.firstName) errs.firstName = "First name is required";
    if (!form.lastName) errs.lastName = "Last name is required";
    if (!form.phone) errs.phone = "Phone number is required";
    if (!form.email) errs.email = "Email is required";
    if (!form.password) errs.password = "Password is required";
    if (form.password !== form.confirmPassword)
      errs.confirmPassword = "Passwords do not match";
    setErrors(errs);
    setServerError("");
    if (Object.keys(errs).length === 0) {
      try {
        await signup(form);
        navigate("/signin");
      } catch (err) {
        if (err.response && err.response.data && err.response.data.status) {
          setServerError(err.response.data.status.message || "Signup failed");
        } else {
          setServerError("Signup failed. Please try again.");
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
        Sign Up
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
              <Field.Label>First Name</Field.Label>
              <Input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
              />
              {errors.firstName && (
                <Text color="red.500" fontSize="sm">
                  {errors.firstName}
                </Text>
              )}
            </Field.Root>
            <Field.Root>
              <Field.Label>Last Name</Field.Label>
              <Input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
              />
              {errors.lastName && (
                <Text color="red.500" fontSize="sm">
                  {errors.lastName}
                </Text>
              )}
            </Field.Root>
            <Field.Root>
              <Field.Label>Phone Number</Field.Label>
              <Input name="phone" value={form.phone} onChange={handleChange} />
              {errors.phone && (
                <Text color="red.500" fontSize="sm">
                  {errors.phone}
                </Text>
              )}
            </Field.Root>
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
            <Field.Root>
              <Field.Label>Confirm Password</Field.Label>
              <Input
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <Text color="red.500" fontSize="sm">
                  {errors.confirmPassword}
                </Text>
              )}
            </Field.Root>
            <Button colorScheme="purple" type="submit" w="full">
              Register
            </Button>
          </VStack>
        </Fieldset.Root>
      </form>
    </Box>
  );
};

export default SignupPage;
