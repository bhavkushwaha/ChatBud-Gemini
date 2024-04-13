import { useState } from "react";

const App = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const surpriseOptions = [
    "Where does burger come from?",
    "Who won the latest IPL title",
    "How much time does it take to travel from Delhi to Mumbai by airplane?",
  ];

  const surprise = () => {
    const randomValue =
      surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setValue(randomValue);
  };

  const getResponse = async () => {
    if (!value) {
      setError("Error! PLease ask a question!");
      return;
    }
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          history: chatHistory,
          message: value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await fetch("http://localhost:8000/gemini", options);
      const data = await response.text();
      // console.log(data);
      setChatHistory((oldChatHistory) => [
        ...oldChatHistory,
        {
          role: "user",
          parts: [{ text: value }],
        },
        {
          role: "model",
          parts: [{ text: data }],
        },
      ]);

      setValue("");
    } catch (error) {
      console.error(error);
      setError("Something went wrong! Please try again later.");
    }
  };

  const clear = () => {
    setValue("")
    setError("")
    setChatHistory([])
  }

  return (
    <div className="app">
      <p>
        What do you want to know?
        <button className="surprise" onClick={surprise} disabled={!chatHistory}>
          Surprise Me
        </button>
      </p>

      <div className="input-container">
        <input
          value={value}
          placeholder="How is the weather today in Delhi...?"
          onChange={(e) => setValue(e.target.value)}
        />
        {!error && <button onClick={getResponse}>Ask Me</button>}
        {error && <button onClick={clear}>Clear</button>}
      </div>
      {error && <p>{error}</p>}
      <div className="search-result">
        {chatHistory.map((chatItem, _index) => (
          <div key={""}>
            <p className="answer">
              {chatItem.role} : {chatItem.parts[0].text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
