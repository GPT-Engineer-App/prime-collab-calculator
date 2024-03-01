// src/pages/Index.jsx
import React, { useState, useEffect } from "react";
import { Box, Button, Container, Heading, Text, VStack, CircularProgress, CircularProgressLabel, useToast } from "@chakra-ui/react";
import { FaPlay, FaPause, FaSync } from "react-icons/fa";

const isMersennePrime = (number) => {
  let s = 4;
  for (let i = 0; i < number - 2; i++) {
    s = (s ** 2 - 2) % (2 ** number - 1);
  }
  return s === 0;
};

const getNextPotentialMersenne = (currentMax) => {
  let next = currentMax + 1;
  while ((next & (next - 1)) !== 0) {
    // Ensure it's a power of two minus one (potential Mersenne)
    next++;
  }
  return next;
};

const Index = () => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [currentMax, setCurrentMax] = useState(2);
  const [mersennePrimes, setMersennePrimes] = useState([]);
  const toast = useToast();

  useEffect(() => {
    let interval;
    if (isCalculating) {
      interval = setInterval(() => {
        const nextPotential = getNextPotentialMersenne(currentMax);
        setCurrentMax(nextPotential);
        if (isMersennePrime(nextPotential)) {
          setMersennePrimes([...mersennePrimes, nextPotential]);
          toast({
            title: "New Mersenne Prime Found!",
            description: `2^${nextPotential} - 1 is a Mersenne Prime`,
            status: "success",
            duration: 9000,
            isClosable: true,
          });
        }
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isCalculating, currentMax, mersennePrimes, toast]);

  const handleStartStop = () => {
    setIsCalculating(!isCalculating);
  };

  const handleReset = () => {
    setCurrentMax(2);
    setMersennePrimes([]);
  };

  return (
    <Container centerContent>
      <VStack spacing={5} mt={10}>
        <Heading>Mersenne Prime Generator</Heading>
        <Text>Connect and generate Mersenne primes together!</Text>
        <CircularProgress value={(currentMax % 100) * 100} color="green.400">
          <CircularProgressLabel>{currentMax}</CircularProgressLabel>
        </CircularProgress>
        <Box>
          <Button leftIcon={isCalculating ? <FaPause /> : <FaPlay />} onClick={handleStartStop} mr={3}>
            {isCalculating ? "Pause" : "Start"}
          </Button>
          <Button leftIcon={<FaSync />} onClick={handleReset}>
            Reset
          </Button>
        </Box>
        <Box>
          <Heading size="md">Found Mersenne Primes</Heading>
          {mersennePrimes.map((prime, index) => (
            <Text key={index}>{`2^${prime} - 1`}</Text>
          ))}
        </Box>
      </VStack>
    </Container>
  );
};

export default Index;
