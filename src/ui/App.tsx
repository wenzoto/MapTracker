import { CssBaseline } from '@mui/material';
import { observer } from 'mobx-react-lite';

import { authStore } from '@/stores/authStore';
import { LoginPage } from './LoginPage';
import { MapPage } from './MapPage';

export const App = observer(() => {
    return (
        <>
            <CssBaseline />
            {
                authStore.isAuthenticated
                    ? <MapPage />
                    : <LoginPage />
            }
        </>
    );
});
