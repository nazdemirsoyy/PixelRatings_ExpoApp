import axios from "axios";

const key = '3a04f55006e145169c4c102f65ccba7f';
//const clientId = 'sanq3eltoc3mhq53ottxpkf05vje2t'; 

//Endpoints
const topRatedGamesEndpoint= `https://api.rawg.io/api/games?key=${key}`
const trendingGamesEndpoint = `https://api.rawg.io/api/games?key=${key}`
const upcomingGamesEndpoint = `https://api.rawg.io/api/games?key=${key}&dates=${new Date().toISOString().split('T')[0]},${new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]}&ordering=-added`;

const gameDetailsEndpoint = (gameId) => `https://api.rawg.io/api/games/${gameId}?key=${key}`;


const apiCall = async (endpoint, params) =>{
    const options ={
        method :'GET',
        url: endpoint,
        //headers: {
            //'Authorization': `Bearer ${token}`,
            //'Client-ID': clientId,
            //'Accept': 'application/json'
        //},
        params : params? params: {}
    }

    // Promise
    // return axios.request(options)
    //     .then(response => response.data)
    //     .catch(error => {
    //         console.log('error:', error);
    //         return {};
    //     });


    try{
        const response = await axios.request(options);
        return response.data;

    }catch(error){
        console.log('error:', error);
        return{}
    }

}


export const fetchTopRatedGames = () => {
    const params = {
        ordering: '-rating',   // This will order games by rating in descending order
        fields: 'name,rating,background_image', // Adjust to get necessary fields
        limit: 10         // This will limit the results to 10 games
    };
    return apiCall(topRatedGamesEndpoint, params);
}


export const fetchTrendingGames =() => {
    const params = {
        ordering: '-ratings_count',
        fields: 'name,background_image,ratings_count',
        page_size: 10
    };
    return apiCall(trendingGamesEndpoint, params);
}

export const fetchUpcomingGames = async () => {
    const params = {
        page_size: 10
    };
    return apiCall(upcomingGamesEndpoint);
}

  export const fetchGameDetails = async (gameId) => {
    return apiCall(gameDetailsEndpoint(gameId));
};


// export const searchGames = async (query) => {
//     console.log('Search query:', query);  

//     const endpoint = `https://api.rawg.io/api/games?key=${key}&search=${query}`;
//     const params = {
//         ordering: '-rating,-ratings_count', // Order by rating and then by ratings count
//         fields: 'name,background_image,rating,ratings_count',
//     };

//     // Convert the params object to a string of URL parameters
//     const paramString = Object.entries(params)
//         .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
//         .join('&');

//     // Append the params to the endpoint
//     const finalEndpoint = `${endpoint}&${paramString}`;
//     console.log('Final API Endpoint:', finalEndpoint);  

//     try {
//         const response = await apiCall(finalEndpoint);
//         console.log('API Response:', response);  

//         // Filter the results based on titles that contain the query (case-insensitive)
//         const filteredResults = response.results.filter(
//             game => game.name.toLowerCase().includes(query.toLowerCase())
//         );

//         return { ...response, results: filteredResults };
//     } catch (error) {
//         console.error('Error making API call:', error); 
//     }
// }


// This function should now handle both text search and genre search.

export const searchGames = async (query = '', genre = '') => {
    if (!query && !genre) {
      console.error("No search query or genre provided.");
      return { results: [] };
    }
  
    const endpoint = `https://api.rawg.io/api/games?key=${key}`;
    const params = new URLSearchParams({
      ordering: '-rating,-ratings_count', // Order by rating and then by ratings count
      fields: 'name,background_image,rating,ratings_count',
    });
  
    // Append search parameter only if there's a query
    if (query) {
      params.append('search', query);
    }
  
    // Append genres parameter only if there's a genre
    if (genre) {
      params.append('genres', genre); 
    }
  
    const finalEndpoint = `${endpoint}&${params.toString()}`;
    console.log('Final API Endpoint:', finalEndpoint);
  
    try {
      const response = await fetch(finalEndpoint);
      const data = await response.json();
      console.log('API Response:', data);
  
      return data.results ? { results: data.results } : { results: [] };
    } catch (error) {
      console.error('Error making API call:', error);
      return { results: [] };
    }
  }
  
// Function to fetch genres from the API
export const fetchGenres = async () => {
    const genreEndpoint = `https://api.rawg.io/api/genres?key=${key}`;
    try {
      const response = await fetch(genreEndpoint);
      const data = await response.json();
      return data.results; 
    } catch (error) {
      console.error('Error fetching genres:', error);
      return []; 
    }
  };