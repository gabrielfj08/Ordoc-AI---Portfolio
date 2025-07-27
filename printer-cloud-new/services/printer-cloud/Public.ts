import axios from 'axios';

const about = () => {
  return axios.get('/api/v3/printer_cloud/about');
};

const About = {
  about,
};

export default About;
