const API_BASE_URL = import.meta.env.PROD 
  ? 'https://wudassie-database.onrender.com/api'
  : 'http://localhost:5002/api';

export { API_BASE_URL }; 