import { expect, test as setup } from '@playwright/test';

type StatusResponse = {
    status: 'ok' | 'error';
}

setup('call status endpoint', async ({ }) => {
    const response = await fetch('http://127.0.0.1:8000/status');
    const data = await response.json() as StatusResponse;
    if (data.status === 'error') {
        throw new Error('Backend is not running');
    }
});