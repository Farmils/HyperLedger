import './App.css'
import 'bootstrap/dist/css/bootstrap.css';
import {ContextProvider} from "../../core/context/Context.jsx";
import {RouterProvider} from "react-router-dom";
import {router} from "../../core/routes/Routes.jsx";

function App() {

  return (
      <ContextProvider>
          <RouterProvider router={router}/>
      </ContextProvider>
  )
}

export default App
