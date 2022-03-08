import { Provider as StoreProvider } from 'react-redux';
import { store } from './store';
import { MainContainer } from './containers/MainContainer';
import { ThemeProvider, defaultTheme } from 'evergreen-ui';
function App() {
    return (
        <StoreProvider store={store}>
            <ThemeProvider value={defaultTheme}>
                <MainContainer />
            </ThemeProvider>
        </StoreProvider>
    );
}

export default App;
