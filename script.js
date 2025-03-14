const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to trigger Jenkins job
app.post('/trigger-build', async (req, res) => {
    const jenkinsUrl = 'http://jenkins-server/job/your-job-name/buildWithParameters';
    const jenkinsToken = 'your-jenkins-token';

    try {
        const response = await axios.post(jenkinsUrl, null, {
            params: {
                token: jenkinsToken
            },
            auth: {
                username: 'your-jenkins-username',
                password: 'your-jenkins-api-token'
            }
        });

        res.status(200).json({ message: 'Build triggered successfully!' });
    } catch (error) {
        console.error('Error triggering Jenkins job:', error);
        res.status(500).json({ message: 'Failed to trigger build' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
