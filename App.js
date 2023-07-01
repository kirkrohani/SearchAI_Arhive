import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState } from 'react';

import axios from 'axios';

const App = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const callChatGptApi = async () => {
    try {

      const messages = [
        { role: "user", content: input },
      ];

      const options = {
        temperature: 0.8,
        max_tokens: 100,
      };

      const openai = axios.create({
        baseURL: "https://api.openai.com/v1",
        headers: {
          "Content-Type": "application/json",
          'Authorization': 'Bearer ', // Replace with your actual key
        },
      });

      async function createChatCompletion(messages, options = {}) {
        try {
          const response = await openai.post("/chat/completions", {
            model: options.model || "gpt-3.5-turbo",
            messages,
            ...options,
          });

          return response.data.choices;
        } catch (error) {
          console.error("Error creating chat completion:", error);
        }
      }

      const result = await createChatCompletion(messages, options);
      console.log('*****************RESULT: ', result[0].message);
      if (result && result[0].message && result[0].message.content) {
        setResponse(result[0].message.content);
      }
    } catch (error) {
      console.error('ERROR calling ChatGPT API: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Write something..."
        value={input}
        onChangeText={setInput}
      />
      <Button title="Send" onPress={callChatGptApi} />
      <Text style={styles.responseText}>{response}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
  responseText: {
    marginTop: 20,
  },
});

export default App;
