import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";

const ForgotPassword = () => {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [disable, setDisable] = useState(true);
  const [disable2, setDisable2] = useState(true);
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const {setForgotPass} = ChatState();

  const sendMail = async () => {
    setLoading(true);
    if (!email) {
      toast({
        title: "Please Enter Email",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/auth/email-send",
        {
          email,
        },
        config
      );

      toast({
        title: "OTP Send Successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      setLoading(false);
      setDisable(false);
    } catch (error) {
      toast({
        title: "Error Occured or User not existed",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const validateOTP = async () => {
    setLoading2(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/auth/validateOTP",
        {
          email,
          Obtainedotp: String(otp),
        },
        config
      );

      toast({
        title: "Verified",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      setLoading2(false);
      setDisable2(false);
    } catch (error) {
      toast({
        title: "Incorrect OTP",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading2(false);
    }
  };

  const changePassword = async () => {
    if (password.length < 8) {
      toast({
        title: "Password Length should be at least eight characters",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (password !== cpassword) {
      toast({
        title: "Confirm Password and Password are not same",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    setLoading3(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/auth/changePassword",
        {
          email,
          password,
        },
        config
      );

      toast({
        title: "Password Changed Successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading3(false);
      setForgotPass(false);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading2(false);
    }
  };

  return (
    <Container maxW={"xl"} centerContent>
      <Box
        display={"flex"}
        justifyContent={"center"}
        p={3}
        bg={"black"}
        color={"white"}
        borderColor={"purple"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius={"3xl"}
        borderWidth={"1px"}
      >
        <Text fontSize={"2xl"} fontFamily={"Work sans"}>
          Reset Your Chat'Ster Password
        </Text>
      </Box>
      <Box
        bg={"black"}
        borderColor={"purple"}
        p={4}
        borderRadius={"lg"}
        borderWidth={"1px"}
        w="100%"
        color={"white"}
      >
        <VStack spacing={"5px"}>
          <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <InputGroup>
              <Input
                placeholder="Enter your Email Address"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <InputRightElement width={"4.5rem"}>
                <Button
                  h="1.75rem"
                  size="sm"
                  bg={"transparent"}
                  color={"purple"}
                  isLoading={loading}
                  onClick={sendMail}
                >
                  Send OTP
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <FormControl id="OTP" isRequired>
            <FormLabel>Enter OTP</FormLabel>
            <InputGroup>
              <Input
                placeholder="Enter OTP"
                onChange={(e) => {
                  setOtp(e.target.value);
                }}
              />
              <InputRightElement width={"4.5rem"}>
                <Button
                  h="1.75rem"
                  size="sm"
                  bg={"black"}
                  color={"purple"}
                  isLoading={loading2}
                  onClick={validateOTP}
                  isDisabled={disable}
                >
                  Verify
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                placeholder="Password"
                type={show ? "text" : "password"}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <InputRightElement width={"4.5rem"}>
                <Button
                  h="1.75rem"
                  size="sm"
                  onClick={() => {
                    setShow(!show);
                  }}
                  bg={"black"}
                  color={"purple"}
                >
                  {show ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <FormControl id="cpassword" isRequired style={{ marginTop: 10 }}>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
              <Input
                placeholder="Password"
                type={show1 ? "text" : "password"}
                onChange={(e) => {
                  setCpassword(e.target.value);
                }}
              />
              <InputRightElement width={"4.5rem"}>
                <Button
                  h="1.75rem"
                  size="sm"
                  onClick={() => {
                    setShow1(!show1);
                  }}
                  bg={"black"}
                  color={"purple"}
                >
                  {show1 ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Button
            className="btn"
            bg={"purple"}
            color={"white"}
            width={"100%"}
            style={{ marginTop: 15 }}
            isLoading={loading3}
            onClick={changePassword}
            isDisabled={disable2}
          >
            Change Password
          </Button>
          <Text id="forgotPass">
            <Text
              style={{ cursor: "pointer", margin:"7px 0px" }}
              onClick={() => {
                setForgotPass(false);
              }}
            >
              Login Instead
            </Text>
          </Text>
        </VStack>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
