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
  IconButton,
  Container,
  Stack,
} from "@chakra-ui/react";
import { useState, useMemo } from "react";
import { signup } from "../api";
import { useNavigate } from "react-router-dom";
import logo from "../assets/pbs-logo.webp";
import { LuEye, LuEyeOff } from "react-icons/lu";

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
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Mark field as touched
    setTouched({ ...touched, [name]: true });

    // Real-time validation
    validateField(name, value);
    setServerError("");
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    validateField(name, value);
  };

  const validateField = (fieldName, value) => {
    let error = "";

    switch (fieldName) {
      case "firstName":
        if (!value.trim()) {
          error = "First name is required";
        } else if (!validateName(value)) {
          error =
            "First name must be at least 2 letters and contain only letters, spaces, hyphens, or apostrophes";
        }
        break;

      case "lastName":
        if (!value.trim()) {
          error = "Last name is required";
        } else if (!validateName(value)) {
          error =
            "Last name must be at least 2 letters and contain only letters, spaces, hyphens, or apostrophes";
        }
        break;

      case "phone":
        if (!value.trim()) {
          error = "Phone number is required";
        } else if (!validatePhone(value)) {
          error =
            "Phone number must be in format: 08012345678 (11 digits starting with 0)";
        }
        break;

      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!validateEmail(value)) {
          error = "Please enter a valid email address";
        }
        break;

      case "password":
        if (!value) {
          error = "Password is required";
        } else if (!validatePassword(value)) {
          error = "Password must be at least 7 characters long";
        }
        break;

      case "confirmPassword":
        if (!value) {
          error = "Please confirm your password";
        } else if (form.password !== value) {
          error = "Passwords do not match";
        }
        break;

      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: error }));
  }; // Validation functions
  const validateName = (name) => {
    if (!name.trim()) return false;
    if (name.trim().length < 2) return false;
    return /^[a-zA-Z\s-']+$/.test(name);
  };

  const validatePhone = (phone) => {
    // Nigerian phone format: 11 digits starting with 0
    return /^0\d{10}$/.test(phone);
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 7;
  };

  // Check if form is valid
  const isFormValid = useMemo(() => {
    return (
      validateName(form.firstName) &&
      validateName(form.lastName) &&
      validatePhone(form.phone) &&
      validateEmail(form.email) &&
      validatePassword(form.password) &&
      form.password === form.confirmPassword &&
      form.confirmPassword.length > 0
    );
  }, [form]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errs = {};

    if (!form.firstName.trim()) {
      errs.firstName = "First name is required";
    } else if (!validateName(form.firstName)) {
      errs.firstName =
        "First name must be at least 2 letters and contain only letters, spaces, hyphens, or apostrophes";
    }

    if (!form.lastName.trim()) {
      errs.lastName = "Last name is required";
    } else if (!validateName(form.lastName)) {
      errs.lastName =
        "Last name must be at least 2 letters and contain only letters, spaces, hyphens, or apostrophes";
    }

    if (!form.phone.trim()) {
      errs.phone = "Phone number is required";
    } else if (!validatePhone(form.phone)) {
      errs.phone =
        "Phone number must be in format: 08012345678 (11 digits starting with 0)";
    }

    if (!form.email.trim()) {
      errs.email = "Email is required";
    } else if (!validateEmail(form.email)) {
      errs.email = "Please enter a valid email address";
    }

    if (!form.password) {
      errs.password = "Password is required";
    } else if (!validatePassword(form.password)) {
      errs.password = "Password must be at least 7 characters long";
    }

    if (!form.confirmPassword) {
      errs.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }

    setErrors(errs);
    setServerError("");

    if (Object.keys(errs).length === 0) {
      try {
        await signup(form);
        navigate("/signin");
      } catch (err) {
        // Enhanced error handling from backend
        if (err.response) {
          const { status, data } = err.response;

          // Handle different status codes
          if (status === 422 && data.errors) {
            // Validation errors from backend
            const backendErrors = {};

            // Map backend errors to form fields
            Object.keys(data.errors).forEach((key) => {
              const errorMessages = data.errors[key];
              const fieldName =
                key === "telephone"
                  ? "phone"
                  : key === "first_name"
                  ? "firstName"
                  : key === "last_name"
                  ? "lastName"
                  : key;

              if (errorMessages && errorMessages.length > 0) {
                // Customize error messages for better UX
                let message = errorMessages[0];

                if (message.includes("has already been taken")) {
                  if (key === "email") {
                    message =
                      "This email has already been used to create an account";
                  } else if (key === "telephone") {
                    message = "This phone number has already been registered";
                  }
                }

                backendErrors[fieldName] = message;
              }
            });

            setErrors(backendErrors);
            setServerError("Please correct the errors below");
          } else if (status === 500) {
            setServerError("Server error. Please try again later");
          } else if (data.status && data.status.message) {
            setServerError(data.status.message);
          } else {
            setServerError("Signup failed. Please try again");
          }
        } else if (err.request) {
          // Network error
          setServerError(
            "Network connection failed. Please check your internet connection and try again"
          );
        } else {
          setServerError("An unexpected error occurred. Please try again");
        }
      }
    }
  };

  return (
    <Box
      minH="100vh"
      bg="gray.50"
      py={{ base: 8, md: 12 }}
      px={{ base: 4, md: 8 }}
    >
      <Container maxW="md">
        <Box
          bg="white"
          rounded="xl"
          shadow="lg"
          p={{ base: 6, md: 8 }}
          border="1px"
          borderColor="gray.200"
        >
          <VStack spacing={6} mb={6}>
            <Image
              src={logo}
              alt="PropertyBusStop Logo"
              boxSize={{ base: "100px", md: "120px" }}
              objectFit="contain"
            />
            <Box textAlign="center">
              <Heading
                size={{ base: "lg", md: "xl" }}
                color="purple.600"
                mb={2}
              >
                Create Account
              </Heading>
              <Text color="gray.600" fontSize="sm">
                Join PropertyBusStop today
              </Text>
            </Box>
          </VStack>

          {serverError && (
            <Box
              bg="red.50"
              border="1px"
              borderColor="red.200"
              rounded="md"
              p={3}
              mb={4}
            >
              <Text color="red.600" fontSize="sm" textAlign="center">
                {serverError}
              </Text>
            </Box>
          )}

          <form onSubmit={handleSubmit}>
            <Fieldset.Root>
              <Stack spacing={4}>
                <Field.Root>
                  <Field.Label fontWeight="medium" color="gray.700">
                    First Name
                  </Field.Label>
                  <Input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your first name"
                    size="lg"
                    borderColor={
                      errors.firstName && touched.firstName
                        ? "red.300"
                        : "gray.300"
                    }
                    _focus={{
                      borderColor:
                        errors.firstName && touched.firstName
                          ? "red.500"
                          : "purple.500",
                      boxShadow:
                        errors.firstName && touched.firstName
                          ? "0 0 0 1px var(--chakra-colors-red-500)"
                          : "0 0 0 1px var(--chakra-colors-purple-500)",
                    }}
                  />
                  {errors.firstName && touched.firstName && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errors.firstName}
                    </Text>
                  )}
                </Field.Root>

                <Field.Root>
                  <Field.Label fontWeight="medium" color="gray.700">
                    Last Name
                  </Field.Label>
                  <Input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your last name"
                    size="lg"
                    borderColor={
                      errors.lastName && touched.lastName
                        ? "red.300"
                        : "gray.300"
                    }
                    _focus={{
                      borderColor:
                        errors.lastName && touched.lastName
                          ? "red.500"
                          : "purple.500",
                      boxShadow:
                        errors.lastName && touched.lastName
                          ? "0 0 0 1px var(--chakra-colors-red-500)"
                          : "0 0 0 1px var(--chakra-colors-purple-500)",
                    }}
                  />
                  {errors.lastName && touched.lastName && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errors.lastName}
                    </Text>
                  )}
                </Field.Root>

                <Field.Root>
                  <Field.Label fontWeight="medium" color="gray.700">
                    Phone Number
                  </Field.Label>
                  <Input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="08012345678"
                    size="lg"
                    type="tel"
                    borderColor={
                      errors.phone && touched.phone ? "red.300" : "gray.300"
                    }
                    _focus={{
                      borderColor:
                        errors.phone && touched.phone
                          ? "red.500"
                          : "purple.500",
                      boxShadow:
                        errors.phone && touched.phone
                          ? "0 0 0 1px var(--chakra-colors-red-500)"
                          : "0 0 0 1px var(--chakra-colors-purple-500)",
                    }}
                  />
                  {errors.phone && touched.phone && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errors.phone}
                    </Text>
                  )}
                </Field.Root>

                <Field.Root>
                  <Field.Label fontWeight="medium" color="gray.700">
                    Email
                  </Field.Label>
                  <Input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="your.email@example.com"
                    size="lg"
                    borderColor={
                      errors.email && touched.email ? "red.300" : "gray.300"
                    }
                    _focus={{
                      borderColor:
                        errors.email && touched.email
                          ? "red.500"
                          : "purple.500",
                      boxShadow:
                        errors.email && touched.email
                          ? "0 0 0 1px var(--chakra-colors-red-500)"
                          : "0 0 0 1px var(--chakra-colors-purple-500)",
                    }}
                  />
                  {errors.email && touched.email && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errors.email}
                    </Text>
                  )}
                </Field.Root>

                <Field.Root>
                  <Field.Label fontWeight="medium" color="gray.700">
                    Password
                  </Field.Label>
                  <Box position="relative" width="100%">
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter password (min. 7 characters)"
                      size="lg"
                      paddingRight="2.5rem"
                      borderColor={
                        errors.password && touched.password
                          ? "red.300"
                          : "gray.300"
                      }
                      _focus={{
                        borderColor:
                          errors.password && touched.password
                            ? "red.500"
                            : "purple.500",
                        boxShadow:
                          errors.password && touched.password
                            ? "0 0 0 1px var(--chakra-colors-red-500)"
                            : "0 0 0 1px var(--chakra-colors-purple-500)",
                      }}
                    />
                    <IconButton
                      position="absolute"
                      right="0.25rem"
                      top="50%"
                      transform="translateY(-50%)"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowPassword(!showPassword)}
                      variant="ghost"
                      size="sm"
                      color="gray.500"
                      _hover={{ color: "purple.600" }}
                    >
                      {showPassword ? <LuEyeOff /> : <LuEye />}
                    </IconButton>
                  </Box>
                  {errors.password && touched.password && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errors.password}
                    </Text>
                  )}
                </Field.Root>

                <Field.Root>
                  <Field.Label fontWeight="medium" color="gray.700">
                    Confirm Password
                  </Field.Label>
                  <Box position="relative" width="100%">
                    <Input
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Re-enter your password"
                      size="lg"
                      paddingRight="2.5rem"
                      borderColor={
                        errors.confirmPassword && touched.confirmPassword
                          ? "red.300"
                          : "gray.300"
                      }
                      _focus={{
                        borderColor:
                          errors.confirmPassword && touched.confirmPassword
                            ? "red.500"
                            : "purple.500",
                        boxShadow:
                          errors.confirmPassword && touched.confirmPassword
                            ? "0 0 0 1px var(--chakra-colors-red-500)"
                            : "0 0 0 1px var(--chakra-colors-purple-500)",
                      }}
                    />
                    <IconButton
                      position="absolute"
                      right="0.25rem"
                      top="50%"
                      transform="translateY(-50%)"
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      variant="ghost"
                      size="sm"
                      color="gray.500"
                      _hover={{ color: "purple.600" }}
                    >
                      {showConfirmPassword ? <LuEyeOff /> : <LuEye />}
                    </IconButton>
                  </Box>
                  {errors.confirmPassword && touched.confirmPassword && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errors.confirmPassword}
                    </Text>
                  )}
                </Field.Root>

                <Button
                  colorScheme="purple"
                  type="submit"
                  w="full"
                  size="lg"
                  disabled={!isFormValid}
                  _disabled={{ opacity: 0.6, cursor: "not-allowed" }}
                  mt={2}
                >
                  Create Account
                </Button>

                <Text textAlign="center" fontSize="sm" color="gray.600">
                  Already have an account?{" "}
                  <Button
                    variant="link"
                    colorScheme="purple"
                    onClick={() => navigate("/signin")}
                    size="sm"
                  >
                    Sign in
                  </Button>
                </Text>
              </Stack>
            </Fieldset.Root>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default SignupPage;
