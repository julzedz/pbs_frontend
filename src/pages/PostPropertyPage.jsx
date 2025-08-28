import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Text,
  Input,
  Button,
  Stack,
  Textarea,
  SimpleGrid,
  Image,
  Flex,
  Steps,
  ButtonGroup,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { getStates, getLocalities, getFeatures, createProperty } from "../api";
import { toaster } from "../components/ui/toaster";
import { useAppStore } from "../store";

const MAX_FEATURES_SHOWN = 6;

const PostPropertyPage = () => {
  const user = useAppStore((state) => state.user);
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [states, setStates] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [features, setFeatures] = useState([]);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    title: "",
    purpose: "",
    state_id: "",
    locality_id: "",
    street: "",
    property_type: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    area_size: "",
    feature_ids: [],
    description: "",
    instagram_video_link: "",
    picture: null,
  });
  const [picturePreview, setPicturePreview] = useState(null);
  const fileInputRef = useRef();

  // Fetch states and features on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statesRes, featuresRes] = await Promise.all([
          getStates(),
          getFeatures(),
        ]);
        setStates(statesRes.data.data || []);
        setFeatures(featuresRes.data.data || []);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch localities when state changes
  useEffect(() => {
    if (form.state_id) {
      getLocalities(form.state_id).then((res) => {
        setLocalities(res.data.data || []);
      });
    } else {
      setLocalities([]);
      setForm((f) => ({ ...f, locality_id: "" }));
    }
  }, [form.state_id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" && name === "feature_ids") {
      setForm((prev) => {
        let feature_ids = [...prev.feature_ids];
        if (checked) {
          if (!feature_ids.includes(value)) feature_ids.push(value);
        } else {
          feature_ids = feature_ids.filter((fid) => fid !== value);
        }
        return { ...prev, feature_ids };
      });
    } else if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      const file = e.target.files[0];
      setForm((prev) => ({ ...prev, picture: file }));
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => setPicturePreview(ev.target.result);
        reader.readAsDataURL(file);
      } else {
        setPicturePreview(null);
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Pure validation (no setErrors)
  const isStepValid = (customStep = step) => {
    if (customStep === 0) {
      return (
        !!form.title &&
        !!form.purpose &&
        !!form.state_id &&
        !!form.locality_id &&
        !!form.street &&
        !!form.property_type
      );
    } else if (customStep === 1) {
      return (
        !!form.price &&
        !!form.bedrooms &&
        !!form.bathrooms &&
        !!form.description
      );
    } else if (customStep === 2) {
      return !!form.picture;
    }
    return true;
  };

  // Pure validation for all steps up to a given step
  const isAllUpToValid = (targetStep) => {
    for (let s = 0; s < targetStep; s++) {
      if (!isStepValid(s)) return false;
    }
    return true;
  };

  // Validation that sets errors (call only in event handlers)
  const validateStepAndSetErrors = (customStep = step) => {
    const stepErrors = {};
    if (customStep === 0) {
      if (!form.title) stepErrors.title = "This field is required";
      if (!form.purpose) stepErrors.purpose = "This field is required";
      if (!form.state_id) stepErrors.state_id = "This field is required";
      if (!form.locality_id) stepErrors.locality_id = "This field is required";
      if (!form.street) stepErrors.street = "This field is required";
      if (!form.property_type)
        stepErrors.property_type = "This field is required";
    } else if (customStep === 1) {
      if (!form.price) stepErrors.price = "This field is required";
      if (!form.bedrooms) stepErrors.bedrooms = "This field is required";
      if (!form.bathrooms) stepErrors.bathrooms = "This field is required";
      if (!form.description) stepErrors.description = "This field is required";
    } else if (customStep === 2) {
      if (!form.picture) stepErrors.picture = "This field is required";
    }
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  // Validate all steps up to a given step and set errors for the last invalid step
  const validateAllUpToAndSetErrors = (targetStep) => {
    for (let s = 0; s < targetStep; s++) {
      if (!isStepValid(s)) {
        validateStepAndSetErrors(s);
        return false;
      }
    }
    return true;
  };

  // Handle next/prev
  const handleNext = () => {
    if (validateStepAndSetErrors()) setStep((s) => s + 1);
  };
  const handlePrev = () => setStep((s) => s - 1);

  // Handle step click (only allow if all previous steps are valid)
  const handleStepClick = (targetStep) => {
    if (targetStep === step) return;
    if (targetStep < step || validateAllUpToAndSetErrors(targetStep)) {
      setStep(targetStep);
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStepAndSetErrors()) return;
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append("property[title]", form.title);
      data.append("property[purpose]", form.purpose);
      data.append("property[state_id]", form.state_id);
      data.append("property[locality_id]", form.locality_id);
      data.append("property[street]", form.street);
      data.append("property[property_type]", form.property_type);
      data.append("property[price]", form.price);
      data.append("property[bedrooms]", form.bedrooms);
      data.append("property[bathrooms]", form.bathrooms);
      if (form.area_size) data.append("property[area_size]", form.area_size);
      data.append("property[description]", form.description);
      if (form.instagram_video_link)
        data.append(
          "property[instagram_video_link]",
          form.instagram_video_link
        );
      form.feature_ids.forEach((id) =>
        data.append("property[feature_ids][]", id)
      );
      // Use the file input ref to get the file at submit time
      const file = fileInputRef.current?.files[0];
      if (file) data.append("property[picture]", file);
      await createProperty(data);
      toaster.create({
        description: "Property posted successfully!",
        type: "success",
      });
      navigate("/dashboard");
    } catch {
      toaster.create({
        description: "Failed to post property.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Purpose options from backend enum
  const purposeOptions = [
    { value: "rent", label: "For Rent" },
    { value: "sale", label: "For Sale" },
  ];
  const propertyTypeOptions = [
    { value: "house", label: "House" },
    { value: "land", label: "Land" },
  ];

  // Steps definition
  const steps = [
    { title: "Address" },
    { title: "Info" },
    { title: "Submit" },
  ];

  if (loading) {
    return (
      <Center minH="60vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box maxW={{ base: "unset", md: "3xl" }} w={{ base: "full", md: "unset" }} mx="auto" py={10} px={4}>
      <Text fontSize={{ base: "15px", md: "2xl"}} fontWeight="bold" mb={6}>
        Good day, {user.first_name} {user.last_name}
      </Text>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <Steps.Root value={step} count={steps.length}>
          <Steps.List flexWrap="wrap" mb={8}>
            {steps.map((stepObj, idx) => (
              <Steps.Item fontSize={{ base: "10px", md: "unset" }} key={idx} index={idx} title={stepObj.title}>
                <Steps.Trigger asChild>
                  <button
                    type="button"
                    className={`focus:outline-none ${
                      step === idx
                        ? "font-bold text-purple-700"
                        : "text-gray-600"
                    }`}
                    onClick={() => handleStepClick(idx)}
                    disabled={idx > step && !isAllUpToValid(idx)}
                  >
                    <Steps.Indicator />
                    <Steps.Title fontSize={{ base: "10px", md: "unset" }}>{stepObj.title}</Steps.Title>
                  </button>
                </Steps.Trigger>
                <Steps.Separator />
              </Steps.Item>
            ))}
          </Steps.List>

          {/* Step 1: Address */}
          <Steps.Content index={0}>
            <Box mb={6}>
              <Text fontSize="xl" fontWeight="bold" mb={2}>
                Tell us more about this listing
              </Text>
              <Text color="gray.600" mb={4}>
                We will be more than happy to assist you. Please contact our
                support team if you have any issues during your listing
                creation.
              </Text>
              <Stack spacing={4}>
                <Box>
                  <Text mb={1} fontWeight="medium">
                    Title
                  </Text>
                  <Input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    borderColor={errors.title ? "red.500" : undefined}
                  />
                  {errors.title && (
                    <Text color="red.500" fontSize="sm">
                      {errors.title}
                    </Text>
                  )}
                </Box>
                <Box>
                  <Text mb={1} fontWeight="medium">
                    Purpose
                  </Text>
                  <Stack direction="row" spacing={4}>
                    {purposeOptions.map((opt) => (
                      <Button
                        key={opt.value}
                        variant={
                          form.purpose === opt.value ? "solid" : "outline"
                        }
                        colorScheme={
                          form.purpose === opt.value ? "purple" : "gray"
                        }
                        onClick={() =>
                          setForm((f) => ({ ...f, purpose: opt.value }))
                        }
                      >
                        {opt.label}
                      </Button>
                    ))}
                  </Stack>
                  {errors.purpose && (
                    <Text color="red.500" fontSize="sm">
                      {errors.purpose}
                    </Text>
                  )}
                </Box>
                <Flex gap={4} flexWrap={{ base: "wrap", md: "nowrap" }}>
                  <Box flex={1}>
                    <Text mb={1} fontWeight="medium">
                      State
                    </Text>
                    <select
                      name="state_id"
                      value={form.state_id}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">Select state</option>
                      {states.map((state) => (
                        <option key={state.id} value={state.id}>
                          {state.attributes.name}
                        </option>
                      ))}
                    </select>
                    {errors.state_id && (
                      <Text color="red.500" fontSize="sm">
                        {errors.state_id}
                      </Text>
                    )}
                  </Box>
                  <Box flex={1}>
                    <Text mb={1} fontWeight="medium">
                      Locality
                    </Text>
                    <select
                      name="locality_id"
                      value={form.locality_id}
                      onChange={handleChange}
                      disabled={!form.state_id}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">Select locality</option>
                      {localities.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.attributes.name}
                        </option>
                      ))}
                    </select>
                    {errors.locality_id && (
                      <Text color="red.500" fontSize="sm">
                        {errors.locality_id}
                      </Text>
                    )}
                  </Box>
                </Flex>
                <Box>
                  <Text mb={1} fontWeight="medium">
                    Street / Estate / Neighbourhood
                  </Text>
                  <Input
                    name="street"
                    value={form.street}
                    onChange={handleChange}
                    borderColor={errors.street ? "red.500" : undefined}
                  />
                  {errors.street && (
                    <Text color="red.500" fontSize="sm">
                      {errors.street}
                    </Text>
                  )}
                </Box>
                <Box>
                  <Text mb={1} fontWeight="medium">
                    Property Type
                  </Text>
                  <select
                    name="property_type"
                    value={form.property_type}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">Select type</option>
                    {propertyTypeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {errors.property_type && (
                    <Text color="red.500" fontSize="sm">
                      {errors.property_type}
                    </Text>
                  )}
                </Box>
              </Stack>
            </Box>
          </Steps.Content>

          {/* Step 2: Basic Info */}
          <Steps.Content index={1}>
            <Box mb={6}>
              <Text fontSize="xl" fontWeight="bold" mb={2}>
                Tell us more about this listing
              </Text>
              <Stack spacing={4}>
                <Flex gap={4} flexDir={{ base: "column", md: "row" }} flexWrap={{ base: "wrap", md: "nowrap" }}>
                  <Box flex={1}>
                    <Text mb={1} fontWeight="medium">
                      Price
                    </Text>
                    <Input
                      name="price"
                      type="number"
                      value={form.price}
                      onChange={handleChange}
                      borderColor={errors.price ? "red.500" : undefined}
                    />
                    {errors.price && (
                      <Text color="red.500" fontSize="sm">
                        {errors.price}
                      </Text>
                    )}
                  </Box>
                  <Box flex={1}>
                    <Text mb={1} fontWeight="medium">
                      Bedrooms
                    </Text>
                    <Input
                      name="bedrooms"
                      type="number"
                      value={form.bedrooms}
                      onChange={handleChange}
                      borderColor={errors.bedrooms ? "red.500" : undefined}
                    />
                    {errors.bedrooms && (
                      <Text color="red.500" fontSize="sm">
                        {errors.bedrooms}
                      </Text>
                    )}
                  </Box>
                  <Box flex={1}>
                    <Text mb={1} fontWeight="medium">
                      Bathrooms
                    </Text>
                    <Input
                      name="bathrooms"
                      type="number"
                      value={form.bathrooms}
                      onChange={handleChange}
                      borderColor={errors.bathrooms ? "red.500" : undefined}
                    />
                    {errors.bathrooms && (
                      <Text color="red.500" fontSize="sm">
                        {errors.bathrooms}
                      </Text>
                    )}
                  </Box>
                  <Box flex={1}>
                    <Text mb={1} fontWeight="medium">
                      Area Size (optional)
                    </Text>
                    <Input
                      name="area_size"
                      type="text"
                      value={form.area_size}
                      onChange={handleChange}
                    />
                  </Box>
                </Flex>
                <Box>
                  <Text mb={1} fontWeight="medium">
                    Description
                  </Text>
                  <Textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    borderColor={errors.description ? "red.500" : undefined}
                  />
                  {errors.description && (
                    <Text color="red.500" fontSize="sm">
                      {errors.description}
                    </Text>
                  )}
                </Box>
                <Box>
                  <Text mb={1} fontWeight="medium">
                    Features
                  </Text>
                  <SimpleGrid
                    columns={{ base: 1, sm: 2, md: 3 }}
                    spacing={2}
                    mb={2}
                  >
                    {(showAllFeatures
                      ? features
                      : features.slice(0, MAX_FEATURES_SHOWN)
                    ).map((feature) => (
                      <label
                        key={feature.id}
                        className="flex items-center space-x-2 py-1 cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          name="feature_ids"
                          value={String(feature.id)}
                          checked={form.feature_ids.includes(
                            String(feature.id)
                          )}
                          onChange={handleChange}
                          className="accent-purple-600 w-4 h-4 border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
                        />
                        <span className="text-gray-700">
                          {feature.attributes.name}
                        </span>
                      </label>
                    ))}
                  </SimpleGrid>
                  {features.length > MAX_FEATURES_SHOWN && (
                    <Button
                      size="sm"
                      variant="link"
                      colorScheme="purple"
                      onClick={() => setShowAllFeatures((v) => !v)}
                    >
                      {showAllFeatures ? "Show less" : "Show more"}
                    </Button>
                  )}
                </Box>
                <Box>
                  <Text mb={1} fontWeight="medium">
                    Social Media Video Link (optional)
                  </Text>
                  <Input
                    name="instagram_video_link"
                    value={form.instagram_video_link}
                    onChange={handleChange}
                  />
                </Box>
              </Stack>
            </Box>
          </Steps.Content>

          {/* Step 3: Picture & Submit */}
          <Steps.Content index={2}>
            <Box mb={6}>
              <Text fontSize="xl" fontWeight="bold" mb={2}>
                Upload a picture of the property
              </Text>
              <Input
                type="file"
                accept="image/*"
                name="picture"
                onChange={handleChange}
                ref={fileInputRef}
                borderColor={errors.picture ? "red.500" : undefined}
              />
              {errors.picture && (
                <Text color="red.500" fontSize="sm">
                  {errors.picture}
                </Text>
              )}
              {picturePreview && (
                <Image
                  src={picturePreview}
                  alt="Preview"
                  mt={4}
                  maxH="300px"
                  borderRadius="md"
                />
              )}
            </Box>
            <Button
              colorScheme="purple"
              size="lg"
              type="submit"
              isLoading={submitting}
              w="full"
            >
              Submit Property
            </Button>
          </Steps.Content>

          <Steps.CompletedContent>
            <Text fontSize="xl" color="green.600" fontWeight="bold">
              All steps are complete!
            </Text>
          </Steps.CompletedContent>

          <ButtonGroup
            size="sm"
            variant="outline"
            mt={8}
            w="full"
            justifyContent="space-between"
          >
            {step > 0 && (
              <Steps.PrevTrigger asChild>
                <Button onClick={handlePrev}>Prev</Button>
              </Steps.PrevTrigger>
            )}
            {step < steps.length - 1 && (
              <Steps.NextTrigger asChild>
                <Button onClick={handleNext} disabled={!isStepValid()}>
                  Next
                </Button>
              </Steps.NextTrigger>
            )}
          </ButtonGroup>
        </Steps.Root>
      </form>
    </Box>
  );
};

export default PostPropertyPage;
