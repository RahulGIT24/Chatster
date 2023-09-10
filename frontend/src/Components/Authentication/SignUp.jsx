import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";

const SignUp = () => {
  const {picLoading, postDetails, pic} = ChatState();
  const navigate = useNavigate();
  let toast = useToast();
  const [loading, setloading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Destructuring form data
  const { name, email, password } = formData;

  const [show, setShow] = useState(false);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  

  const submitHandler = async () => {
    setloading(true);
    if (!name || !email || !password) {
      toast({
        title: "Please Fill All the details",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setloading(false);
      return;
    }

    if(password.length<8){
      toast({
        title: "Password Length should be at least 8 characters",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setloading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/auth/createuser",
        {
          name,
          email,
          password,
          pic,
        },
        config
      );

      toast({
        title: "Registration successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setloading(false);
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setloading(false);
    }
  };

  const handleClick = () => {
    setShow(!show);
  };

  return (
    <VStack spacing={"5px"}>
      <FormControl id="name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter your name"
          onChange={onChange}
          borderColor={"purple"}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter your Email Address"
          onChange={onChange}
          borderColor={"purple"}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            placeholder="Password"
            type={show ? "text" : "password"}
            onChange={onChange}
            borderColor={"purple"}
          />
          <InputRightElement width={"4.5rem"}>
            <Button
              h="1.75rem"
              size="sm"
              onClick={handleClick}
              bg={"black"}
              color={"purple"}
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic">
        <FormLabel>Upload your picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/"
          onChange={(e) => postDetails(e.target.files[0])}
          bg={"black"}
          color={"purple"}
          borderColor={"purple"}
        ></Input>
      </FormControl>
      <Button
        className="btn"
        bg={"purple"}
        color={"white"}
        width={"100%"}
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading || picLoading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default SignUp;
