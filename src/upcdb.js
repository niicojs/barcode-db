import axios from 'axios';

export const find = async (code) => {
  const apikey = process.env.UPC_API_TOKEN;
  const url = `https://api.upcdatabase.org/product/${code}?apikey=${apikey}`;
  const response = await axios.get(url);
  console.log(response.data);
  if (!response.data.success) {
    return null;
  } else {
    const info = response.data;
    return {
      code,
      name: info.title || info.description,
    };
  }
};
