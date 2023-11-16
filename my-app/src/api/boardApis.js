import axiosClient from "./axiosClient";

const boardApi = {
    create:()=>axiosClient.post('boards'),
    getAll:()=>axiosClient.get('boards'),
    updatePosition:(params)=>axiosClient.put('boards',params),
    getParticularOne:(id)=>axiosClient.get(`boards/${id}`),
    deleteBoard:(id)=>axiosClient.put(`boards/${id}`),
    update:(id,params)=>axiosClient.put(`boards/${id}`,params),
    getFavourites: () => axiosClient.get('boards/favourites'),
    UpdateFavouritesPosition: (params) => axiosClient.get('boards/favourites',params),
}

export default boardApi