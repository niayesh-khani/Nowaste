import{ createMuiTheme, ThemeProvider} from '@material-ui/core'
import { purple } from '@material-ui/core/colors';
import { BrowserRouter as Router, Route} from 'react-router-dom'
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPass from './pages/ForgotPass'
import Verification from './pages/Verification';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#fefefe'
    },
    secondary: purple
  }
})
function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
          <Route exact path="/sign-up">
            <SignUp />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path='/forgotpass'>
            <ForgotPass />
          </Route>
          <Route path="/verification">
            <Verification />
          </Route>
      </Router>
    </ThemeProvider>
  );
}

export default App;
