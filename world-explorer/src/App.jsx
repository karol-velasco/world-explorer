import { useEffect } from "react";

function App() {

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/name/colombia")
      .then(respuesta => respuesta.json())
      .then(datos => {
        console.log(datos);
      });
  }, []);

  return (
    <div>
      <h1>World Explorer</h1>
    </div>
  );
}

export default App;