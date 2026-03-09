import React, { useState } from 'react';
import { Box, Button, Container, Paper, TextField, Typography } from '@mui/material';

import { authStore } from '@/stores/authStore';
import { connect } from '@/websocket/services';

export const LoginPage = () => {
    const [ key, setKey ] = useState('');
    const [ error, setError ] = useState('');

    const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = e => {
        e.preventDefault();
        const trimmed = key.trim();

        if (!trimmed) {
            setError('Введіть API ключ');
            return;
        }

        setError('');
        authStore.login(trimmed);
        connect(trimmed);
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Paper
                    elevation={ 3 }
                    sx={{
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    }}
                >
                    <Typography variant="h5" component="h1" gutterBottom> Вхід </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Введіть унікальний API ключ для підключення. Для демо: demo-key-123
                    </Typography>
                    <form onSubmit={ handleSubmit }>
                        <TextField
                            fullWidth
                            label="API ключ"
                            value={ key }
                            onChange={ e => setKey(e.target.value) }
                            error={ !!error }
                            helperText={ error }
                            autoFocus
                            autoComplete="off"
                            sx={{ mb: 2 }}
                        />
                        <Button type="submit" variant="contained" fullWidth size="large"> Увійти </Button>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
};
