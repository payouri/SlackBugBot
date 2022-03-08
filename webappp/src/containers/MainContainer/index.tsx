import { useAuthentication } from '../../customHooks/useAuthentication';
import { LoggedApp } from '../LoggedApp';
import { AppContainer } from './style';

export const MainContainer = () => {
    useAuthentication({});

    return (
        <AppContainer>
            <LoggedApp />
        </AppContainer>
    );
};
