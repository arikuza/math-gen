import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

const MAX_EXAMPLES = 1;

const DEFAULT_OPERATIONS = ["-", "+"];

const getResult = (operator: string, num1: number, num2: number) => {
  switch (operator) {
    case "+":
      return num1 + num2;
    case "-":
      return num1 - num2;
    case "*":
      return num1 * num2;
    default:
      return 0;
  }
};

function generateMathExamples(
  operations: string[],
  digits1: number,
  digits2: number
) {
  let result = -1;
  let num1, num2, operation, example;

  while (result < 0) {
    const max1 = Math.pow(10, digits1) - 1;
    const min1 = Math.pow(10, digits1 - 1);
    const max2 = Math.pow(10, digits2) - 1;
    const min2 = Math.pow(10, digits2 - 1);
    num1 = Math.floor(Math.random() * (max1 - min1 + 1)) + min1;
    num2 = Math.floor(Math.random() * (max2 - min2 + 1)) + min2;
    operation = operations[Math.floor(Math.random() * operations.length)];
    result = getResult(operation, num1, num2);
  }

  example = `${num1} ${operation} ${num2}`;
  return { example, result };
}

function App() {
  const [currentExample, setCurrentExample] = useState<{
    example: string;
    result: number;
  } | null>(null);
  const [userInput, setUserInput] = useState("");
  const [errorCount, setErrorCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(MAX_EXAMPLES);
  const [operators, setOperators] = useState(DEFAULT_OPERATIONS);
  const [digits1, setDigits1] = useState(1);
  const [digits2, setDigits2] = useState(1);
  const [globalResults, setGlobalResults] = useState({
    multiple: 0,
    one: 0,
    onePlusTen: 0,
    ten: 0,
  });

  useEffect(() => {
    setCurrentExample(generateMathExamples(operators, digits1, digits2));
  }, [digits1, digits2, operators]);

  const handleSubmit = () => {
    if (currentExample && parseInt(userInput) === currentExample.result) {
      setCorrectCount(correctCount + 1);
      if (correctCount === MAX_EXAMPLES - 1) {
        if (operators.includes("+") && digits1 === 1 && digits2 === 1) {
          setGlobalResults({ ...globalResults, one: globalResults.one + 1 });
        } else if (operators.includes("+") && digits1 === 1 && digits2 === 2) {
          setGlobalResults({
            ...globalResults,
            onePlusTen: globalResults.onePlusTen + 1,
          });
        } else if (operators.includes("+") && digits1 === 2 && digits2 === 2) {
          setGlobalResults({ ...globalResults, ten: globalResults.ten + 1 });
        } else if (operators.includes("*") && digits1 === 1 && digits2 === 1) {
          setGlobalResults({
            ...globalResults,
            multiple: globalResults.multiple + 1,
          });
        }
      }
    } else {
      setErrorCount(errorCount + 1);
    }
    setCurrentExample(generateMathExamples(operators, digits1, digits2));
    setUserInput("");
  };

  const handleInput = (value: string) => {
    setUserInput(userInput + value);
  };

  const handleDelete = () => {
    setUserInput(userInput.slice(0, -1));
  };

  const restart = () => {
    setCorrectCount(0);
    setErrorCount(0);
    setUserInput("");
  };

  const isOver = correctCount === MAX_EXAMPLES;

  const startPlus = (digits1: number, digits2: number) => {
    restart();
    setDigits1(digits1);
    setDigits2(digits2);
    setOperators(DEFAULT_OPERATIONS);
    setCurrentExample(
      generateMathExamples(DEFAULT_OPERATIONS, digits1, digits2)
    );
  };

  const startMultiple = (digits1: number, digits2: number) => {
    restart();
    setDigits1(digits1);
    setDigits2(digits2);
    setOperators(["*"]);
    setCurrentExample(generateMathExamples(["*"], digits1, digits2));
  };

  return (
    <div className="App flex flex-col h-screen justify-between">
      <div className="flex justify-between items-center p-4">
        <div>
          Правильно {correctCount} из {MAX_EXAMPLES}
        </div>
        <div>Количество ошибок: {errorCount}</div>
      </div>
      <div className="flex flex-col items-center justify-center flex-grow">
        {/* Пример */}
        {isOver ? (
          <>
            <button
              onClick={() => startMultiple(1, 1)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 mx-8"
            >
              Умножение ({globalResults.multiple})
            </button>
            <button
              onClick={() => startPlus(1, 1)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 mx-8"
            >
              Сложение единиц ({globalResults.one})
            </button>
            <button
              onClick={() => startPlus(1, 2)}
              className="bg-blue-500 hover:bg-blue-7000 text-white font-bold py-2 px-4 rounded mb-4 mx-8"
            >
              Сложение единиц и десятков ({globalResults.onePlusTen})
            </button>
            <button
              onClick={() => startPlus(2, 2)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 mx-8"
            >
              Сложение десятков ({globalResults.ten})
            </button>
          </>
        ) : (
          <>
            <div className="example text-4xl font-bold mb-4">
              {currentExample?.example} = ?
            </div>
            {/* Ввод ответа */}
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="input bg-gray-200 p-2 rounded"
            />
          </>
        )}
      </div>

      {/* Клавиатура */}
      {isOver ? null : (
        <>
          <div className="flex flex-col items-center mt-auto max-w-xl mb-4">
            <div className="flex flex-wrap justify-center">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => handleInput(num.toString())}
                  className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 m-1 rounded"
                  style={{ width: "25%" }}
                >
                  {num}
                </button>
              ))}
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 m-1 rounded"
                style={{ width: "25%" }}
              >
                Удалить
              </button>
              <button
                key={0}
                onClick={() => handleInput("0")}
                className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 m-1 rounded"
                style={{ width: "25%" }}
              >
                0
              </button>
              <div style={{ width: "25%" }}></div>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 mx-8"
          >
            Проверить
          </button>
        </>
      )}
    </div>
  );
}

export default App;
