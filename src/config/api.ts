const API_BASE_URL = import.meta.env.PROD 
  ? 'https://YOUR_RENDER_SERVICE_NAME.onrender.com/api'
  : 'http://localhost:5002/api';

export { API_BASE_URL }; 