const fetch = require('node-fetch');

const url = 'https://api.graphic.ccenter.uz/api/v1/Auth/forbot/one';


async function fetchData(name) {
  try {
    const params = new URLSearchParams({ name: name});
    const response = await fetch(`${url}?${params.toString()}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // console.log('Response:', data);
    return data
  } catch (error) {
    console.error('Error:', error.message);
  }
}


module.exports = {
    fetchData
}
